var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/usersRoutes');
var produtosRouter = require('./routes/produtosRoutes');
var cadastroRouter = require('./routes/cadastroRoutes');
var loginRouter = require('./routes/loginRoutes');
var pagamentoRouter = require('./routes/pagamentoRoutes');
var carrinhoRouter = require('./routes/carrinhoRoutes');
var produtoRouter = require('./routes/produtoRoutes');
var policyRouter = require('./routes/policyRoutes');

var app = express();
app.use(express.static('public'));

const dbURI = "mongodb+srv://lorrao:test1234@ecommercecluster.dgrvew8.mongodb.net/ECommerce?appName=EcommerceCluster";

mongoose.connect(dbURI)
  .then((result) => console.log('connected to data base'))
  .catch((err) => console.log(err))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/produtos', produtosRouter);
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/pagamento', pagamentoRouter);
app.use('/carrinho', carrinhoRouter);
app.use('/produto', produtoRouter);
app.use('/policy', policyRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
