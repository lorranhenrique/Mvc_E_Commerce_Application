var express = require('express');
var router = express.Router();
var {requireAuth} = require('../middlewares/authMiddleware')
var produtosController = require('../controllers/produtosController')

router.get('/',requireAuth,produtosController.acessProducts);

module.exports = router;
