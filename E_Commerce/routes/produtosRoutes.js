var express = require('express');
var router = express.Router();
var {requireAuth} = require('../middlewares/authMiddleware')
var produtosController = require('../controllers/produtosController')

router.get('/',produtosController.acessProducts);
router.post('/', produtosController.createProduto);

module.exports = router;
