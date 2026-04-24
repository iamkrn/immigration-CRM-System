const Application = require('../models/application.model')

//create Application
 exports.createApplication = async (req, res) => {
  try {
    console.log("BODY:", req.body); 

    const app = new Application(req.body);
    await app.save();

    res.json({
      success: true,
      data: app
    });

  } catch (error) {
    console.log("ERROR:", error.message); 
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

    //get All Students

    exports.getApplications = async (req,res) => {
       try {
        const apps  = await Application.find().populate('student')
 
        res.json({
         success:true,
         data:apps
        })
     
       } catch (error) {
        console.log(error);
           res.status(500).json({
            success:false,
            message:error.message
         });
}}


    //get one Student

    exports.getApplicationById = async (req,res) => {
        try {
            const apps =  await Application.findById(req.params.id);

            res.json({
             success:true,
             data:apps
            })
            if (!apps) {
    return res.status(404).json({
    success: false,
    message: "Application not found"
  });
}
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
            success:false,
            message:error.message
         })
    }}

    //update Student by id

    exports.updateApplication = async(req,res) => {
   try {
    const apps = await Application.findByIdAndUpdate(
        req.params.id,
        req.body,
{ returnDocument: 'after' }   
 );
    if (!apps) {
  return res.status(404).json({
    success: false,
    message: "Application not found"
  });
}

    res.json({
        success:true,
        data:apps
    })
    
   } catch (error) {
    console.log(error);
        res.status(500).json({
         success:false,
         message:error.message
         })
    
   }}

    //delete Student by id

    exports.deleteApplication = async (req,res) => {
        try {
            const apps = await Application.findByIdAndDelete(req.params.id);

            res.json({
                success:true,
                message:"Application deleted"
            })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
            success:false,
            message:error.message
         })
    
            
        }

    }