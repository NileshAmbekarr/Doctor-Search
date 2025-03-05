const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an appointment
const appointmentSchema = new Schema({
    // Reference to the doctor’s profile for which the appointment is booked
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'DoctorProfile',
        required: true
    },
    // Reference to the patient (User) who booked the appointment
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The date for the appointment
    appointmentDate: { type: Date, required: true },
    // The specific time slot booked for the appointment
    timeSlot: { type: String, required: true },
    // Status field to indicate if the appointment is active or cancelled
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
