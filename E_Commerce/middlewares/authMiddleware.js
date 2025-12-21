const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token)
    {
         res.send('<script>alert("Seu login expirou,autentificação necessária"); window.location.href = "/login";</script>');
    }

    jwt.verify(token, 'segredo', (err, decodedToken) => {
        if (err) {
            res.status(401).send('<script>alert("Token Inválido"); window.location.href = "/login";</script>');
        } 
        next();
    });
};

module.exports = { requireAuth };