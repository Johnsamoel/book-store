const express = require("express");
const helmet = require("helmet");
const cookieParser= require('cookie-parser');
const {connect} = require('./prisma/client');
const {IsAuthenticated} = require('./middlewares/isAuthenticated')


// using the same app obj to keep single tone design pattern
const app = require("./connections");

// auth 
const auth = require('./Routes/auth');

// Books 
const books = require('./Routes/Books');

// user 
const users = require('./Routes/user')

// Not found
const NotFound = require('./Routes/NotFoud');

// helmet to add extra security headers.
app.use(helmet());
app.use(cookieParser());
// to parse incoming data
app.use(express.json());

// authentications routes
app.use('/auth', auth);

app.use(IsAuthenticated)

// book routes
app.use('/book' , books)

app.use('/user' , users);

// any other route
app.use(NotFound)

// for error handling
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.StatusCode || 404).json({ message: error.message });
});
