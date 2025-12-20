const User = require('../models/user');
const bcrypt = require('bcrypt');

const loginIndex = (req,res)=>{
    res.render('login',{path: '/login'});
}

const loginUser = async (req, res) => {
    let { email, senha } = req.body;
    const emailTratado = email.trim().toLowerCase();

    try {
        const usuario = await User.findOne({ email: emailTratado });

        if (!usuario) {
            return res.redirect('/login?error=LoginError');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) {
            return res.redirect('/');
        } 
        return res.redirect('/login?error=LoginError');
        
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro interno');
    }
}

module.exports = {
    loginIndex,
    loginUser,
}