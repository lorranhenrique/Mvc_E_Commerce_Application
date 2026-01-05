const User = require('../models/user');
const Product = require('../models/product');

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

const efetuarPagamento = async (req,res) =>{

}


module.exports = {
    pagamentoIndex,
    efetuarPagamento,
}