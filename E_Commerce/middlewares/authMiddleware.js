const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'segredo', (err, decodedToken) => {
            if (err) {
                res.status(401).send('<script>alert("Token Inválido"); window.location.href = "/login";</script>');
            } else {
                next();
            }
        });
    } else {
        res.send('<script>alert("Seu login expirou,autentificação necessária"); window.location.href = "/login";</script>');
    }
};

module.exports = { requireAuth };