const express = require('express');
const { addReply } = require('../controllers/replies.js')

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.post('/add', Auth, addReply);

module.exports = router