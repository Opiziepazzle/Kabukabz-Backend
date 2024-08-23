const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const userInfoSchema = require("../models/userInfo.model"); 
const jwt = require('jsonwebtoken')
const multer = require('multer');
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();

const {  userInfoValidationRules, validate } = require('../utils/Validator');


const UserInfoController = require("../controller/UserInfo.controller")


const storage = multer.diskStorage({
  
  destination: function(req, file, cb ){
    cb(null, './uploads');
  },
  filename: function(req, file, cb){
    
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb)=>{
  //reject a file
  if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
    cb(null, true);
  }else
  cb(null, false)
  
};

const upload = multer({storage: storage, 
  limits:{
fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter })






router.post("/info", userInfoValidationRules(), validate, checkAuth, upload.single('profilePics'), UserInfoController.UserFullDetails )


module.exports = router;