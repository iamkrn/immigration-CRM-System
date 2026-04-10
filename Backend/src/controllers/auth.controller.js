const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerUser = async(req, res)=>{
  try {
    const {name, email, password, user_role} = req.body;
    const userExist = await User.findOne({email})
    console.log(userExist)
    if(userExist){
      return  res.status(400).json({message:'user alreday Exist'})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({
        name, 
        email,
        password : hashedPassword ,
        user_role

    });
    res.status(200).json({
        user,
        message:"Register Succesfully"
    })
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({error: error.message})

  }
}

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

    const token = await jwt.sign({id:user._id, role: user.user_role },
        process.env.SECRET_KEY, {expiresIn:'7d'})
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