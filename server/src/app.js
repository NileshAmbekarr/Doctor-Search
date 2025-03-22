const express = require('express');
require('dotenv').config(); // Ensure environment variables are loaded
const cors = require('cors')

// Importing Routes
const authRoutes = require('./routes/authRoutes'); 
const doctorRoutes = require('./routes/doctor');
const appointmentRoutes = require('./routes/appointment');

// Utility function for standardized error handling
const handleError = (res, error, statusCode = 500) => {
    console.error('Error:', error);
    const message = process.env.NODE_ENV === 'production' 
        ? 'Something went wrong' 
        : error.message;
    return res.status(statusCode).json({ error: message });
};

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use(cors({
    origin: "*",
    credentials: true, 
}))

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/appointment', appointmentRoutes)

// Global error handler middleware
app.use((err, req, res, next) => {
    handleError(res, err);
});

module.exports = app;
