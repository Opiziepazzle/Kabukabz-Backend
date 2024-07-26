const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const userSchema = require("../models/user.model");
const jwt = require('jsonwebtoken')
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();



const AuthController = require('../controller/Auth.controller')





//Verify Email 
router.get('/verify-email',  AuthController.VerifyEmail );



// Resend Email Verification Endpoint
router.post('/resend-verification-email', AuthController.ReVerifyEmail);
  





// OTP Method
function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        html: `Your OTP for password reset is: ${otp}`
    };

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



router.post('/request-reset-password', AuthController.RequestResetPassword);


router.post('/reset-password', AuthController.ResetPassword);








//LINK method
//  Send reset password email
// function sendResetEmail(email, token) {
//     const resetLink = `http://localhost:1911/reset/reset-password?token=${token}`;

//     const mailOptions = {
//         from: process.env.EMAIL
//         to: email,
//         subject: 'Password Reset Link',
//         html: `Click <a href="${resetLink}">here</a> to reset your password.`
//     };



//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//            user: process.env.EMAIL,
     //       pass: process.env.EMAIL_PASSWORD
//         },
//         tls: {
//             rejectUnauthorized: false
//           }
//       });
    
    

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

// router.post('/send-reset-email', (req, res) => {
//     const email = req.body.email;

//     if (!email) {
//         return res.status(400).json({
//             message: "Email is required"
//         });
//     }

//     // Find user by email and generate reset token
//     userSchema.findOne({ email })
//         .then(user => {
//             if (!user) {
//                 return res.status(404).json({
//                     message: "User not found"
//                 });
//             }

//             // Generate reset token
//             const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' });

//             // Send reset email
//             sendResetEmail(user.email, token);

//             res.status(200).json({
//                 message: "Password reset email sent successfully"
//             });
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err.message
//             });
//         });
// });




// router.post('/reset-password', (req, res) => {
//     const { token, newPassword } = req.body;
//     console.log(`Received token: ${token}`);

//     if (!token || !newPassword) {
//         return res.status(400).json({ message: "Token and new password are required" });
//     }

//     jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(400).json({ message: "Invalid or expired token" });
//         }

//         userSchema.findOne({ email: decoded.email })
//             .then(user => {
//                 if (!user) {
//                     return res.status(404).json({ message: "User not found" });
//                 }

//                 bcrypt.hash(newPassword, 10, (err, hash) => {
//                     if (err) {
//                         return res.status(500).json({ error: err.message });
//                     }

//                     user.password = hash;
//                     user.save()
//                         .then(() => {
//                             res.status(200).json({ message: "Password updated successfully" });
//                         })
//                         .catch(err => {
//                             res.status(500).json({ error: err.message });
//                         });
//                 });
//             })
//             .catch(err => {
//                 res.status(500).json({ error: err.message });
//             });
//     });
// });






module.exports = router;










