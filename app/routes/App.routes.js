const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const userSchema = require("../models/user.model");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();


const {  sinupValidationRules, loginValidationRules, updateValidationRules, validate } = require('../utils/Validator');
const AppController = require('../controller/App.controller')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL, // your email
      pass: process.env.EMAIL_PASSWORD
      
    },
    tls: {
        rejectUnauthorized: false
      }
  });




  
  router.post("/signup",  sinupValidationRules(), validate, AppController.SignUp );
  
  

  




router.post('/login', loginValidationRules(), validate, AppController.Login);


router.patch('/updateProfile', checkAuth,  updateValidationRules(), validate,  AppController.UpdateProfile );



router.delete('/deleteUser', checkAuth,  AppController.DeleteUser);




// Logout route
router.post('/logout', AppController.Logout )



module.exports = router;