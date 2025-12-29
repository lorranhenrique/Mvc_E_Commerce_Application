const User = require('../models/user');
const Product = require('../models/product');

const carrinhoIndex = async (req,res) =>{
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

        res.render('carrinho', { 
            path: "/carrinho", 
            carrinho: produtosDetalhados,
            totalGeral: totalGeral
        });
    } catch (err) {
        console.error("Erro ao carregar carrinho:", err);
        res.status(500).send("Erro interno no servidor");
    }
}

const adicionarNoCarrinho = async (req, res) => {
    const produtoId = req.params.id;

    if (!req.session.carrinho) req.session.carrinho = [];
    
    const index = req.session.carrinho.findIndex(item => item.id === produtoId);

    if (index > -1) {
        req.session.carrinho[index].quantidade += 1;
        console.log('Carrinho Atual:', req.session.carrinho);
        res.redirect('/produtos');
        return
    }
    req.session.carrinho.push({ id: produtoId, quantidade: 1 });
    console.log('Carrinho Atual:', req.session.carrinho);
    res.redirect('/produtos');
}

const removerDoCarrinho =(req,res) =>{
    const produtoId = req.params.id;

    const index = req.session.carrinho.findIndex(item => item.id === produtoId);

    if(index < 0){
        console.log('Produto não encontrado');
        res.redirect('/produtos');
    }

    if(req.session.carrinho[index].quantidade > 1){
        req.session.carrinho[index].quantidade--;
        res.redirect('/carrinho')
        return
    }

    req.session.carrinho.splice(index, 1);
    console.log('Produto removido:', req.session.carrinho);
    res.redirect('/carrinho')

}

const getQuantidade = async (req) => {
    if (req.session && req.session.carrinho) {
        return req.session.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }
    return 0;
}

module.exports ={
    carrinhoIndex,
    adicionarNoCarrinho,
    getQuantidade,
    removerDoCarrinho,
}