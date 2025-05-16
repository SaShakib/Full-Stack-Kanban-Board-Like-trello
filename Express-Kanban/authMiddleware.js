const jwt = require("jsonwebtoken");
const User = require("./models/User");

const secretKey = "secretkey";

const authMiddleware = async (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header("Authorization");

  // Check if the Authorization header is missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No Bearer token provided" });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Find the user by _id from the decoded token
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // Attach the user to the request object
    req.user = user;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = authMiddleware;
