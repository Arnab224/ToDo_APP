

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


app.use(cors({
origin: ['http://localhost:3000', 'https://to-do-app-zlqe.vercel.app'], // Specify allowed origins
methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Specify allowed methods
credentials: true, // Allow cookies to be sent
optionsSuccessStatus: 200, // Handle preflight requests
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});


app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);



// Use port from .env or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
