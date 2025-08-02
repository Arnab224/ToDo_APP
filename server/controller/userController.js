require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

// ✅ Update profile picture
const updateProfilePic = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: `/uploads/profile_pics/${req.file.filename}` },
      { new: true }
    );

    res.json({
      message: "Profile picture updated",
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

// ✅ Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("username email name profilePic");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// ✅ Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("=== DEBUG: Login Controller ===");
    console.log("JWT Secret (signing):", process.env.JWT_SECRET);
    console.log("Generated Token:", token);

    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// ✅ Update name/username/email
const updateUserProfile = async (req, res) => {
  const { name, username, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  updateProfilePic,
  getUserProfile,
  loginUser,
  updateUserProfile, // ✅ Exported here
};