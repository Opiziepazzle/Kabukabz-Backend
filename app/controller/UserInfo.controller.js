const userInfoSchema = require("../models/userInfo.model");
const userSchema = require("../models/user.model");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const { validationResult } = require('express-validator');
const validator = require('validator');






exports.UserFullDetails = (req, res, next) => {
    const { name, dob, gender, nationality, maritalStatus, highestEducationalBackground, houseAddress, email, phone, emergencyContactPhoneNumber, idCardType, idCardNumber } = req.body;
    const profilePics = req.file ? req.file.path : undefined;


        // Get userId from authenticated user session
        const userId = req.user._id;


    // Validate if userId exists and is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if the user exists in the User collection
    userSchema.findById(userId)
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the email already exists in the userInfoSchema
            return userInfoSchema.findOne({ email }).exec()
                .then(existingUserInfo => {
                    if (existingUserInfo && existingUserInfo.userId.toString() !== userId.toString()) {
                        return res.status(409).json({ message: 'Email already exists' });
                    }

                    // Check if the phone number already exists in the userInfoSchema
                    return userInfoSchema.findOne({ phone }).exec()
                        .then(existingUserInfoByPhone => {
                            if (existingUserInfoByPhone && existingUserInfoByPhone.userId.toString() !== userId.toString()) {
                                return res.status(409).json({ message: 'Phone number already exists' });
                            }

                            // Create or update user info
                            return userInfoSchema.findOneAndUpdate(
                                { userId: user._id }, // Find by userId
                                {
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
                                },
                                { new: true, upsert: true } // Create new or update existing
                            ).exec();
                        });
                });
        })
        .then(result => {
            res.status(201).json({ message: 'User Details Saved Successfully', user: result });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};


