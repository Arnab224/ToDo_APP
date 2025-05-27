const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  editTask,
  toggleCompleted
} = require("../controler/taskController");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

// Protect all routes
router.use(authenticateUser);

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id", editTask);
router.patch("/:id", toggleCompleted); // changed to PATCH to avoid route conflict

module.exports = router;