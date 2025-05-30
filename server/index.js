require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/taskRouters");
const authRoutes = require("./routers/authRouters");
const userRoutes = require("./routers/userRoutes");
const path = require("path");

const app = express();
connectDB();

// Fix: Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'https://to-do-app-zlqe.vercel.app'];

// Fix: Use cors with proper config
const corsOptions = {
  origin: ['http://localhost:3000', 'https://to-do-app-zlqe.vercel.app'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// 🔥 This handles preflight OPTIONS requests properly
app.options('*', cors(corsOptions));

// Fix: Preflight requests handler

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
