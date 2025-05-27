require("dotenv").config();
const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pics"); // Folder to store profile pics
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  cb(null, isValid);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;