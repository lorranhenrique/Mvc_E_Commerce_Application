const User = require('../models/user');

const cadastroIndex = (req,res)=>{
    res.render('cadastro',{path: '/cadastro'});
}

module.exports = {
    cadastroIndex
}