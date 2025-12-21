const User = require('../models/user');
const Product = require('../models/product');

const acessProducts = (req, res) =>{
    res.render('produtos',{path: "/produtos"});
}

module.exports = {
    acessProducts,
}