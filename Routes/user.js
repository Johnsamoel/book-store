const express = require('express');

const router = express.Router();

const { DeleteUser , GetUsers , UpdateUser } = require('../controllers/user');



router.get('/get/:pageId'  , GetUsers);

router.patch('/update/:userId'  , UpdateUser);

router.delete('/delete/:userId'  , DeleteUser);

module.exports = router;