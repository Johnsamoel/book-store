const express = require("express");
const helmet = require("helmet");

// using the same app obj to keep single tone design pattern
const app = require("./connections");

// helmet to add extra security headers.
app.use(helmet());

// to parse incoming data
app.use(express.json());

// for error handling
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.StatusCode || 404).json({ message: error.message });
});
