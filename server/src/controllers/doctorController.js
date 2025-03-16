// controllers/doctorController.js
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/userModel');

// Controller to create or update a doctor's profile
const createOrUpdateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id; // Retrieved from auth middleware
        // Ensure that only users with the 'doctor' role can create/update a profile
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can create/update profile' });
        }

        const { specialty, experience, location, availability } = req.body;
        // Validate that required fields are provided
        if (!specialty || !experience || !location || !location.city || !location.state) {
            return res.status(400).json({ message: 'Please provide all required fields: specialty, experience, city, state.' });
        }

        // Check if the profile already exists for the doctor
        let profile = await DoctorProfile.findOne({ user: userId });
        if (profile) {
            // Update the existing profile
            profile.specialty = specialty;
            profile.experience = experience;
            profile.location = location;
            // Update availability only if new data is provided; else, keep existing slots
            profile.availability = availability || profile.availability;
            await profile.save();
            return res.json({ message: 'Profile updated successfully', profile });
        } else {
            // Create a new profile if one doesn't exist
            profile = new DoctorProfile({
                user: userId,
                specialty,
                experience,
                location,
                availability: availability || []
            });
            await profile.save();
            return res.status(201).json({ message: 'Profile created successfully', profile });
        }
    } catch (error) {
        next(error);
    }
};

// Controller to get the logged-in doctor's profile
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // Ensure only doctors can access their profile
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Only doctors can view their profile' });
        }
        const profile = await DoctorProfile.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json(profile);
    } catch (error) {
        next(error);
    }
};

// Controller to search for doctors based on filters
const searchDoctors = async (req, res, next) => {
    try {
        // Extract filters from both query string and request body
        const filters = { ...req.query, ...req.body };
        const { specialty, city, state, name } = filters;
        
        console.log('Search filters:', filters); // Log for debugging
        
        // Build a query object based on the filters provided
        let query = {};
        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' }; // Case-insensitive search
        }
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }
        if (state) {
            query['location.state'] = { $regex: state, $options: 'i' };
        }
        
        // Find matching doctor profiles and also populate the linked User document (to get the doctor's name)
        let profiles = await DoctorProfile.find(query).populate('user', 'name email');
        
        // Filter by doctor's name if provided
        if (name) {
            profiles = profiles.filter(profile => 
                profile.user && profile.user.name && 
                profile.user.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        
        console.log(`Found ${profiles.length} matching doctors`); // Log for debugging
        
        res.json(profiles);
    } catch (error) {
        console.error('Doctor search error:', error);
        next(error);
    }
};

module.exports = { createOrUpdateProfile, getProfile, searchDoctors };
