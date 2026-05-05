const jwt = require('jsonwebtoken');
const  User = require('../models/user.model')

exports.authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    //  No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No Token, Access Denied" });
    }

    //  Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token Missing" });
    }

    
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //  Attach user
    const user =  await User.findById(decoded.id).select("-password");

    if(!user){
      return res.status(404).json({message: "User not found"})
    }
    req.user = user

    next();

  } catch (error) {
    console.log("AUTH ERROR:", error.message);

    return res.status(401).json({ msg: "Invalid Token" });
  }
};