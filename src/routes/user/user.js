const express = require('express');
const { createUser, userSchema, loginUser, loginSchema } = require('../../controllers/user/user');
const { verifyValidation } = require('../../middleware/validation');
const router = express.Router();

router.post('/signup', verifyValidation(userSchema), createUser)
router.post('/signin', verifyValidation(loginSchema), loginUser)

module.exports = router;