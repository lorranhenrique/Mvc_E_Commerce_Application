const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createToken = (id) => jwt.sign({id}, 'segredo', {expiresIn: 200*60*50})

const loginUser = async (req, res) => {
    let { email, senha } = req.body;
    const emailTratado = email.trim().toLowerCase();

    try {
        const usuario = await User.findOne({ email: emailTratado });

        if (!usuario) {
            return res.redirect('/login?error=LoginError');
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (senhaCorreta) 
        {
            const token = createToken(usuario._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 200*60*50});
            return res.redirect(`/?token=${token}, user=${usuario}`);
        } 
        return res.redirect('/login?error=LoginError');
        
    } catch (err) {
        console.error(err);
        return res.status(500).send('Erro interno');
    }
}

const loginIndex = (req,res) => res.render('login',{path: '/login'});

module.exports = {
    loginIndex,
    loginUser,
}