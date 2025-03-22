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
    // Doctor's professional bio
    bio: { type: String },
    // Doctor's education and qualifications
    education: { type: String },
    // Consultation fee
    consultationFee: { type: Number },
    // Location information stored as a nested object with city and state
    location: {
        city: { type: String },
        state: { type: String }
    },
    // Structured availability by day of week
    availability: {
        monday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        tuesday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        wednesday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        thursday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        friday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        saturday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        },
        sunday: { 
            available: { type: Boolean, default: false },
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' }
        }
    }
}, { timestamps: true });

// Export the model so it can be used elsewhere in the app
module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
