const express = require("express");
const app = express();
const { Port } = require('./configurations');
const { connect, closeClientConnect } = require('./prisma/client');



const server = app.listen(Port, () => {
  connect(); // Connect to the database when the server starts
});

// Handle disconnecting from the database when the server is closed
server.on('close', async () => {
  await closeClientConnect();
});

module.exports = app;
