const express = require('express');
const { publishTopic, getTopics, getTopic } = require('../controllers/topics.js');

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.get('/:id', getTopics);
router.get('/details/:id', getTopic);
router.post('/publish', Auth, publishTopic);

module.exports = router;