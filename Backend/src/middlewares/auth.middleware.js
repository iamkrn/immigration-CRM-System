const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No Token, Access Denied" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token Missing" });
    }

    console.log("TOKEN:", token);
    console.log("SECRET:", process.env.SECRET_KEY);

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // ✅ Attach user
    req.user = decoded;

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({ msg: "Invalid Token" });
  }
};