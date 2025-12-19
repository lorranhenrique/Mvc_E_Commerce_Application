var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index',{path: "/index"});
});

module.exports = router;
