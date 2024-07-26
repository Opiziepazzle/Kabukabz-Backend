
const { check, validationResult } = require('express-validator');
const validator = require('validator');

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
    validate,
};
