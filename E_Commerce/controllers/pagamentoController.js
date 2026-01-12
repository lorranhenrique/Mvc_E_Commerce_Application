const User = require('../models/user');
const Product = require('../models/product');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const nodemailer = require('nodemailer');

const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
    options: { timeout: 10000 }
});

const pagamentoIndex = async (req, res) => {
    
    try {
        const itensCarrinho = req.session.carrinho || [];
        const produtosDetalhados = [];
        let totalGeral = 0;

        for (const item of itensCarrinho) {
            const produtoBD = await Product.findById(item.id);

            if (!produtoBD) continue

            const subtotal = produtoBD.preco * item.quantidade;
            totalGeral += subtotal;

            produtosDetalhados.push({
                info: produtoBD,
                quantidade: item.quantidade,
                subtotal: subtotal
            });
        }

        res.render('pagamento', {path: "/pagamento", carrinho: produtosDetalhados, totalGeral: totalGeral});

    } catch (err) {
        console.error("Erro ao carregar resumo de pagamento:", err);
        res.status(500).send("Erro interno no servidor");
    }
};

const efetuarPagamento = async (req, res) => {
    try {

        if (!req.user) return res.status(401).send("Você precisa estar logado.");

        const itensCarrinho = req.session.carrinho || [];

        if (itensCarrinho.length === 0) return res.status(400).send("Seu carrinho está vazio.");
        
        const userId = req.user._id || req.user.id;
        const userBD = await User.findById(userId);

        if (!userBD) return res.status(404).send("Usuário não encontrado.");

        const items = [];
        for (const item of itensCarrinho) {
            const produtoBD = await Product.findById(item.id);

            if (!produtoBD) continue;

            items.push({
                id: produtoBD._id.toString(),
                title: produtoBD.nome,
                quantity: Number(item.quantity || item.quantidade),
                unit_price: Number(produtoBD.preco),
                currency_id: 'BRL'
            });
        }

        if (items.length === 0) return res.status(400).send("Nenhum produto válido encontrado no carrinho.");
        
        const totalGeral = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
        const preference = new Preference(client);
        const body = {
            items,
            payer: {email: userBD.email.toLowerCase().trim()},
            back_urls: {
                success: `${req.protocol}://${req.get('host')}/produtos?status=success`,
                failure: `${req.protocol}://${req.get('host')}/carrinho?status=failure`,
                pending: `${req.protocol}://${req.get('host')}/carrinho?status=pending`,
            },
            auto_return: "approved",
        };
        const result = await preference.create({ body });
        res.render('checkout', {
            preferenceId: result.id,
            publicKey: process.env.publicKey,
            totalGeral: totalGeral,
            user: userBD
        });

    } catch (err) {
        console.error("Erro ao criar Preferência:", err);
        res.status(500).send("Erro ao processar checkout.");
    }
};

const processarPagamento = async (req, res) => {
    try {
        const payment = new Payment(client);
        const { transaction_amount, payment_method_id, payer, token, installments, issuer_id } = req.body;

        const isTicketOrPix = payment_method_id === 'pix' || payment_method_id === 'bolbradesco' || payment_method_id === 'pec';

        const body = {
            transaction_amount: Number(transaction_amount),
            description: "Compra na Loja Gamer",
            payment_method_id,
            external_reference: payer.email.trim(), 
            payer: {
                email: payer.email.trim(),
                first_name: (payer.first_name || "Cliente").trim(),
                last_name: (payer.last_name || "Gamer").trim(),
                identification: {
                    type: payer.identification?.type || "CPF",
                    number: payer.identification?.number?.replace(/\D/g, "")
                },
                address: {
                    zip_code: payer.address?.zip_code?.replace(/\D/g, "") || "00000000",
                    street_name: payer.address?.street_name || "Rua",
                    street_number: payer.address?.street_number || "SN",
                    neighborhood: payer.address?.neighborhood || "Bairro",
                    city: payer.address?.city || "Cidade",
                    federal_unit: payer.address?.federal_unit || "SP"
                }
            },
            token: isTicketOrPix ? undefined : token,
            issuer_id: isTicketOrPix ? undefined : issuer_id,
            installments: Number(installments || 1),
            additional_info: {
                items: req.session.carrinho.map(item => ({
                    id: item.id,
                    title: "Produto Gamer",
                    quantity: item.quantity || item.quantidade,
                    unit_price: Number(item.preco || (transaction_amount / (item.quantity || item.quantidade)))
                }))
            }
        };

        const result = await payment.create({ body });
        res.status(201).json({
            status: result.status,
            status_detail: result.status_detail,
            id: result.id,
            transaction_details: result.transaction_details,
            qr_code: result.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
            external_resource_url: result.transaction_details?.external_resource_url
        });
    } catch (err) {
        console.error("Erro Processar:", err);
        res.status(500).json({ error: "Erro interno" });
    }
};

