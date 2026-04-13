const { json } = require('express');
const Student = require('../models/student.model');

//Create a student
exports.createStudent = async(req,res)=>{
try {
    const {name, email} = req.body

    if(!name  || !email){
        return res.status(400).json({
            message:'please required field',
            success:false
        })
    }

    const exist = await Student.findOne({email})
    if(exist){
        return res.status(400).json({
            message:'student already exist',
            success:false
        })
        }

        const student = new Student(req.body)
        await student.save()

        res.status(200).json({
            message:"sudent create succefully",
            data:student,
            success:true
                })
} catch (error) {
            console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

}    

}

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
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
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
