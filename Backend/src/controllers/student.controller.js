const { json } = require('express');
const Student = require('../models/student.model');

const calculateProfileCompletion = (student) => {
  let score = 0;

  if (student.firstName && student.email) score += 20;
  if (student.qualification) score += 20;
  if (student.preferredCountry) score += 20;
  if (student.ieltsScore || student.toeflScore || student.pteScore) score += 20;
  if (student.address && student.city) score += 20;

  return score;
};

//Create a student
exports.createStudent = async (req, res) => {
  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({
        message: "Required fields missing",
        success: false
      });
    }

    const exist = await Student.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Student already exists",
        success: false
      });
    }

    const studentData = req.body;

    // profile completion
    studentData.profileCompletion = calculateProfileCompletion(studentData);

    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      success: true,
      data: student
    });

  } catch (error) {
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
exports.updateStudent = async (req, res) => {
  try {
    const updatedData = req.body;

    //  recalculate profile completion
    updatedData.profileCompletion = calculateProfileCompletion(updatedData);

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
