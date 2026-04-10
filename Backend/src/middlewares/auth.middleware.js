const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  // header se token lena
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader); 

  // check token
  if (!authHeader) {
    return res.status(401).json({ msg: "No Token, Access Denied" });
  }

  // "Bearer token" me se token nikaal
  const token = authHeader.split(' ')[1]; //

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("SECRET:", process.env.SECRET_KEY);

    // save user
    req.user = decoded;
    console.log(token)

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid Token" });
  }
};