const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
   // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Updated regex
  },

  password: { 
    type: String, 
    required: true,
  },

  code: { type: String,
    required: true 

   },

  number: { type: Number,
     required: true,
     unique: true 
    },

 isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: String,
  verificationTokenExpires: Date,

 
  resetOTP: {
    type: String
},
 
resetOTPExpires: {
    type: Date
},



googleId: {
    type: String,
    required: false
  },
  displayName: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },

  availabilityStatus: {  
    type: String,
    enum: ['available', 'unavailable', 'busy'],  
    default: 'available'

  }

},



{
  timestamps: true  // Correctly place timestamps option here





}


);


// Creating indexes on frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ number: 1 });

module.exports = mongoose.model('User', userSchema);
