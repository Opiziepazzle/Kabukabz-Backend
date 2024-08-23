const mongoose = require('mongoose');

const userInfoSchema =  new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, 
    ref:'User', 
    required: true
     },
  name: {
    type: String,
    required: true,
  },
  profilePics: {
    type: String,
    description: 'URL or path to the user’s profile picture.'
  },
  dob: {
    type: Date,
    required: true,
    description: 'Date of birth of the user.'
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    description: 'Gender of the user (e.g., male, female).'
  },
  nationality: {
    type: String,
    required: true,
    description: 'Nationality of the user.'
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married'],
    description: 'Marital status of the user (e.g., single, married).'
  },
  highestEducationalBackground: {
    type: String,
    description: 'Highest level of education attained.'
  },
  houseAddress: {
    type: String,
    description: 'Residential address of the user.'
  },
  email: {
    type: String,
    required: true,
    unique: true,
   match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    description: 'Email address of the user (unique).'
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    description: 'Phone number of the user (unique).'
  },
  emergencyContactPhoneNumber: {
    type: String,
    description: 'Phone number for emergency contact.'
  },
  idCardType: {
    type: String,
    enum: ['NIN', 'Passport', 'Voter\'s Card', 'Driver\'s License'],
    description: 'Type of ID card (e.g., NIN, Passport, Voter\'s Card, Driver\'s License).'
  },
  idCardNumber: {
    type: String,
    description: 'Unique identifier for the selected ID card type.'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt timestamps
});




module.exports = mongoose.model('UserDetails', userInfoSchema);





