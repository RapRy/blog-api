const express = require('express');
const { addReply, repliesCount } = require('../controllers/replies.js')

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.post('/add', Auth, addReply);
router.get('/count', repliesCount);

module.exports = router