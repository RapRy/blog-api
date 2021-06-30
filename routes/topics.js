const express = require('express');
const { publishTopic, getTopics } = require('../controllers/topics.js');

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.get('/:id', getTopics);
router.post('/publish', Auth, publishTopic);

module.exports = router;