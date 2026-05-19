const Shortlist =  require('../models/shortlist.model');
const Student = require('../models/student.model');           
const { sendNotification } = require('../services/notification.service'); 


// Get shortlist for a student 
exports.getShortlist = async (req,res) => {
 try {

    const {studentId} = req.params;
    const shortlist =  await Shortlist.findOne ({studentId})
    .populate('createdBy', 'name')
    .populate ('universities.addedBy', 'name')  ;
    
    if(!shortlist) {return res.json({ data: null, success: true})}

    res.json({success:true, data :shortlist})
 } catch (error) {
     console.log(error);
     res.status(500).json({message:error.message, success :false})
 }
};

// POST add  unversity in the shortlist
exports.addUniversity = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, country, reason, course } = req.body;

    let shortlist = await Shortlist.findOne({ studentId });

    if (!shortlist) {
      shortlist = await Shortlist.create({
        studentId,
        createdBy: req.user._id,
        universities: []
      });
    }

    shortlist.universities.push({ name, country, course, reason, addedBy: req.user._id });
    await shortlist.save();

    // ── FCM: Notify student that a university was added ──
    const student = await Student.findById(studentId, 'user');
    const recipientId = student?.user;

    if (recipientId) {
      await sendNotification({
        recipientId,
        senderId: req.user._id,
        type: 'shortlist_update',
        title: 'University Added to Shortlist 📌',
        body: `${name}, ${country} has been added to your shortlist.`,
        data: { studentId },
      });
    }
    

    res.json({ data: shortlist, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};


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

    // ── FCM: Notify student that university status changed ──
    const student = await Student.findById(studentId, 'user');
    const recipientId = student?.user;

    if (recipientId) {
      await sendNotification({
        recipientId,
        senderId: req.user._id,
        type: 'shortlist_update',
        title: 'Shortlist Update 📌',
        body: `${uni.name} status changed to: ${status}`,
        data: { studentId, universityId },
      });
    }

    res.json({ success: true, data: shortlist });

  } catch (error) {
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
      console.log(error);
      res.status(500).json({message:error.message, success: false})  
    } 

}

