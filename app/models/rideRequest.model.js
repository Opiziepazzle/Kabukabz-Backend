const mongoose = require('mongoose');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Use a secure key management strategy for production

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };
};

const decrypt = (encryptedText, iv) => {
    let ivBuffer = Buffer.from(iv, 'hex');
    let encryptedBuffer = Buffer.from(encryptedText, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};


const rideRequestSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    requestID: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() }, // Changed to String and auto-generated
    pickupAddress: {
        iv: String,
        encryptedData: String
    },
    dropoffAddress: {
        iv: String,
        encryptedData: String
    },
    vehicleType: { type: String, enum: ['Car', 'Bike', 'Van'] }, 
    optionalPaymentAmount: Number,
    status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    pickupCoordinates: {
        lat: Number,
        lng: Number
    },
    dropoffCoordinates: {
        lat: Number,
        lng: Number
    }
});


// Encrypt the address before saving
rideRequestSchema.pre('save', function(next) {
    if (this.isModified('pickupAddress') || this.isModified('dropoffAddress')) {
        if (this.pickupAddress) {
            const { iv, encryptedData } = encrypt(this.pickupAddress);
            this.pickupAddress = { iv, encryptedData };
        }
        if (this.dropoffAddress) {
            const { iv, encryptedData } = encrypt(this.dropoffAddress);
            this.dropoffAddress = { iv, encryptedData };
        }
    }
    next();
});


// Decrypt the address when retrieving
rideRequestSchema.methods.getPickupAddress = function() {
    return decrypt(this.pickupAddress.encryptedData, this.pickupAddress.iv);
};

rideRequestSchema.methods.getDropoffAddress = function() {
    return decrypt(this.dropoffAddress.encryptedData, this.dropoffAddress.iv);
};




// Creating indexes on frequently queried fields
rideRequestSchema.index({ userID: 1 });
rideRequestSchema.index({ status: 1 });


module.exports = mongoose.model('RideRequest', rideRequestSchema);
