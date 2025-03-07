const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "jwtsecret";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "access denied" });
  }
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
