const User = require('../models/user');
const Product = require('../models/product');

const acessProduct = async (req, res) => {
    try {
        const idBuscado = req.params.id;
        const produto = await Product.findById(idBuscado);

        if (!produto) {
            return res.status(404).send("Produto não encontrado");
        }

        res.render('produto', { produto: produto });
        
    } catch (error) {
        res.status(500).send("Erro ao buscar produto");
    }
}

module.exports = {
    acessProduct,
}