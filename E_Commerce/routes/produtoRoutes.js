var express = require('express');
var router = express.Router();
var {requireAuth} = require('../middlewares/authMiddleware');
var produtoController = require('../controllers/produtoController');

router.get('/:id', produtoController.acessProduct);

module.exports = router;