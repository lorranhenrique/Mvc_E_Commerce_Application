var express = require('express');
var router = express.Router();
var pagamentoController = require("../controllers/pagamentoController");
var {requireAuth} =  require("../middlewares/authMiddleware");

router.post('/',requireAuth, pagamentoController.pagamentoIndex);
router.post('/efetuarPagamento', requireAuth, pagamentoController.efetuarPagamento);

module.exports = router;
