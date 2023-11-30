const { body } = require('express-validator');

const CheckBookValues = () => {
  return [
    // checking title value
    body('title', 'Invalid title').trim().isString().notEmpty().withMessage("Invalid title"),

    // checking author value
    body('author', 'Invalid author').trim().isString().notEmpty().withMessage("Invalid author"),

    // checking quantity value
    body('quantity', 'Invalid quantity').trim().notEmpty().isInt({ min: 1 }).withMessage('Invalid quantity'),

    // checking shelf_location value
    body('shelf_location', 'Invalid shelf location').trim().isString().notEmpty().withMessage('Invalid shelf location'),

    // check ISBN
    body('ISBN', 'invalid ISBN').isISBN().notEmpty()
  ];
};

module.exports = CheckBookValues;

