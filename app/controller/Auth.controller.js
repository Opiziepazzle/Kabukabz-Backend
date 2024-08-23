const userSchema = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const checkAuth = require("../middleware/App.middleware");
require('dotenv').config();



exports.VerifyEmail =  (req, res) => {
    const token = req.query.token;
  
    if (!token) {
      return res.status(400).json({
        message: "Invalid or missing token"
      });
    }
  
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "Invalid or expired token"
        });
      }
  
      userSchema.findOneAndUpdate(
        { email: decoded.email, verificationToken: token, verificationTokenExpires: { $gt: Date.now() } },
        { isVerified: true, verificationToken: undefined, verificationTokenExpires: undefined },
        { new: true }
      ).then(user => {
        if (!user) {
          return res.status(400).json({
            message: "User not found or token expired"
          });
        }
        res.status(200).json({
          message: "Email verified successfully"
        });
      }).catch(err => {
        res.status(500).json({
          error: err
        });
      });
    });
  }


  

  exports.ReVerifyEmail =  (req, res) => {
    const email = req.body.email; // Assuming you send the email as part of the request body
  
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }
  
    // Find user by email and resend verification email
    userSchema.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "User not found"
          });
        }
  
        // Generate new token and send verification email
        const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' }); // Adjust expiration as needed
  
        // Update user's verification token and expiration
        user.verificationToken = token;
        user.verificationTokenExpires = Date.now() + 3600000; // 1 hour
  
        return user.save();
      })
      .then(user => {
        // Send email logic here (use your nodemailer configuration)
        const verificationLink = `http://localhost:1911/user/verify-email?token=${user.verificationToken}`;
        res.status(200).json({
          message: "Verification email sent successfully"
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err.message
        });
      });
  }


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



  exports.RequestResetPassword =  (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    userSchema.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const otp = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate a 6-character OTP
            user.resetOTP = otp;
            user.resetOTPExpires = Date.now() + 3600000; // 1 hour

            return user.save();
        })
        .then(user => {
            sendOTPEmail(user.email, user.resetOTP);
            res.status(200).json({ message: "OTP sent to email" });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}



exports.ResetPassword =  (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    userSchema.findOne({ email, resetOTP: otp, resetOTPExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: "Invalid OTP or OTP expired" });
            }

            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                user.password = hash;
                user.resetOTP = undefined;
                user.resetOTPExpires = undefined;

                user.save()
                    .then(() => {
                        res.status(200).json({ message: "Password updated successfully" });
                    })
                    .catch(err => {
                        res.status(500).json({ error: err.message });
                    });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
}