const webhookPagamento = async (req, res) => {
    try {
        const { action, data } = req.body;
        const paymentId = data?.id || req.query['data.id'];

        console.log(`--- Notificação recebida: ID ${paymentId} ---`);

        if (paymentId === "123456") {
            console.log("Aviso: Teste de Webhook detectado (ID fictício). Tudo OK!");
            return res.sendStatus(200);
        }

        if (paymentId && (action === "payment.created" || action === "payment.updated" || req.query.type === 'payment')) {
            const payment = new Payment(client);
            const statusPagamento = await payment.get({ id: paymentId });

            console.log("Status Real do Pagamento:", statusPagamento.status);

            if (statusPagamento.status === 'approved') {
                await finalizarOrdemDeCompra(statusPagamento);
            }
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Erro no processamento do Webhook:", err.message);
        res.sendStatus(200); 
    }
};

const finalizarOrdemDeCompra = async (paymentData) => {
    const userEmail = 
        paymentData.external_reference || 
        paymentData.payer?.email || 
        paymentData.additional_info?.payer?.email;

    const itens = paymentData.additional_info?.items || [];

    console.log(`--- PROCESSANDO ENTREGA PARA: ${userEmail} ---`);

    if (!userEmail) {
        console.error("ERRO: Destinatário não encontrado no pagamento aprovado.");
        return;
    }
    for (const item of itens) {
        try {
            const produto = await Product.findById(item.id);
            if (produto) {
                produto.quantidade -= Number(item.quantity);
                await produto.save();
                
                await enviarEmailChave(userEmail, produto.nome, produto.key);
                console.log(`Sucesso: Chave de ${produto.nome} enviada para ${userEmail}`);
            }
        } catch (error) {
            console.error(`Erro ao entregar item ${item.id}:`, error.message);
        }
    }
};

async function enviarEmailChave(emailDestino, nomeJogo, chave) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"Minha Loja Gamer" <${process.env.EMAIL_USER}>`,
        to: emailDestino.trim(), 
        subject: `Sua chave de ${nomeJogo} chegou! 🎮`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #673ab7;">Obrigado pela sua compra!</h2>
                <p>O pagamento do jogo <strong>${nomeJogo}</strong> foi confirmado.</p>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 18px; border: 1px dashed #673ab7;">
                    Sua Chave: ${chave}
                </div>
                <p style="font-size: 12px; color: #777; margin-top: 20px;">Se precisar de ajuda, entre em contato com nosso suporte.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

const consultarStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = new Payment(client);
        const result = await payment.get({ id });

        res.json({ status: result.status });
    } catch (err) {
        console.error("Erro ao consultar status:", err);
        res.status(500).json({ error: "Erro ao consultar status" });
    }
};

module.exports = {
    pagamentoIndex,
    efetuarPagamento,
    processarPagamento,
    webhookPagamento,
    consultarStatus
};