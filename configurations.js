require("dotenv").config();

const requiredEnvs = ["DATABASE_NAME", "HASHING_SALT_ROUND", "JWT_SECRET" , "RUNNING_PORT"];

// check that if any of the variables is undefined..
requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    process.exit();
  }
});

module.exports = {
  DB_NAME: process.env.DATABASE_NAME,
  HASHING_SALTROUND: process.env.HASHING_SALT_ROUND,
  JWT_SECRET: process.env.JWT_SECRET,
  Port:process.env.RUNNING_PORT
};
