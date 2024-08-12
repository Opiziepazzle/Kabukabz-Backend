Documentation Breakdown
Short description: A brief summary of what the function or class does.
Long description: A detailed explanation of the function or class, including its purpose, usage, and any side effects.
@param: Describes the parameters of the function, including their types and what they represent.
@return: Describes the return value of the function, including its type and meaning. If the function returns null, it should be mentioned.
@throws: Describes the circumstances under which the function might throw an exception.
@since: Indicates the version when the function or class was added.
@todo: Lists any future considerations or improvements that might be needed.
@package: Specifies the package the class belongs to.
@var: Describes class properties, including their type and what they represent.



* Server.js

/**
 * Initializes the connection to the MongoDB database.
 *
 * This function initializes the connection to the MongoDB database using the URI specified
 * in the environment variables. It logs a message upon successful connection and logs
 * the error if the connection fails.
 *
 * @throws Error if the database connection fails.
 * @since 1.0.0
 */


* User Controller (user.controller.js)

/**
 * Verifies the user's email.
 *
 * This function verifies the user's email by decoding the token sent to the user's email. It updates the user's 
 * `isVerified` status if the token is valid and not expired.
 *
 * @param {Object} req - The request object containing the verification token.
 * @param {Object} res - The response object to send the verification status.
 * @return {void}
 * @throws Error if the token is invalid or expired, or if the user is not found.
 * @since 1.0.0
 * @todo Implement additional security checks.
 */


/**
 * Re-sends the email verification token.
 *
 * This function generates a new verification token and sends it to the user's email. It is used when the user requests 
 * to re-verify their email.
 *
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object to send the verification status.
 * @return {void}
 * @throws Error if the email is missing or the user is not found.
 * @since 1.0.0
 */


/**
 * Sends an OTP email.
 *
 * This function sends an OTP to the specified email for password reset purposes.
 *
 * @param {string} email - The email address to send the OTP.
 * @param {string} otp - The OTP to be sent.
 * @return {void}
 * @throws Error if the email sending fails.
 * @since 1.0.0
 */


/**
 * Requests a password reset.
 *
 * This function generates an OTP and sends it to the user's email for password reset.
 *
 * @param {Object} req - The request object containing the user's email.
 * @param {Object} res - The response object to send the OTP status.
 * @return {void}
 * @throws Error if the email is missing or the user is not found.
 * @since 1.0.0
 */


/**
 * Registers a new user.
 *
 * This function registers a new user by validating and sanitizing inputs, hashing the password, and sending a verification email.
 *
 * @param {Object} req - The request object containing the user's registration details.
 * @param {Object} res - The response object to send the registration status.
 * @return {void}
 * @throws Error if the registration fails due to validation errors or server issues.
 * @since 1.0.0
 */


* User Model (user.model.js)

/**
 * User schema definition.
 *
 * This schema defines the structure of the user document in the MongoDB collection. It includes fields for email, password, 
 * phone number, and verification statuses.
 *
 * @var {Schema} UserSchema The user schema.
 * @since 1.0.0
 * @package UserManagement
 */


* User Routes (user.routes.js)

/**
 * User signup route.
 *
 * @route POST /user/signup
 * @param {string} email - The user's email address.
 * @param {string} number - The user's phone number.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The user's confirmed password.
 * @param {string} code - The user's country code.
 * @return {void}
 * @throws Error if the registration fails.
 * @since 1.0.0
 */

/**
 * Email verification route.
 *
 * @route GET /user/verify-email
 * @param {string} token - The verification token.
 * @return {void}
 * @throws Error if the token is invalid or expired.
 * @since 1.0.0
 */

/**
 * Re-send verification email route.
 *
 * @route POST /user/reverify-email
 * @param {string} email - The user's email address.
 * @return {void}
 * @throws Error if the email is missing or the user is not found.
 * @since 1.0.0
 */


/**
 * Request password reset route.
 *
 * @route POST /user/request-reset-password
 * @param {string} email - The user's email address.
 * @return {void}
 * @throws Error if the email is missing or the user is not found.
 * @since 1.0.0
 */


/**
 * Password reset route.
 *
 * @route POST /user/reset-password
 * @param {string} email - The user's email address.
 * @param {string} otp - The OTP sent to the user's email.
 * @param {string} newPassword - The user's new password.
 * @return {void}
 * @throws Error if the OTP is invalid or expired, or if the user is not found.
 * @since 1.0.0
 */



/**
 * UserInfo schema for managing user details.
 *
 * @property {String} name - Name of the user.
 * @property {String} profilePic - URL of the profile picture.
 * @property {Date} dob - Date of birth of the user.
 * @property {String} gender - Gender of the user.
 * @property {String} nationality - Nationality of the user.
 * @property {String} maritalStatus - Marital status of the user.
 * @property {String} highestEducationalBackground - Highest educational background.
 * @property {String} houseAddress - Residential address of the user.
 * @property {String} email - Email address of the user (unique).
 * @property {String} phone - Phone number of the user (unique).
 * @property {String} emergencyContactPhoneNumber - Emergency contact phone number.
 * @property {String} idCardType - Type of ID card.
 * @property {String} idCardNumber - Unique identifier for the ID card.
 * @property {Date} createdAt - Timestamp indicating when the user account was created.
 * @property {Date} updatedAt - Timestamp indicating the last update made to the user account.
 */



 const User = require('../models/user.model');

/**
 * Route handler to create a new user.
 *
 * This route handles the creation of a new user. It ensures that email and phone number are unique.
 *
 * @param {Object} req - The request object containing user details in req.body.
 * @param {Object} res - The response object used to send the response.
 * @return {Object} - Returns a JSON object with success or error messages.
 */