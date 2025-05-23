const Task = require("../model/taskModel");



const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};


const createTask = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const task = await Task.create({ text });
  res.status(201).json(task);
};


const deleteTask = async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: "Task deleted" });
};

const editTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};
const toggleCompleted = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,              // for editing text
        completed: req.body.completed     // for checkbox
      },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
}


module.exports = { getTasks, createTask, deleteTask, editTask, toggleCompleted };