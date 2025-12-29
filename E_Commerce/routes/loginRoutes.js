var express = require('express');
var router = express.Router();
var loginController = require('../controllers/loginController');
var logoutController = require('../controllers/logoutController');

router.get('/', loginController.loginIndex);
router.post('/', loginController.loginUser);
router.get('/logout',logoutController.logout_index);

module.exports = router;
