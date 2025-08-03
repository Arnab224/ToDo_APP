const express = require("express");
const router = express.Router();
const { suggestTasks } = require("../controller/aiController");

router.post("/suggest-tasks", suggestTasks);

module.exports = router;