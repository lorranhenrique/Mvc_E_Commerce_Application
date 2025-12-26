const User = require('../models/user');
const Product = require('../models/product');


const acessPolicies = (req, res) =>{
    res.render('policy',{path: "/policy"});
}

module.exports = {
    acessPolicies,
}