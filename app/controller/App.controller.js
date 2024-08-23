const userSchema = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();


const { validationResult } = require('express-validator');
const validator = require('validator');


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



exports.SignUp =  (req, res, next) => {
   
    // Extract the relevant fields from the request body
 const { email, number, password, confirmPassword, code } = req.body;
   
   // Check validation errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
   }

   // Sanitize inputs
   const sanitizedEmail = validator.normalizeEmail(email);
   const sanitizedNumber = validator.escape(number);








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
  }




  exports.Login =  (req, res) => {
    const { emailOrNumber, password } = req.body;

// Check validation errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}


// Sanitize inputs
const sanitizedInput = isNaN(emailOrNumber) ? validator.normalizeEmail(emailOrNumber) : validator.escape(emailOrNumber);
// Check if the input is an email address or a number
const query = isNaN(emailOrNumber) ? { email: sanitizedInput } : { number: sanitizedInput };


    if (!emailOrNumber || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    // Check if the input is an email address or a number
   // const query = isNaN(emailOrNumber) ? { email: emailOrNumber } : { number: emailOrNumber };

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
                res.status(200).json({ message: 'Auth Successful', token: token,
                   user: {
                  email: user.email,
                  code:user.code,
                  number: user.number,
                  userId: user._id,
                availabilityStatus: user.availabilityStatus,
                isVerified: user.isVerified
                }
              })
            
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Server error', details: err.message });
        });
}




exports.UpdateProfile = (req, res) => {
    const { email, password, code, number, image } = req.body;
  
// Check validation errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}

// Update user profile
const updateData = {};
if (email) updateData.email = validator.normalizeEmail(email);
if (code) updateData.code = validator.escape(code);
if (number) updateData.number = validator.escape(number);
if (image) updateData.image = validator.escape(image);
//if (typeof active !== 'undefined') updateData.active = active;

if (password) {
    updateData.password = bcrypt.hashSync(password, 10);
}

userSchema.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true })
    .exec()
    .then(updatedUser => {
        res.status(200).json({
            message: 'Profile updated successfully',
            userDetails: {
                email: updatedUser.email,
                number: updatedUser.number,
                image: updatedUser.image,
             //   active: updatedUser.active
            }
        });
    })
    .catch(err => {
        res.status(500).json({ error: 'Server error', details: err.message });
    });
}


exports.DeleteUser = (req, res) => {
    const userId = req.user._id; 

    userSchema.findByIdAndDelete(userId)
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            res.status(200).json({
                message: 'User deleted successfully'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: 'Server error',
                details: err.message
            });
        });
};



   

exports.Logout = (req, res) => {
    // Clear the token cookie or remove the token from client side
    res.clearCookie('token'); // Assuming the token is stored in a cookie
  
    res.status(200).json({ message: 'Logout successful' });
  }