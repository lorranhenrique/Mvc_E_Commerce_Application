var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController')

router.get('/', loginController.loginIndex);
router.post('/', loginController.loginUser);

module.exports = router;
