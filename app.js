require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var passport = require("passport")
const fileUpload = require('express-fileupload');
var { getJwtStrategy } = require("./middlewares/passport")
const globalErrorHandler = require("./middlewares/globalErrorHandler")
var app = express();
// =======================
//routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// =======================
// Connecting MongoDB
try{
	(async()=>{
	 await mongoose.connect(process.env.DB_URL);
		console.log("Database connected Successfully");
	})();
}catch(err)
{
	console.log(err);
}

app.use(fileUpload({
	createParentPath: true,
	useTempFiles: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(getJwtStrategy())
app.use(globalErrorHandler)


app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
