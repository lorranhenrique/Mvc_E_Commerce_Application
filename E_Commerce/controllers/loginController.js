const User = require('../models/user');

const loginIndex = (req,res)=>{
    res.render('login',{path: '/login'});
}

const loginUser = (req,res)=>{

}

module.exports = {
    loginIndex,
    loginUser,
}