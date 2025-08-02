require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
  updateProfilePic,
  getUserProfile,
  loginUser,
} = require("../controller/userController");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pics");
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/login", loginUser);
router.post("/upload-profile", protect, upload.single("profilePic"), updateProfilePic);
router.get("/profile", protect, getUserProfile);

module.exports = router;