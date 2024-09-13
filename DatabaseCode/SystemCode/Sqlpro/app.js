var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let salaryView = require('./routes/add');
let addData = require('./routes/addData');
let updateData = require('./routes/updateData');
let configRouter = require('./routes/config').router;
const cors = require("cors");
var app = express();
const { connectToDatabase, getDbConfig } = require('./public/db');

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/updateConfig', configRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);
app.use('/salaryView', salaryView);
app.use('/addData', addData);
app.use('/updateData', updateData);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// 初始数据库连接尝试（会失败，直到配置更新）
const dbConfig = getDbConfig();
if (dbConfig.server && dbConfig.userName && dbConfig.password && dbConfig.database) {
    connectToDatabase();
} else {
    console.log('等待数据库配置...');
}

module.exports = app;
