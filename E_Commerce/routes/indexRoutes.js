var express = require('express');
var router = express.Router();
const User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('index',{path: "/index"});
});

module.exports = router;
