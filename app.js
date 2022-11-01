require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var passport = require("passport")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { getJwtStrategy } = require("./middlewares/passport")
const globalErrorHandler = require("./middlewares/globalErrorHandler")

var app = express();

// =======================
// Connecting MongoDB
// =======================
try{
	(async()=>{
	 await mongoose.connect(process.env.DB_URL);
		console.log("Database connected Successfully");
	})();
}catch(err)
{
	console.log(err);
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(getJwtStrategy())
app.use(globalErrorHandler)


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
