var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('produtos',{path: '/produtos'});
});

module.exports = router;
