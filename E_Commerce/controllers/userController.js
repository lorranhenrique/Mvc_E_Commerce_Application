const User = require('../models/user');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const user = new User({
            nome: nome.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            senha: senhaCriptografada
        });

        await user.save();
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao cadastrar usuário.");
    }
}

module.exports = {
    createUser
}