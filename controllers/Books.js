const { prisma } = require("../prisma/client");

// validator results
const { validationResult } = require("express-validator");

// status
const status_values = require('../utils/status-values')

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

const checkoutBook = async (req, res, next) => {
  const validationValues = validationResult(req);
  try {
  
      if (!validationValues.isEmpty()) {
          return res.status(422).json({ message: validationValues.array()[0].msg });
    }

    let {BookId} = req.params

    if(BookId) {
        BookId = parseInt(BookId)
    }else {
        return res.status(404).json({message: "invalid id"})
    }

    const { return_date } = req.body

    const converted_Date = new Date(return_date).toISOString()

    const newTransaction = await prisma.transactions.create({
      data: {
        book_id: BookId,
        user_id: req.userId,
        return_date: converted_Date,
        Status: status_values.checked

      }
    })

    if (!newTransaction) {
     return res.status(400).json({message: "something went wrong"})
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: BookId
      },
      data: {
        quantity: {
          decrement: 1
        }
      }
    });
    
    if(!updatedBook) {
      return res.status(400).json({message: "something went wrong"})
    }

    return res.status(201).json({message: "book checked out successfully"})

  } catch (error) {
    // Handle errors
    console.error(error);
    error = new Error(error);
    error.StatusCode = 500;
    next(error);
  }
}

const ReturnBook = async (req, res, next) => {
  try {
    let {BookId , userId} = req.params

    if(BookId , userId) {
        BookId = parseInt(BookId)
        userId = parseInt(userId)
    }else {
        return res.status(404).json({message: "invalid id"})
    }



    // I don't accept the date from the user for integrity
    const Actual_Return_Date = new Date()

    const existingtransaction = await prisma.transactions.findMany({
      where: {
          user_id: userId,
          book_id: BookId,
          Status: {
            not: status_values.returned
          }
        },

    })

    if(!existingtransaction)   return res.status(404).json({message: "invalid id"})


    const newTransaction = await prisma.transactions.update({
      where: {
          id: existingtransaction[0].id,
          user_id: userId,
          book_id: BookId
        
      },
      data: {
        Status: status_values.returned,
        Actual_return_date: Actual_Return_Date.toISOString() ,
        overdue: existingtransaction[0].return_date.setHours(0,0,0,0) < Actual_Return_Date.setHours(0,0,0,0)
      }
    })

    if (!newTransaction) {
     return res.status(400).json({message: "something went wrong"})
    }

    const updatedBook = await prisma.book.update({
      where: {
        id: BookId
      },
      data: {
        quantity: {
          increment: 1
        }
      }
    });
    
    if(!updatedBook) {
      return res.status(400).json({message: "something went wrong"})
    }

    return res.status(201).json({message: "book was Returned successfully"})

  } catch (error) {
    // Handle errors
    console.error(error);
    error = new Error(error);
    error.StatusCode = 500;
    next(error);
  }
}

const GetUserBooks = async (req, res, next) => {
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
        where[prop] = { equals: req.body[prop] };
      }
    }

    // Add user_id to the where object
    where.user_id = where.userId ? userId : req.userId;

    // Add a condition for checked-out books
    where.Status = { equals: status_values.checked };

    // Fetch 10 books based on the pageId
    const books = await prisma.transactions.findMany({
      take: itemsPerPage,
      skip: offset,
      where,
      include: {
        book: true,
      },
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




module.exports = {
  AddBook,
  GetBooks,
  UpdateBook,
  DeleteBook,
  checkoutBook,
  ReturnBook,
  GetUserBooks
};
