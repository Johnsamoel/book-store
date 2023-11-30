// importing validator library
const { body } = require("express-validator");

// import prisma
const { prisma } = require("../../prisma/client");

const CheckRegisterFormValues = () => {
  return [
    // checking name value
    body("name", "Invalid Name value")
      .trim()
      .isAlpha()
      .isLength({ min: 4, max: 12 })
      .notEmpty()
      .withMessage("Name is Required"),

    // checking email value
    body("email", "The Email is Invalid")
      .isEmail()
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .custom(async (value, { req }) => {
        const userData = await prisma.user.findUnique({
          where: {
            email: value,
          },
        });
        if (userData) {
          throw new Error("Chose a different Email");
        }

        return;
      }),

    // checking password value
    body("password", "Password should be at least 4 characters long")
      .isLength({ min: 4, max: 8 })
      .trim()
      .notEmpty()
      .withMessage("Password is Required"),
  ];
};

module.exports = CheckRegisterFormValues;
