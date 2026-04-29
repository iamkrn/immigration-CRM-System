const { json } = require('express');
const Student = require('../models/student.model');

// Profile Completion Calculator
const calculateProfileCompletion = (student) => {
  let score = 0;

  // Basic Info → 20%
  if (student.firstName) score += 5;
  if (student.lastName) score += 5;
  if (student.phone) score += 5;
  if (student.dob) score += 5;

  // Academic Info → 25%
  if (student.education) score += 10;
  if (student.qualification) score += 10;
  if (student.passingYear) score += 5;

  // University Preferences → 15%
  if (student.preferredCountry) score += 8;
  if (student.intakeYear) score += 7;

  // Documents → 20%
  if (student.passport) score += 7;
  if (student.sop) score += 7;
  if (student.lor) score += 6;

  // Financial Info → 10%
  if (student.fatherName) score += 5;
  if (student.motherName) score += 5;

  // Visa Info → 10%
  if (student.visaType) score += 5;
  if (student.ieltsScore) score += 5;

  return score;
};


//Create a student
exports.createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      age,
      fatherName,
      motherName,
      address,
      city,
      pincode,
      country,
      state,
      preferredCountry,
      qualification,
      leadStatus,
      isActive
    } = req.body;

    //  Required validation
    if (!firstName || !email) {
      return res.status(400).json({
        message: "Please fill required fields",
        success: false
      });
    }

    //  Check duplicate
    const exist = await Student.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Student already exists",
        success: false
      });
    }
    
    const completion = calculateProfileCompletion(req.body);

    //create Student
    const student = new Student({
      ...req.body,
      user: req.user._id ,
      profileCompletion:completion  
    });



    await student.save();

    res.status(200).json({
      message: "Student created successfully",
      data: student,
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//Get all Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({   
      success: true,
      data: students
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false
    });
  }
};
//Get single Student
exports.getStudentById = async(req,res)=>{
    try {
        const student = await Student.findById(req.params.id);
    
        res.status(200).json({
            data:student,
            success:true
        })
    
    } catch (error) {
        console.log(error),
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }}


//Update Student
exports.updateStudent = async(req,res) => {
    try {
        const completion = calculateProfileCompletion(req.body);
        req.body.profileCompletion = completion;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
         { returnDocument: 'after' }        
         )

        res.json({
            success:true,
            data : student,
        })
    } catch (error) {
        console.log(error),
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

//Delete Student
exports.deleteStudent = async(req,res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id)

        res.json({
            success:true,
            message:"Student Deleted"
        })
    } catch (error) {
        console.log(error),
        res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

