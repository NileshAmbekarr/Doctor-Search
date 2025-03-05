const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, searchDoctors } = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/auth');

// Route to create or update a doctor's profile (protected route)
router.post('/profile', authMiddleware, createOrUpdateProfile);

// Route for a doctor to fetch their own profile (protected route)
router.get('/profile', authMiddleware, getProfile);

// Route for patients to search for doctors using filters
router.get('/search', searchDoctors);

module.exports = router;
