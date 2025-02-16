const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("Authentication token is missing!");
  }

  try {
    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; 
  } catch (err) {
    throw new Error("Invalid or expired token!");
  }
};
