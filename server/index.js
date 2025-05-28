require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/taskRouters");
const authRoutes = require("./routers/authRouters");
const userRoutes = require("./routers/userRoutes");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ["https://to-do-app-rosy-nu.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", (req, res) => res.send("Hello"));
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
