const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("BODY:", req.body);

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  SAFE ROLE HANDLE
    const finalRole = role ? role.toLowerCase() : "student";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole
    });

    res.status(200).json({
      user,
      message: "Register Successfully"
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.LoginUser = async(req,res) =>{
    try{
        const {email, password} = req.body

        const user = await User.findOne({email});
        
        //Check user through Email
        if(!user){return res.status(400).json({msg:'Invalid Email'})}

        //Compare Password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){return res.status(400).json({msg:"Invalid Password"})}

        //Token

    const token = await jwt.sign({id:user._id, role: user.role },
        process.env.SECRET_KEY, {expiresIn:'2d'})
        //token Done!

        res.status(200).json({
            message:"Login Successfull",
            user, 
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
        
    }
}