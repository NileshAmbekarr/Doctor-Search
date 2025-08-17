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
      const doctorProfile = await DoctorProfile.findById(doctorId).populate('user');
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
  
      // Get current user (patient) for patient email notification
      const patient = await User.findById(req.user.id);
      
      // Send email notification to patient
      if (patient && patient.email) {
        try {
          // Prepare the email content for patient
          const patientEmailSubject = "Appointment Confirmation - Doctor Search";
          const patientEmailData = {
            name: patient.name || 'Patient',
            appointmentDate: new Date(appointmentDate).toLocaleDateString(),
            timeSlot: timeSlot,
            doctorName: doctorProfile.user?.name || 'your doctor'
          };
          
          // Try to use the template, fall back to simple HTML if template fails
          let patientEmailHtml;
          try {
            patientEmailHtml = loadTemplate('appointmentConfirmation', patientEmailData);
          } catch (templateError) {
            console.error('Failed to load patient template:', templateError);
            patientEmailHtml = `<p>Hello ${patient.name || 'Patient'},</p><p>Your appointment with ${doctorProfile.user?.name || 'your doctor'} on <strong>${new Date(appointmentDate).toLocaleDateString()}</strong> at <strong>${timeSlot}</strong> has been booked successfully.</p>`;
          }
          
          // Send the confirmation email to the patient
          await sendEmail(patient.email, patientEmailSubject, "", patientEmailHtml);
        } catch (emailError) {
          console.error('Failed to send patient confirmation email:', emailError);
          // Continue processing even if email fails
        }
      }
      
      // Send email notification to doctor
      if (doctorProfile.user && doctorProfile.user.email) {
        try {
          // Prepare the email content for doctor
          const doctorEmailSubject = "New Appointment Booked - Doctor Search";
          const doctorEmailData = {
            name: doctorProfile.user.name || 'Doctor',
            patientName: patient ? patient.name : 'A patient',
            appointmentDate: new Date(appointmentDate).toLocaleDateString(),
            timeSlot: timeSlot
          };
          
          // Try to use the template, fall back to simple HTML if template fails
          let doctorEmailHtml;
          try {
            doctorEmailHtml = loadTemplate('doctorAppointmentNotification', doctorEmailData);
          } catch (templateError) {
            console.error('Failed to load doctor template:', templateError);
            doctorEmailHtml = `<p>Hello Dr. ${doctorProfile.user.name || 'Doctor'},</p><p>A new appointment has been booked by ${patient ? patient.name : 'a patient'} on <strong>${new Date(appointmentDate).toLocaleDateString()}</strong> at <strong>${timeSlot}</strong>.</p>`;
          }
          
          // Send the notification email to the doctor
          await sendEmail(doctorProfile.user.email, doctorEmailSubject, "", doctorEmailHtml);
        } catch (emailError) {
          console.error('Failed to send doctor notification email:', emailError);
          // Continue processing even if email fails
        }
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
      
      // Validate appointment ID
      if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
      }

      // Find the appointment by its ID and populate doctor information
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Ensure that only the patient who booked the appointment can cancel it
      if (appointment.patient.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
      }
      
      // Check if the appointment is already cancelled
      if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Appointment is already cancelled' });
      }
      
      // Update the appointment status to 'cancelled'
      appointment.status = 'cancelled';
      await appointment.save();
      
      // Get the patient details
      const patient = await User.findById(req.user.id);
      
      // Send cancellation email to patient
      if (patient && patient.email) {
        try {
          // Prepare email content for patient
          const patientEmailSubject = "Appointment Cancellation - Doctor Search";
          const patientEmailData = {
            name: patient.name || 'Patient',
            appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
            timeSlot: appointment.timeSlot
          };
          
          try {
            const patientEmailHtml = loadTemplate('appointmentCancellation', patientEmailData);
            // Send cancellation notification email to patient
            await sendEmail(patient.email, patientEmailSubject, "", patientEmailHtml);
          } catch (emailError) {
            console.error('Failed to send patient cancellation email:', emailError);
            // Continue processing even if email fails
          }
        } catch (userError) {
          console.error('Failed to send patient email:', userError);
          // Continue processing even if patient email fails
        }
      }
      
      // Send cancellation email to doctor
      try {
        // Get doctor profile and their user details
        const doctorProfile = await DoctorProfile.findById(appointment.doctor).populate('user');
        
        if (doctorProfile && doctorProfile.user && doctorProfile.user.email) {
          // Prepare email content for doctor
          const doctorEmailSubject = "Appointment Cancellation Notice - Doctor Search";
          const doctorEmailData = {
            name: doctorProfile.user.name || 'Doctor',
            patientName: patient ? patient.name : 'A patient',
            appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
            timeSlot: appointment.timeSlot
          };
          
          try {
            const doctorEmailHtml = loadTemplate('doctorCancellationNotification', doctorEmailData);
            // Send cancellation notification email to doctor
            await sendEmail(doctorProfile.user.email, doctorEmailSubject, "", doctorEmailHtml);
          } catch (emailError) {
            console.error('Failed to send doctor cancellation email:', emailError);
            // Continue processing even if email fails
          }
        }
      } catch (doctorError) {
        console.error('Failed to retrieve doctor data for email:', doctorError);
        // Continue processing even if doctor email fails
      }
      
      res.json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      res.status(500).json({ 
        message: 'Failed to cancel appointment',
        error: error.message 
      });
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
