const express = require('express');
const router = express.Router();
const locationSchema = require('../models/location.model');
const axios = require('axios');

// Add a new location
router.post('/', async (req, res) => {
    const { name, address } = req.body;

    try {
        // Call Google Maps Geocoding API
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: 'YOUR_GOOGLE_MAPS_API_KEY'
            }
        });

        if (response.data.status === 'OK') {
            const { lat, lng } = response.data.results[0].geometry.location;

            const location = new locationSchema({
                name,
                address,
                coordinates: { lat, lng }
            });

            await location.save();
            res.status(201).json(location);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await locationSchema.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
