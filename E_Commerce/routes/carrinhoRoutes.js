var express = require('express');
var router = express.Router();
var carrinhoController = require('../controllers/carrinhoController')

router.get('/', carrinhoController.carrinhoIndex);
router.post('/:id', carrinhoController.adicionarNoCarrinho);
router.get('/quantidade', carrinhoController.getQuantidade);
router.post('/remover/:id', carrinhoController.removerDoCarrinho)


module.exports = router;
