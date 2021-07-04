const express = require('express');
const { addCategory, getCategories, getCategoriesCount, getCategory, updateActiveStatus } = require('../controllers/categories.js');

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.get('/', getCategories);
router.get('/categoriesCount', getCategoriesCount);
router.get('/:id', Auth, getCategory);
router.post('/add', Auth, addCategory);
router.put('/updateStatus/:id', Auth, updateActiveStatus)

module.exports = router;