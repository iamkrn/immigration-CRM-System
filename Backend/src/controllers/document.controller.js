const Document = require('../models/document.model');


//create the documents

exports.createDocument = async (req, res) => {
  try {

    // Files check 
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "No files uploaded" 
      });
    }

    const { type, application } = req.body;

    //  create document entries for each file
    const savedDocs = await Promise.all(
      req.files.map(file =>
        Document.create({
          name: file.originalname,
          type,
          application,
          fileURL: file.path
        })
      )
    );

    res.status(201).json({
      success: true,
      count: savedDocs.length,
      data: savedDocs
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
//get all documents
exports.getDocument = async(req,res) => {
    try {
        const docs = await Document.find({application:req.params.applicationId})
        res.json({
         success:true,
         data:docs
        })
     
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

//delete Document
exports.deleteDocument = async(req,res) => {
    try {
      const docs =  await Document.findByIdAndDelete(req.params.id);
        res.json({
         data:docs,
         success:true,
         message:"Document Deleted"
        })
     
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

exports.updateDocumentStatus = async(req,res) => {
  try {
    const {status} =  req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      {status},
    { returnDocument: 'after' }   
  );
  res.json({
    success:true,
    data:doc
  })
  
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:error.message,
      success:false
    })
  }}