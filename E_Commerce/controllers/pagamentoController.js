const User = require('../models/user');
const Product = require('../models/product');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

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

        res.render('pagamento', {
            path: "/pagamento",
            carrinho: produtosDetalhados, 
            totalGeral: totalGeral
        });

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
            payer: {
                email: userBD.email.toLowerCase().trim(),
            },
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
        const cleanFirstName = (payer.first_name || "").trim();
        const cleanLastName = (payer.last_name || "").trim();

        const body = {
            transaction_amount: Number(transaction_amount),
            description: "Compra na Loja Gamer",
            payment_method_id,
            payer: {
                email: payer.email.trim(),
                first_name: (payer.first_name || "").trim(),
                last_name: (payer.last_name || "").trim(),
                identification: {
                    type: "CPF",
                    number: payer.identification?.number?.replace(/\D/g, "")
                },
                address: {
                    zip_code: payer.address?.zip_code?.replace(/\D/g, ""),
                    street_name: payer.address?.street_name,
                    street_number: payer.address?.street_number?.replace(/\D/g, "") || "SN",
                    neighborhood: payer.address?.neighborhood,
                    city: payer.address?.city,
                    federal_unit: payer.address?.federal_unit
                }
            },
            token: (payment_method_id === 'pix' || payment_method_id === 'bolbradesco') ? undefined : token,
            issuer_id: (payment_method_id === 'pix' || payment_method_id === 'bolbradesco') ? undefined : issuer_id,
            installments: Number(installments || 1)
        };

        const result = await payment.create({ body });

        console.log("--- RESPOSTA MP --- Status:", result.status, "| Detalhe:", result.status_detail);

        res.status(201).json({
            status: result.status,
            status_detail: result.status_detail,
            id: result.id,
            transaction_details: result.transaction_details,
            qr_code: result.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        });

    } catch (err) {
        console.error("--- ERRO NO PROCESSAMENTO ---");
        if (err.cause && Array.isArray(err.cause)) {
            err.cause.forEach(detalhe => {
                console.error(`- Campo: ${detalhe.location} | Erro: ${detalhe.description}`);
            });
        } else {
            console.error(err);
        }
        res.status(500).json({ error: "Erro interno", details: err.cause?.[0]?.description });
    }
};

module.exports = {
    pagamentoIndex,
    efetuarPagamento,
    processarPagamento
};