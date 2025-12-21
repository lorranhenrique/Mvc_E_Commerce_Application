const User = require('../models/user');
const Product = require('../models/product');


const acessIndex = (req, res) =>{
    res.render('index',{path: "/index"});
}

module.exports = {
    acessIndex,
}