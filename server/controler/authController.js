const jwt = require("jsonwebtoken");
const User = require("../model/User");
const bcrypt = require("bcrypt");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://to-do-app-zlqe.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.status(200).end();

const register = async (req, res) => {
  const { name, username, email, password } = req.body;
  console.log("📥 Incoming registration:", req.body); 

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("⚠️ Username exists");
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username,email, password: hashedPassword });

    await newUser.save();
    console.log("✅ User registered");
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Send full user data including profilePic
    res.json({
      token,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || "",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };
