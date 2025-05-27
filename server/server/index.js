

require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/taskRouters");
const authRoutes = require("./routers/authRouters");
const path = require("path");//pic path



const app = express();

connectDB();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});


app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));// pic

// Use port from .env or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});