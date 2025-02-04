const express = require('express');
const { createUser, userSchema, signOutSchema, signOutUser, signInSchema, signInUser } = require('../../controllers/user/user');
const { verifyValidation } = require('../../middleware/validation');
const router = express.Router();

router.post('/signup', verifyValidation(userSchema), createUser)
router.post('/signin', verifyValidation(signInSchema), signInUser)
router.post('/signout', verifyValidation(signOutSchema), signOutUser)

module.exports = router;