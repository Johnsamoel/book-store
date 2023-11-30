const jwt = require("jsonwebtoken");
const {prisma} = require('../prisma/client') 
const { JWT_SECRET } = require("../configurations");
// check if the user authenticated or not.

const IsAuthenticated = async (req, res, next) => {
    try {
      if (!req.cookies.jwt) {
        throw new Error("Not authorized");
      }
  
      const result = jwt.verify(req.cookies.jwt, JWT_SECRET);
     
      const user = await prisma.user.findUnique({ where: { id: result.id } });
  
      if (user) {
        req.userId = user.id;
        req.user = user;
        next();
      } else {
        res.status(403).json({ message: "You are not authorized to access this endpoint" });
      }
    } catch (error) {
      error.StatusCode = 401;
      next(error);
    }
  };
  

module.exports = {
  IsAuthenticated,
};
