
const { check, validationResult } = require('express-validator');
const validator = require('validator');
const mongoose = require('mongoose');
const userInfoSchema = require("../models/userInfo.model");
const userSchema = require("../models/user.model");






const sinupValidationRules = () => {
    return [
        check('email').isEmail().withMessage('Enter a valid email address'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must include an uppercase letter, a lowercase letter, a number, and a special character'),
        check('number').isMobilePhone().withMessage('Enter a valid phone number'),
        // Add other validation rules as needed
    ];
}

const loginValidationRules = () => {
    return [
        check('emailOrNumber').notEmpty().withMessage('Email or number is required'),
        check('password').notEmpty().withMessage('Password is required')
    ];
};

const updateValidationRules = () => {
    return [
        check('email').optional().isEmail().withMessage('Enter a valid email address'),
        check('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
            .withMessage('Password must include an uppercase letter, a lowercase letter, a number, and a special character'),
        check('number').optional().isMobilePhone().withMessage('Enter a valid phone number'),
        // Add other validation rules as needed
    ];
}




const userInfoValidationRules = () => {
    return [
        check('userId')
            .optional()
            .exists({ checkFalsy: true }).withMessage('User ID is required')
            .bail()
            .isMongoId().withMessage('Invalid user ID'),
        check('name').optional().notEmpty().withMessage('Name cannot be empty'),
        check('dob').optional().isISO8601().withMessage('Invalid date of birth'),
        check('email').optional().isEmail().withMessage('Enter a valid email address'),
        check('phone').optional().isMobilePhone().withMessage('Enter a valid phone number'),
        check('emergencyContactPhoneNumber').optional().isMobilePhone().withMessage('Enter a valid emergency contact phone number'),
        check('idCardNumber').optional().notEmpty().withMessage('ID card number cannot be empty'),
        check('gender').optional().isIn(['male', 'female']).withMessage('Gender must be male or female'),
        // Add other validation rules as needed
    ];
};





const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}






module.exports = {
     sinupValidationRules,
     loginValidationRules,
     updateValidationRules,
     userInfoValidationRules,
    validate,
};
