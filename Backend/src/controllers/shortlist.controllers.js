const Shortlist =  require('../models/shortlist.model');

// Get shortlist for a student 
exports.getShortlist = async (req,res) => {
 try {

    const {studentId} = req.params;
    const shortlist =  await Shortlist.findOne ({studentId})
    .populate('createdBy', 'name')
    .populate (unversities.addedBy, 'name')  ;
    
    if(!shortlist) {return res.json({ data: null, success: true})}

    res.json({success:true, data :shortlist})
 } catch (error) {
     console.log(error),
     res.status(500).json({message:error.message, success :false})
 }
};

// POST add  unversity in the shortlist
exports.addUniversity = async (req,res) => {
    try {
        const {studentId} = req.params;
        const {name,country, reason, course} = req.body;

        const shortlist = await Shortlist.findone({studentId});

        if(!shortlist) {
            //create new shortlist
            shortlist = await Shortlist.create ({
                studentId,
                createdBy :req.user._id,
                universities: []

            })
        }
        
        shortlist.universities.push({
            name, country, course, reason,
            addedBy:req.user._id
        });

        await shortlist.save();
        res.json({data: shortlist , success:true})
    } catch (error) {
        console.log(error),
        res.status(500).json({message:error.message, success :false})
    }
}

//PATCH update university status
exports.updateUniversityStatus = async (req, res) => {
  try {
    const { studentId, universityId } = req.params;
    const { status } = req.body;

    const shortlist = await Shortlist.findOne({ studentId });
    if (!shortlist) return res.status(404).json({ success: false, message: 'Shortlist not found' });

    const uni = shortlist.universities.id(universityId);
    if (!uni) return res.status(404).json({ success: false, message: 'University not found' });

    uni.status = status;
    await shortlist.save();
    res.json({ success: true, data: shortlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//Delete a university from shortlist
exports.deleteUniversity = async (req,res) => {
    try {

        const {studentId, universityId} = req.params;

        const shortlist = await Shortlist.findOne({studentId});
        if(!shortlist) return res.status(404).json({success:false, message:'Shortlist not found'});

        shortlist.universities.pull({_id:universityId});
        await shortlist.save();
        res.json({success:true, data:shortlist});
        
    } catch (error) {
      console.log(error),
      res.status(500).json({message:error.message, success: false})  
    } 

}

