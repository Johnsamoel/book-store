const { body } = require('express-validator');


const isDateInPast = (value) => {

    const providedDate = new Date(value);
    providedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    return today < providedDate ;
};

const CheckoutBookValues = () => {
    return [
        // checking return date value
        body('return_date', 'Invalid return date').notEmpty().isString().custom(isDateInPast),
    ];
};

module.exports = CheckoutBookValues;
