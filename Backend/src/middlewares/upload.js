const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf','image/jpg','image/jpeg','image/png'];
  if(allowed.includes(file.mimeetype)){
    cb(null,true);
  }
  else{
    cb(new Error('invalid file type'),false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits:{fileSize: 5 * 1024 * 1024} //5Mb
});

module.exports = upload