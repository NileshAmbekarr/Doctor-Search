
const express = require('express');
require('dotenv').config(); // Ensure environment variables are loaded

// Importing Routes
const authRoutes = require('./routes/authRoutes'); 
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes)

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

module.exports = app;
