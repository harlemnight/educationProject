var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var lessMiddleware = require('less-middleware');


/*
* mongoose version controller
* */
var index = require('./routes/index');
var employee = require('./routes/employee');
var baby = require('./routes/baby');
var course = require('./routes/course');


/*
* mysql version controller
* */
/*
var index_mysql = require('./routes/mysql/index');*/
var employee_mysql = require('./routes/mysql/employee');/*
var baby_mysql = require('./routes/mysql/baby');
var course_mysql = require('./routes/mysql/course');*/


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express); //变更ejs后缀 为html
app.set('view engine', 'html');//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


/*
* mongoose version controller
* */
app.use('/', index);
app.use('/employee',employee);
app.use('/baby',baby);
app.use('/course',course);


/*
* mysql version controller
* *//*
app.use('/mysql/', index_mysql);*/
app.use('/mysql/employee',employee_mysql);/*
app.use('/mysql/baby',baby_mysql);
app.use('/mysql/course',course_mysql);*/


/*
* 自定义应用域方法
* */
app.locals['toLocalDate'] = function(format){
  if (format==null) {
      return null;
  }else {
      return format.toLocaleDateString();
  }

  };

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
