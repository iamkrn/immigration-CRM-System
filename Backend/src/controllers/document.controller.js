const Document = require('../models/document.model');


//create the documents
exports.createDocument = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const docs = new Document({
      name: req.body.name,
      type: req.body.type,
      application: req.body.application,
      fileURL: req.file ? req.file.path : ""
    });

    await docs.save();

    res.json({
      success: true,
      data: docs
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