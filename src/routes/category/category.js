const express = require('express');
const { verifyValidation } = require('../../middleware/validation');
const { categorySchema, createCategory, categoryList } = require('../../controllers/category/category');
const { upload } = require('../../middleware/uploadValidation');
const { adminTokenVarify } = require('../../middleware/auth');
const router = express.Router();

router.post('/create', upload.single("thumbnail"), adminTokenVarify, verifyValidation(categorySchema), createCategory)
router.get('/list', adminTokenVarify, categoryList)

module.exports = router;