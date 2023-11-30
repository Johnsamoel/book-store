const express = require('express');

const router = express.Router();

const { AddBook, GetBooks, DeleteBook , UpdateBook } = require('../controllers/Books');

const CheckBookValues = require('../utils/validations/Add-book-validation');



router.post('/add',  CheckBookValues() , AddBook);

router.get('/get/:pageId'  , GetBooks);

router.patch('/update/:bookId'  , UpdateBook);

router.delete('/delete/:bookId'  , DeleteBook);

module.exports = router;