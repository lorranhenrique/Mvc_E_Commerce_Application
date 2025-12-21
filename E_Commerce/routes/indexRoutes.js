var express = require('express');
var router = express.Router();
const User = require('../models/user');
const indexController = require('../controllers/indexController')
const {requireAuth} = require('../middlewares/authMiddleware');

router.get('/',requireAuth, indexController.acessIndex);

module.exports = router;
