const express = require('express');

const router  = express.Router();

const {createApplication, 
       deleteApplication,
       getApplications,
       getApplicationById,
       updateApplication} = require('../controllers/application.controllers');

const {authMiddleware} = require('../middlewares/auth.middleware')       

router.post('/',authMiddleware,createApplication);
router.get('/',authMiddleware,getApplications);
router.get('/:id',authMiddleware,getApplicationById);
router.put('/:id',authMiddleware,updateApplication);
router.delete('/:id',authMiddleware,deleteApplication);    

module.exports = router

