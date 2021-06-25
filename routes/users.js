const express = require('express');
const { signUpUser, signInUser, getActiveUsersCount, getAllUsersCount } = require('../controllers/users.js');

const router = express.Router();

router.get('/activeCount', getActiveUsersCount);
router.get('/registeredCount', getAllUsersCount);

router.post('/signup', signUpUser);
router.post('/signin', signInUser);

module.exports = router;