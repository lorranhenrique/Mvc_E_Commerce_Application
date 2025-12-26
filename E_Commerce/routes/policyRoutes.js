var express = require('express');
var router = express.Router();
const policyController = require('../controllers/policyController')

router.get('/', policyController.acessPolicies);

module.exports = router;
