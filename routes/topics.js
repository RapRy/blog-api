const express = require('express');
const { publishTopic } = require('../controllers/topics.js');

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.post('/publish', Auth, publishTopic);

module.exports = router;