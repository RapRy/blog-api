const express = require('express');
const { signUpUser, signInUser, getActiveUsersCount, getAllUsersCount, getUser, getNewUsers, getActiveUsers, getRegisteredUsers, blockUser, getBlacklistedUsers, activateUser, unblockUser, deactivateUser, getTopicsByUser, updateUserDetails } = require('../controllers/users.js');

const router = express.Router();
const Auth = require('../middleware/auth.js')

router.get('/activeCount', getActiveUsersCount);
router.get('/registeredCount', getAllUsersCount);
router.get('/newUsers/:limit', Auth, getNewUsers);
router.get('/activeUsers/:limit', Auth, getActiveUsers);
router.get('/registeredUsers', Auth, getRegisteredUsers);
router.get('/blacklistedUsers', Auth, getBlacklistedUsers);

router.post('/signup', signUpUser);
router.post('/signin', signInUser);
router.put('/blockuser/:id', Auth, blockUser)
router.put('/unblockuser/:id', Auth, unblockUser)
router.put('/activate/:id', Auth, activateUser)
router.put('/deactivate/:id', Auth, deactivateUser)

router.get('/:id', getUser);
router.get('/:id/topics', getTopicsByUser)

router.put('/updateDetails', Auth, updateUserDetails)

module.exports = router;