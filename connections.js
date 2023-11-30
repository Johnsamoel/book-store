const express = require("express");
const app = express();
const {Port} = require('./configurations')
 

app.listen(Port);

module.exports = app;
