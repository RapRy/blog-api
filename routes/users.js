const express = require('express');
const { signUpUser, signInUser } = require('../controllers/users.js');

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/signin', signInUser);

module.exports = router;