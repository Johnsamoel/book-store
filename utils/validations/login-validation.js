// importing validator library
const {body} = require('express-validator');


const CheckLoginFormValues = () => {

    return [

        // checking email value
        body("email", "The Email is Invalid")
        .isEmail()
        .trim()
        .notEmpty()
        .withMessage("Email is Required"),
        
        // checking password value
        body("password", "Password should be at least 4 characters long")
        .isLength({ min: 4, max: 8 })
        .trim()
        .notEmpty()
        .withMessage("Password is Required"),  

    ]
};


module.exports = CheckLoginFormValues