const express = require('express');
const router = express.Router();
const userList = require('./user/user');
const categoryList = require('./category/category');


router.use('/user', userList);
router.use('/category', categoryList);


router.use('/*', (req, res) => {
    res.status(401).json({ message: "Invalid routes or method." })
});

module.exports = {
    router
}