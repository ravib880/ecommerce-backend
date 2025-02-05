const express = require('express');
const { verifyValidation } = require('../../middleware/validation');
const { categorySchema, createCategory } = require('../../controllers/category/category');
const { upload } = require('../../middleware/uploadValidation');
const router = express.Router();

router.post('/create', upload.single("thumbnail"), verifyValidation(categorySchema), createCategory)

module.exports = router;