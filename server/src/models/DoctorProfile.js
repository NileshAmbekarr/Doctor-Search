const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a doctor's profile
const doctorProfileSchema = new Schema({
    // Reference to the User model, ensuring a one-to-one relation.
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Specialty of the doctor (e.g., Cardiologist, Dermatologist)
    specialty: { type: String, required: true },
    // Years of experience
    experience: { type: Number, required: true },
    // Location information stored as a nested object with city and state
    location: {
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    // Availability slots: an array of objects representing date and time slots
    availability: [{
        date: { type: Date, required: true },
        // timeSlots can be a list of strings (e.g., "09:00", "09:30")
        timeSlots: [{ type: String }]
    }]
}, { timestamps: true });

// Export the model so it can be used elsewhere in the app
module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
