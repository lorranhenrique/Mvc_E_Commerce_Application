const User = require('../models/user');
const Product = require('../models/product');

const acessProducts = (req, res) => {
    const search = req.query.search;
    const order = req.query.order;
    const statusPagamento = req.query.status; 
    const pixSucesso = req.query.sucesso;

    if (statusPagamento === 'success' && req.session.carrinho.length > 0) {
        req.session.carrinho = [];
        return req.session.save(() => {
            res.redirect('/produtos?status=confirmed');
        });
    }
    const mostrarAlerta = statusPagamento === 'success' || statusPagamento === 'confirmed' || pixSucesso === 'true';

    let filtro = {};
    if (search) {
        filtro = {
            $or: [
                { nome: { $regex: search, $options: 'i' } },
                { descricao: { $regex: search, $options: 'i' } }
            ]
        };
    }

    let ordenacao = {};
    switch (order) {
        case 'nome_asc': ordenacao = { nome: 1 }; break;
        case 'nome_desc': ordenacao = { nome: -1 }; break;
        case 'preco_asc': ordenacao = { preco: 1 }; break;
        case 'preco_desc': ordenacao = { preco: -1 }; break;
        default: ordenacao = { _id: 1 }; break;
    }

    Product.find(filtro)
        .sort(ordenacao)
        .then((result) => {
            res.render('produtos', { 
                path: "/produtos", 
                produtos: result, 
                search: search || "",
                order: order || "",
                alerta: mostrarAlerta ? 'success' : null
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Erro ao processar os produtos");
        });
}

const createProduto = async (req, res) =>{
    try {
        const { nome, quantidade, preco, imgUrl } = req.body;

        const produto = new Product({
            nome: nome.trim().toLowerCase(),
            quantidade: quantidade,
            preco: preco,
            imgUrl: imgUrl
        });

        await produto.save();
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao cadastrar produto.");
    }
}

module.exports = {
    acessProducts,
    createProduto
}