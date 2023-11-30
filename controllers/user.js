const { prisma } = require("../prisma/client");
const bycrypt = require("bcryptjs");

// importing enviroment varaiables
const { HASHING_SALTROUND } = require("../configurations");


const UpdateUser = async (req, res , next) => {
    try {
      let { userId } = req.params;
      
      if(userId) {
          userId = parseInt(userId)
      }else {
          return res.status(404).json({message: "invalid id"})
      }
  
      const { name, email, password } = req.body;
      
      let hashedPassword

      if(password) {
        hashedPassword =  await bycrypt.hash(password , HASHING_SALTROUND)
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
            name,
            email,
            password: hashedPassword
        },
      });
  
      if (updatedUser) {
        return res.status(200).json({ message: "User Updated Successfully" });
      }
    } catch (error) {
      error = new Error(error);
  
      error.StatusCode = 500;
      next(error);
    }
  };

const GetUsers = async (req, res, next) => {
    try {
      const { pageId } = req.params;
  
      // Validate pageId
      if (isNaN(pageId) || pageId <= 0) {
        return res.status(400).json({ message: "Invalid pageId" });
      }
  
      const itemsPerPage = 10;
  
      const offset = (pageId - 1) * itemsPerPage;
  
      // Build search criteria
      const where = {};
  
      for (const prop in req.body) {
        if (req.body[prop]) {
            // Use Prisma's query building to prevent SQL injection
            if (prop === 'name' || prop === 'email') {
                // For "name" or "email", use contains instead of equals
                where[prop] = { contains: req.body[prop] };
            } else {
                where[prop] = { equals: req.body[prop] };
            }
        }
    }
  
      // Fetch 10 books based on the pageId
      const books = await prisma.user.findMany({
        take: itemsPerPage,
        skip: offset,
        where
      });
  
      res
        .status(200)
        .json({ books, currentPage: parseInt(pageId), itemsPerPage });
    } catch (error) {
      // Handle errors
      console.error(error);
      error = new Error(error);
      error.StatusCode = 500;
      next(error);
    }
  };

const DeleteUser = async (req, res) => {
  try {
    let { userId } = req.params;
      
    if(userId) {
        userId = parseInt(userId)
    }else {
        return res.status(404).json({message: "invalid id"})
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!user) {
        return res.status(404).json({message: "invalid id"})
    }

    const deletedUser = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    if(deletedUser) {
        return res.status(200).json({message: "user deleted successfully"})
    }

  } catch (error) {
    error = new Error(error);

    error.StatusCode = 500;
    next(error);
  }
};

module.exports = {
  UpdateUser,
  GetUsers,
  DeleteUser
};