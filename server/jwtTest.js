const jwt = require("jsonwebtoken");

const secret = "your_secret_key_here";

// Sign a token
const token = jwt.sign({ id: "test_user_123" }, secret, { expiresIn: "1d" });
console.log("SIGNED TOKEN:", token);

// Verify that token immediately
try {
  const decoded = jwt.verify(token, secret);
  console.log("VERIFIED DECODED PAYLOAD:", decoded);
} catch (err) {
  console.error("ERROR VERIFYING:", err.message);
}