var compression = require('compression');
var helmet = require('helmet');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config({
  path:path.join(__dirname,"../.env"),
})
//Set up mongoose connection
const mongoose = require('mongoose');
const dev_db_url = 'mongodb+srv://Harsh:Whitegoat@99@cluster0.lwcge.mongodb.net/local_library?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const expressHbs = require("express-handlebars");

const ifEquality = require("./views/helpers/ifEquality");
const ifNotEqual = require("./views/helpers/ifNotEqual");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog'); 
const helpers = require('handlebars-helpers');

const app = express();
app.use(helmet());
app.use(compression()); //Compress all routes
// Creating handlebars engine

const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifEquality,
    ifNotEqual
  }
});
//Handlebars.registerHelper('ifEquality',(a, b) => a === b)

// view engine setup
app.engine(".hbs", hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
