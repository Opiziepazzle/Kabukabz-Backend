const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const userSchema = require("../models/user.model");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();




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




  
  router.post("/signup", (req, res, next) => {
   
    // Extract the relevant fields from the request body
 const { email, number, password, confirmPassword, code } = req.body;
   
   
   
   
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      });
    }
  
    // Password validation regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(req.body.password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
      });


    }
  
    // Avoid users registering with the same email or number
    userSchema.find({ email })
      .exec()
      .then((user) => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "Mail already exists",
          });
        } else {
          return userSchema.find({ number })
            .exec();
        }
      })
      .then((user) => {
        if (user && user.length >= 1) {
          return res.status(409).json({
            message: "Phone number already exists",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const verificationToken = jwt.sign(
                { email},
                process.env.JWT_KEY,
                { expiresIn: '1h' }
              );
  
              const user = new userSchema({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: hash,
                code,
                number,
                verificationToken: verificationToken,
                verificationTokenExpires: Date.now() + 3600000 // 1 hour
              });
  
              user.save()
                .then((result) => {
                  // Send verification email
                  const mailOptions = {
                    from: process.env.EMAIL,
                    to: req.body.email,
                    subject: 'Email Verification',
                    text: `Click the link to verify your email: http://${req.headers.host}/verify/verify-email?token=${verificationToken}`
                  };
  
                  transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                      console.log(err);
                      return res.status(500).json({
                        error: err
                      });
                    } else {
                      res.status(201).json({
                        message: "User created. Please check your email to verify your account."
                      });
                    }
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
  
  

  




router.post('/Login', (req, res) => {
    const { emailOrNumber, password } = req.body;

    if (!emailOrNumber || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    // Check if the input is an email address or a number
    const query = isNaN(emailOrNumber) ? { email: emailOrNumber } : { number: emailOrNumber };

    userSchema.findOne(query)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Auth Failed: User not found' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({ message: 'Auth Failed: Incorrect password' });
                }

                // Password is correct, generate JWT
                const token = jwt.sign(
                    {
                        email: user.email,
                        number: user.number,
                        userId: user._id
                    },
                    process.env.JWT_KEY,
                    { expiresIn: '1h' }
                );

                // Optionally, set a cookie for storing the token securely
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                // Respond with success message and token
                res.status(200).json({ message: 'Auth Successful', token: token, username: user.username });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Server error', details: err.message });
        });
});




// Logout route
router.post('/logout', (req, res) => {
    // Clear the token cookie or remove the token from client side
    res.clearCookie('token'); // Assuming the token is stored in a cookie

    res.status(200).json({ message: 'Logout successful' });
});


module.exports = router;