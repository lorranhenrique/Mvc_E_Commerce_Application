var express = require('express');
var router = express.Router();
var pagamentoController = require("../controllers/pagamentoController");
var {requireAuth} =  require("../middlewares/authMiddleware");

router.post('/',requireAuth, pagamentoController.pagamentoIndex);
router.post('/efetuarPagamento', requireAuth, pagamentoController.efetuarPagamento);
router.post('/processar', requireAuth, pagamentoController.processarPagamento);
router.post('/webhook', pagamentoController.webhookPagamento);
router.get('/status/:id', requireAuth, pagamentoController.consultarStatus);

module.exports = router;
