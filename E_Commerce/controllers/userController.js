const User = require('../models/user');

const createUser = (req,res)=>{
    const user = new User(req.body);

    user.save()
        .then(()=>{
        res.redirect('/');
        })
        .catch((err)=>{
        console.log(err);
        })
}

module.exports = {
    createUser
}