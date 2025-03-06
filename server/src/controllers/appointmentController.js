const { sendEmail } = require('../services/emailservice');
const { loadTemplate } = require('../services/emailTamplates'); 
const Appointment = require('../models/appointment');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/userModel');


// Controller to book an appointment
const bookAppointment = async (req, res, next) => {
    try {
      const { doctorId, appointmentDate, timeSlot } = req.body;
      // Validate required fields
      if (!doctorId || !appointmentDate || !timeSlot) {
        return res.status(400).json({ message: 'Please provide doctorId, appointmentDate, and timeSlot' });
      }
  
      // Check if the doctor profile exists
      const doctorProfile = await DoctorProfile.findById(doctorId);
      if (!doctorProfile) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Prevent double booking by checking if the time slot is already booked
      const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate,
        timeSlot,
        status: 'booked'
      });
      if (existingAppointment) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
  
      // Create a new appointment
      const appointment = new Appointment({
        doctor: doctorId,
        patient: req.user.id, // Patient ID from the auth middleware
        appointmentDate,
        timeSlot
      });
      await appointment.save();
  
      // Retrieve the user's details from the database to ensure we have their email
      const user = await User.findById(req.user.id);
      if (!user || !user.email) {
        console.error('User email not found; skipping email notification.');
      } else {
        // Prepare the email content
        const emailSubject = "Appointment Confirmation - Clinic360";
        const emailText = `Your appointment on ${new Date(appointmentDate).toLocaleString()} at ${timeSlot} has been booked successfully.`;
        const emailHtml = `<p>Your appointment on <strong>${new Date(appointmentDate).toLocaleString()}</strong> at <strong>${timeSlot}</strong> has been booked successfully.</p>`;
        
        // Send the confirmation email to the user
        await sendEmail(user.email, emailSubject, emailText, emailHtml);
      }
  
      res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
      next(error);
    }
  };

// Controller to cancel an appointment
const cancelAppointment = async (req, res, next) => {
    try {
      const appointmentId = req.params.id;
      
      // Find the appointment by its ID
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure that only the patient who booked the appointment can cancel it
      if (appointment.patient.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
      }
      
      // Update the appointment status to 'cancelled'
      appointment.status = 'cancelled';
      await appointment.save();
      
      // Retrieve the user's details from the database to ensure we have their email
      const user = await User.findById(req.user.id);
      if (!user || !user.email) {
        console.error('User email not found; skipping email notification.');
      } else {
        // Prepare email content using a refined Handlebars template
        const emailSubject = "Appointment Cancellation - Clinic360";
        const emailData = {
          name: user.name || 'Patient',
          appointmentDate: new Date(appointment.appointmentDate).toLocaleString(),
          timeSlot: appointment.timeSlot
        };
        const emailHtml = loadTemplate('appointmentCancellation', emailData);
        
        // Send cancellation notification email
        await sendEmail(user.email, emailSubject, "", emailHtml);
      }
      
      res.json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
      next(error);
    }
  };

// Controller to fetch appointments for the logged-in user
const getAppointments = async (req, res, next) => {
    try {
        let appointments;
        // If the logged-in user is a patient, retrieve their booked appointments
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate('doctor', 'user specialty location');
        } 
        // If the user is a doctor, first retrieve the doctor's profile then fetch appointments
        else if (req.user.role === 'doctor') {
            const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
            if (!doctorProfile) {
                return res.status(404).json({ message: 'Doctor profile not found' });
            }
            appointments = await Appointment.find({ doctor: doctorProfile._id })
                .populate('patient', 'name email');
        }
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

module.exports = { bookAppointment, cancelAppointment, getAppointments };
