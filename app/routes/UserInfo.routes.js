const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const userInfoSchema = require("../models/userInfo.model"); 
const jwt = require('jsonwebtoken')
const multer = require('multer');
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();

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







router.post("/info", checkAuth, upload.single('profilePics'), UserInfoController.UserFullDetails )


//  UserInfoController.Logout,

router.post('/log/logout', (req, res) => {
  // Clear the token cookie or remove the token from client side
  res.clearCookie('token'); // Assuming the token is stored in a cookie

  res.status(200).json({ message: 'Logout successful' });
} )




module.exports = router;