const express = require('express');

const router = express.Router();

const { AddBook, GetBooks, DeleteBook , UpdateBook , checkoutBook , ReturnBook , GetUserBooks } = require('../controllers/Books');

const CheckBookValues = require('../utils/validations/Add-book-validation');

const CheckoutBookValues = require('../utils/validations/checkout-book-validation');



router.post('/add',  CheckBookValues() , AddBook);

router.get('/get/:pageId'  , GetBooks);

router.patch('/update/:bookId'  , UpdateBook);

router.post('/checkout/:BookId' , CheckoutBookValues() , checkoutBook )

router.post('/return/:BookId/:userId' , ReturnBook)

router.get('/mybooks/:pageId' , GetUserBooks)

router.delete('/delete/:bookId'  , DeleteBook);

module.exports = router;