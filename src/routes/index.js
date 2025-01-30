const express = require('express');
const router = express.Router();
const userList = require('./user/user');

router.use('/user', userList);

router.use('/*', (req, res) => {
    res.status(401).json({ message: "Invalid routes or method." })
});

module.exports = {
    router
}