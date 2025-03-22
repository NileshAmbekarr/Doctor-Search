const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { bookAppointment, cancelAppointment, getAppointments } = require('../controllers/appointmentController');

// Endpoint for booking an appointment (protected route)
router.post('/', authMiddleware, bookAppointment);

// Endpoint for cancelling an appointment by ID (protected route)
router.put('/:id/cancel', authMiddleware, cancelAppointment);

// Endpoint to fetch appointments for the logged-in user (protected route)
router.get('/', authMiddleware, getAppointments);

module.exports = router;
