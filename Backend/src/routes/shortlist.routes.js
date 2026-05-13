const express = require ("express");
const router = express.Router();

const  {getShortlist, addUniversity, updateUniversityStatus, deleteUniversity} = require("../controllers/shortlist.controllers");
const {authMiddleware} = require('../middlewares/auth.middleware');

router.get('/:studentId', authMiddleware, getShortlist);
router.post('/:studentId', authMiddleware, addUniversity );
router.patch('/:studentId/:universityId',authMiddleware, updateUniversityStatus);
router.delete('/:studentId/:universityId', authMiddleware, deleteUniversity);

module.exports = router;