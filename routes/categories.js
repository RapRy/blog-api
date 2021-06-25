const express = require('express');
const { addCategory, getCategories, getCategoriesCount } = require('../controllers/categories.js');

const router = express.Router();

router.get('/', getCategories);
router.get('/categoriesCount', getCategoriesCount);
router.post('/add', addCategory);

module.exports = router;