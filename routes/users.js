const express = require('express');
const { signUpUser, signInUser, getActiveUsersCount, getAllUsersCount, getUser, getNewUsers, getActiveUsers, getRegisteredUsers } = require('../controllers/users.js');

const router = express.Router();
const Auth = require('../middleware/auth.js')

router.get('/activeCount', getActiveUsersCount);
router.get('/registeredCount', getAllUsersCount);
router.get('/newUsers/:limit', Auth, getNewUsers);
router.get('/activeUsers/:limit', Auth, getActiveUsers);
router.get('/registeredUsers', Auth, getRegisteredUsers);

router.post('/signup', signUpUser);
router.post('/signin', signInUser);

router.get('/:id', getUser);

module.exports = router;