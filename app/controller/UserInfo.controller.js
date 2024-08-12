const userInfoSchema = require("../models/userInfo.model");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');



exports.UserFullDetails = (req, res, next) => {

    const { name, dob, gender, nationality, maritalStatus, highestEducationalBackground, houseAddress, email, phone, emergencyContactPhoneNumber, idCardType, idCardNumber } = req.body;
    const profilePics = req.file ? req.file.path : undefined;
    userInfoSchema.findOne({ email })
        .exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            } else {
                return userInfoSchema.findOne({ phone }).exec();
            }
        })
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: 'Phone number already exists'
                });
            } else {
                const userInfo = new userInfoSchema({
                    _id: new mongoose.Types.ObjectId(),
                    name,
                    profilePics,
                    dob,
                    gender,
                    nationality,
                    maritalStatus,
                    highestEducationalBackground,
                    houseAddress,
                    email,
                    phone,
                    emergencyContactPhoneNumber,
                    idCardType,
                    idCardNumber
                });

                userInfo.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'User Details Saved Successfully',
                            user: result
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err.message
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        })
        }






       exports.Logout = (req, res) => {
            // Clear the token cookie or remove the token from client side
            res.clearCookie('token'); // Assuming the token is stored in a cookie
          
            res.status(200).json({ message: 'Logout successful' });
          }
        