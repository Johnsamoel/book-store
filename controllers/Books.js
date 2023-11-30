const { prisma } = require("../prisma/client");

// validator results
const { validationResult } = require("express-validator");

const AddBook = async (req, res, next) => {
    const validationValues = validationResult(req);
  try {

    if (!validationValues.isEmpty()) {
        return res.status(422).json({ message: validationValues.array()[0].msg });
    }

    const { title, author, quantity, shelf_location , ISBN } = req.body;

    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        quantity: parseInt(quantity),
        shelf_loc: shelf_location,
        ISBN 
      },
    });

    if (newBook) {
      return res.status(201).json({ message: "Book Created Successfully" });
    }
  } catch (error) {
    error = new Error(error);

    error.StatusCode = 500;
    next(error);
  }
};

const GetBooks = async (req, res, next) => {
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
            if (prop === 'name' || prop === 'author' || prop === 'ISBN' || prop === 'shelf_loc' ) {
                // For "name" or "email", use contains instead of equals
                where[prop] = { contains: req.body[prop] };
            } else {
                where[prop] = { equals: req.body[prop] };
            }
        }
    }

    // Fetch 10 books based on the pageId
    const books = await prisma.book.findMany({
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

const UpdateBook = async (req, res , next) => {
  try {
    let { bookId } = req.params;
    
    if(bookId) {
        bookId = parseInt(bookId)
    }else {
        return res.status(404).json({message: "invalid id"})
    }

    const { title, author, quantity, shelf_location , ISBN } = req.body;

    const UpdatedBook = await prisma.book.update({
      where: {
        id: bookId,
      },
      data: {
        title,
        author,
        quantity,
        shelf_loc: shelf_location,
        ISBN
      },
    });

    if (UpdatedBook) {
      return res.status(200).json({ message: "Book Updated Successfully" });
    }
  } catch (error) {
    error = new Error(error);

    error.StatusCode = 500;
    next(error);
  }
};

const DeleteBook = async (req, res , next) => {
  try {
      let { bookId } = req.params;

    if(bookId) {
        bookId = parseInt(bookId)
    }else {
        return res.status(404).json({message: "invalid id"})
    }
    
    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        }
    })


    if(!book)  return res.status(404).json({message: "book not found"})


    const deletedBook = await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    if (deletedBook) {
      return res.status(200).json({ message: "Book deleted Successfully" });
    }
  } catch (error) {
    error = new Error(error);

    error.StatusCode = 500;
    next(error);
  }
};

module.exports = {
  AddBook,
  GetBooks,
  UpdateBook,
  DeleteBook,
};
