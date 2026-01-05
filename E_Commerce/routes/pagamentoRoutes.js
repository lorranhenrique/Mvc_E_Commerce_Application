var express = require('express');
var router = express.Router();
var pagamentoController = require("../controllers/pagamentoController");

router.post('/', pagamentoController.pagamentoIndex);
router.post('/efetuarPagamento', pagamentoController.efetuarPagamento);

module.exports = router;
