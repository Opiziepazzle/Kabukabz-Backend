const express = require('express');
const router = express.Router();
const axios = require('axios');
const rideRequestSchema = require('../models/rideRequest.model');
const checkAuth = require("../middleware/App.middleware");


const redis = require('redis');
const { promisify } = require('util');


// Geocode address and return coordinates
const geocodeAddress = async (address) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.status === 'OK') {
            const { lat, lng } = response.data.results[0].geometry.location;
            return { lat, lng };
        } else {
            throw new Error('Address not found');
        }
    } catch (error) {
        throw new Error(`Geocoding error: ${error.message}`);
    }
};




// Create a new ride request
router.post('/ride-request', checkAuth, async (req, res) => {
    const { pickupAddress, dropoffAddress, vehicleType, optionalPaymentAmount } = req.body;
    const userID = req.user._id; // Extract userID from the authenticated user


    try {
        const pickupCoordinates = await geocodeAddress(pickupAddress);
        const dropoffCoordinates = await geocodeAddress(dropoffAddress);

        const newRequest = new rideRequestSchema({
            userID: userID,
            pickupAddress: { iv: '', encryptedData: '' }, // placeholder for encryption
            dropoffAddress: { iv: '', encryptedData: '' }, // placeholder for encryption
            vehicleType,
            optionalPaymentAmount,
            pickupCoordinates,
            dropoffCoordinates
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a ride request
router.patch('/ride-request/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userID = req.user._id; // Extract userID from the authenticated user

    try {
        // Find the ride request
        const request = await rideRequestSchema.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Ride request not found' });
        }

        // Ensure that the request belongs to the authenticated user
        if (request.userID.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this ride request' });
        }

        // Update the ride request
        request.status = status;
        request.updatedAt = Date.now();
        const updatedRequest = await request.save();

        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Query ride requests  with Redis client setup
const redisClient = redis.createClient({
    host: 'localhost', // Change to your Redis host
    port: 6379 // Default Redis port
});

const getAsync = promisify(redisClient.get).bind(redisClient);

// Fetch ride request with caching
router.get('/ride-request/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const userID = req.user._id; // Extract userID from the authenticated user

    try {
        // Check cache first
        const cachedRequest = await getAsync(id);
        if (cachedRequest) {
            // Cache hit: Return cached data
            return res.json(JSON.parse(cachedRequest));
        }

        // Cache miss: Fetch from database
        const request = await rideRequestSchema.findById(id).populate('userID');
        if (!request) {
            return res.status(404).json({ message: 'Ride request not found' });
        }

        // Ensure that the request belongs to the authenticated user
        if (request.userID._id.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You do not have permission to view this ride request' });
        }

        // Decrypt the addresses
        request.pickupAddress = request.getPickupAddress();
        request.dropoffAddress = request.getDropoffAddress();

        // Store the result in cache
        redisClient.setex(id, 3600, JSON.stringify(request)); // Cache for 1 hour

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Query ride requests without Redis

// router.get('/ride-request/:id', checkAuth, async (req, res) => {
//     const { id } = req.params;
//     const userID = req.user._id; // Extract userID from the authenticated user

//     try {
//         // Find the ride request
//         const request = await rideRequestSchema.findById(id).populate('userID');
//         if (!request) {
//             return res.status(404).json({ message: 'Ride request not found' });
//         }

//         // Ensure that the request belongs to the authenticated user
//         if (request.userID._id.toString() !== userID.toString()) {
//             return res.status(403).json({ message: 'You do not have permission to view this ride request' });
//         }

//         // Decrypt the addresses
//         request.pickupAddress = request.getPickupAddress();
//         request.dropoffAddress = request.getDropoffAddress();

//         res.json(request);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });




// Cancel a ride request

router.delete('/ride-request/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const userID = req.user._id; // Extract userID from the authenticated user

    try {
        // Find the ride request
        const request = await rideRequestSchema.findById(id).populate('userID');
        if (!request) {
            return res.status(404).json({ message: 'Ride request not found' });
        }

        // Ensure that the request belongs to the authenticated user
        if (request.userID._id.toString() !== userID.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this ride request' });
        }

        // Delete the ride request
        await rideRequestSchema.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;









