require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routers/taskRouters");
const authRoutes = require("./routers/authRouters");
const userRoutes = require("./routers/userRoutes");
const aiRoutes = require("./routers/aiRoutes");


const path = require("path");

const app = express();

connectDB();

app.use(cors())

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});


app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
