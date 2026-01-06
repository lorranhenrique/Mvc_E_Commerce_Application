const User = require('../models/user');
const Product = require('../models/product');

const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken
});

const pagamentoIndex = async (req,res) =>{
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
            console.error("Erro ao carregar pagamento:", err);
            res.status(500).send("Erro interno no servidor");
        }
}

const efetuarPagamento = async (req, res) => {
    try {
        const itensCarrinho = req.session.carrinho || [];
        const items = [];
        
        for (const item of itensCarrinho) {
            const produtoBD = await Product.findById(item.id);
            if (produtoBD) {
                items.push({
                    id: produtoBD._id.toString(),
                    title: produtoBD.nome,
                    quantity: item.quantidade,
                    unit_price: Number(produtoBD.preco),
                    currency_id: 'BRL'
                });
            }
        }

        const preference = new Preference(client);
        const body = {
            items: items,
            back_urls: {
                success: "https://localhost:3000/",
                failure: "https://localhost:3000/erro",
                pending: "https://localhost:3000/"
            },
            auto_return: "approved",
        };

        const result = await preference.create({ body });
        
        res.render('checkout', { 
            preferenceId: result.id,
            publicKey: process.env.publicKey
        }); 

    } catch (err) {
        console.error("Erro ao criar preferência:", err);
        res.status(500).send("Erro ao gerar link de pagamento");
    }
};


module.exports = {
    pagamentoIndex,
    efetuarPagamento,
}