const jwt = require('jsonwebtoken');

const logout_index = (req,res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.send('<script>alert("Logout Executado"); window.location.href = "/";</script>');
}

module.exports = {
    logout_index
}