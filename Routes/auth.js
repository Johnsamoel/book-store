const express = require("express");

const router = express.Router();

const {
  RegisterUser,
  login,
  logout,
} = require("../controllers/authentication");

// importing validation functions
const CheckRegisterFormValues = require("../utils/validations/Registeration-validation");

const CheckLoginFormValues = require("../utils/validations/login-validation");

router.post("/register", CheckRegisterFormValues(), RegisterUser);

router.get("/login", CheckLoginFormValues(), login);

router.post("/logout", logout);

module.exports = router;
