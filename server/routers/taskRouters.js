const express = require("express")
const { getTasks, createTask, deleteTask, editTask, toggleCompleted} = require("../controler/taskController")

const router = express.Router()


router.get("/", getTasks)
router.post("/", createTask)
router.delete("/:id", deleteTask)
router.put("/:id", editTask)
router.put("/:id", toggleCompleted)

module.exports = router;