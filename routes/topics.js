const express = require('express');
const { publishTopic, getTopics, getTopic, addTopicViews, getTopicCounts, getLatestTopics, getHotTopics, getRelatedTopics, updateTopic, getHotTopicsByCategory, getLatestTopicsByCategory } = require('../controllers/topics.js');

const router = express.Router();

const Auth = require('../middleware/auth.js');

router.get('/count', getTopicCounts);
router.get('/latest', getLatestTopics);
router.get('/hot', getHotTopics);
router.get('/related/:id', getRelatedTopics)
router.get('/latest/:id', getLatestTopicsByCategory)
router.get('/hot/:id', getHotTopicsByCategory)
router.get('/:id', getTopics);
router.get('/details/:id', getTopic);

router.post('/publish', Auth, publishTopic);
router.post('/views', Auth, addTopicViews);

router.put('/update', Auth, updateTopic);

module.exports = router;