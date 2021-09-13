const express = require("express");
const {
  publishTopic,
  getTopics,
  getTopic,
  addTopicViews,
  getTopicCounts,
  getLatestTopics,
  getHotTopics,
  getRelatedTopics,
  updateTopic,
  getHotTopicsByCategory,
  getLatestTopicsByCategory,
  updateActiveStatus,
  searchTopics,
  getTopicsWithLimit,
  voteTopic,
} = require("../controllers/topics.js");

const router = express.Router();

const Auth = require("../middleware/auth.js");

router.get("/count", getTopicCounts);
router.get("/latest/limit/:limit", getLatestTopics);
router.get("/hot/limit/:limit", getHotTopics);
router.get("/related/:id", getRelatedTopics);
router.get("/latest/:id", getLatestTopicsByCategory);
router.get("/hot/:id", getHotTopicsByCategory);
router.get("/fromForum/limit/:limit", getTopicsWithLimit);
router.get("/:id", getTopics);
router.get("/details/:id", getTopic);
router.get("/search/:keyword", searchTopics);

router.post("/publish", Auth, publishTopic);
router.post("/views", Auth, addTopicViews);
router.post("/vote", Auth, voteTopic);

router.put("/update", Auth, updateTopic);
router.put("/updateStatus/:id", Auth, updateActiveStatus);

module.exports = router;
