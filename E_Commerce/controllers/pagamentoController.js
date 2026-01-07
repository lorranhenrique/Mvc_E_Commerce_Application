const User = require('../models/user');
const Product = require('../models/product');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
            if (produtoBD) {
                const subtotal = produtoBD.preco * item.quantidade;
                totalGeral += subtotal;

                produtosDetalhados.push({
                    info: produtoBD,
                    quantidade: item.quantidade,
                    subtotal: subtotal
                });
            }
        }

        res.render('pagamento', {
            path: "/pagamento",
            carrinho: produtosDetalhados,
            totalGeral: totalGeral
        });
    } catch (err) {
        console.error("Erro ao carregar pagamento Index:", err);
        res.status(500).send("Erro interno no servidor");
    }
};

const efetuarPagamento = async (req, res) => {
    try {
        const itensCarrinho = req.session.carrinho || [];
        const items = [];
        let totalGeral = 0;

        for (const item of itensCarrinho) {
            const produtoBD = await Product.findById(item.id);
            if (produtoBD) {
                const preco = Number(produtoBD.preco);
                const qtd = Number(item.quantidade);
                totalGeral += (preco * qtd);

                items.push({
                    id: produtoBD._id.toString(),
                    title: produtoBD.nome,
                    quantity: qtd,
                    unit_price: preco,
                    currency_id: 'BRL'
                });
            }
        }

        const userId = req.user.id || req.user._id;
        const userBD = await User.findById(userId);

        if (!userBD || !userBD.email) {
            return res.status(400).send("E-mail do usuário não encontrado no banco.");
        }

        const preference = new Preference(client);

        const body = {
            items: items,
            payer: {
                email: userBD.email.toLowerCase().trim(),
            },
            metadata: {
                test_mode: true,
                user_id_interno: userId.toString()
            }
        };

        const result = await preference.create({ body });

        res.render('checkout', {
            preferenceId: result.id,
            publicKey: process.env.publicKey,
            totalGeral: totalGeral
        });

    } catch (err) {
        console.error("Erro ao criar Preferência:", err);
        res.status(500).send("Erro ao gerar link de pagamento");
    }
};

const processarPagamento = async (req, res) => {
    try {
        const payment = new Payment(client);

        const body = {
            transaction_amount: Number(req.body.transaction_amount),
            description: "Pedido Loja Gamer",
            payment_method_id: "pix",
            payer: {
                email: req.body.payer.email.toLowerCase().trim()
            }
        };

        const result = await payment.create({ body });

        res.status(201).json({
            status: result.status,
            id: result.id,
            qr_code: result.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
        });

    } catch (err) {
        console.error("ERRO NO PROCESSAMENTO:", err.message);
        if (err.cause) {
            console.error("CAUSA DETALHADA:", JSON.stringify(err.cause));
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    pagamentoIndex,
    efetuarPagamento,
    processarPagamento
};