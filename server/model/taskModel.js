const mongoose = require("mongoose");

// models/taskModel.js
const TaskSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true } 
)




module.exports = mongoose.model("Task", TaskSchema);