const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/client");

// importing enviroment varaiables
const { HASHING_SALTROUND, JWT_SECRET } = require("../configurations");

// validator results
const { validationResult } = require("express-validator");

const RegisterUser = async (req, res, next) => {
  const validationValues = validationResult(req);

  try {
    if (!validationValues.isEmpty()) {
      return res.status(422).json({ message: validationValues.array()[0].msg });
    }

    const { password, name, email } = req.body;

    // hashing password and create user instance
    const hashedPassword = await bycrypt.hash(
      password,
      parseInt(HASHING_SALTROUND)
    );

    const userData = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    if (userData) {
      res.status(201).json({ message: "User was added successfully" });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res, next) => {
  const validationValues = validationResult(req);

  try {
    if (!validationValues.isEmpty()) {
      return res.status(422).json({ message: validationValues.array()[0].msg });
    }

    const { password, email } = req.body;

    // check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bycrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      return res
        .cookie("jwt", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ message: "logged in" });
    } else {
      return res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// log user out
const logout = (req, res) => {
  try {
    return res
      .clearCookie("jwt")
      .status(200)
      .json({ message: "logged out Successfully" });
  } catch (error) {
    error = new Error(error);

    error.StatusCode = 500;
    next(error);
  }
};

module.exports = {
  RegisterUser,
  login,
  logout,
};
