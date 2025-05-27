require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("=== DEBUG: Auth Middleware ===");
      console.log("JWT Secret (signing):", process.env.JWT_SECRET);
      console.log("Generated Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next(); 
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }
};

module.exports = { protect };