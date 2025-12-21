var express = require('express');
var router = express.Router();
var userController = require("../controllers/userController");
var cadastroController = require("../controllers/cadastroController");

router.get('/', cadastroController.cadastroIndex);
router.post('/', userController.createUser);

module.exports = router;
