const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Student = require('../models/student.model')
const { sendWelcomeEmail } = require('../services/email.service');


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalRole = "student";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole
    });

    //AUTO CREATE STUDENT (ONLY FOR STUDENT ROLE)
    if (finalRole === "student") {
      await Student.create({
        firstName: name,
        email: email,
        user:user._id
      });
    }
    sendWelcomeEmail({ toEmail: email, studentName: name }).catch(console.error);


    res.status(200).json({
      user,
      message: "Register Successfully"
    });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW CONTROLLER — adminCreateUser
exports.adminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Allowed roles for admin creation
    const allowedRoles = ["counsellor", "admin", "superAdmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Allowed: counsellor, admin, superAdmin" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role, 
    });

    res.status(201).json({ user, message: `${role} created successfully` });

  } catch (error) {
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
        process.env.SECRET_KEY, {expiresIn:'1d'})
        
        const studentData = await Student.findOne({ user: user._id });
        console.log("studentData:", studentData)



        res.status(200).json({
            message:"Login Successfull",
            user:{
              ...user.toObject(),
              studentId:studentData?._id
            }, 
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message})
        
    }
}