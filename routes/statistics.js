const express = require("express");
const { getAllStats } = require("../controllers/statistics.js");

const router = express.Router();

router.get("/all-stats-count", getAllStats);

module.exports = router;
