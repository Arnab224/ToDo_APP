const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

port = 3000
URL = 'http://localhost:'

mongoose.connect("mongodb://localhost:27017/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const TaskSchema = new mongoose.Schema({
  text: String,
});
const Task = mongoose.model("Task", TaskSchema);

// Routes

app.get('/', (req,res)=>{
    res.send('Hello...')
})
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const task = new Task({ text });
  await task.save();
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
});

app.listen(port, () => 
    console.log(`Server started on: ${URL}${port}/`));