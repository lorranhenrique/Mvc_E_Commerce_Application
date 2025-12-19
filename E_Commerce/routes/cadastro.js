var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('cadastro',{path: "/cadastro"});
});

module.exports = router;
