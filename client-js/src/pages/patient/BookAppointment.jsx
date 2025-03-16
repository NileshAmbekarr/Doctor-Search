import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { doctorService, appointmentService } from '../../services/api';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    notes: '',
  });

  // Extract date and time from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    const timeParam = params.get('time');
    
    if (dateParam && timeParam) {
      // Ensure the date is in the correct format (YYYY-MM-DD)
      let formattedDate = dateParam;
      
      // If the date is not in YYYY-MM-DD format, try to convert it
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        try {
          const date = new Date(dateParam);
          formattedDate = date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
        }
      }
      
      setBookingData(prev => ({
        ...prev,
        date: formattedDate,
        time: timeParam,
      }));
    }
  }, [location]);

  // Fetch doctor details
  useEffect(() => {
    if (doctorId) {
      fetchDoctorProfile(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorProfile = async (id) => {
    try {
      setLoading(true);
      console.log('Fetching doctor profile for booking, ID:', id);
      
      const data = await doctorService.getProfile(id);
      console.log('API Response for booking:', data);
      
      // Transform the API response to match the expected format
      const formattedDoctor = {
        id: data._id,
        name: data.user ? data.user.name : 'Unknown Doctor',
        email: data.user ? data.user.email : 'Email not available',
        specialty: data.specialty || 'Specialty not specified',
        location: data.location ? `${data.location.city}, ${data.location.state}` : 'Location not specified',
        experience: data.experience || 0,
        // Add default values for fields that might not be in the API response
        rating: data.rating || 4.5, // Default rating
        about: data.about || `${data.specialty} with ${data.experience} years of experience.`,
        education: data.education || ['Medical Degree'],
        phone: data.phone || 'Phone not available',
        imageUrl: data.imageUrl || 'https://via.placeholder.com/128',
        // Transform availability to the expected format
        availableSlots: data.availability ? data.availability.map(slot => {
          // Format date as YYYY-MM-DD for form inputs
          const date = new Date(slot.date);
          const formattedDate = date.toISOString().split('T')[0]; // Gets YYYY-MM-DD format
          
          return {
            date: formattedDate,
            displayDate: date.toLocaleDateString(), // For display purposes
            times: slot.timeSlots || []
          };
        }) : []
      };
      
      setDoctor(formattedDoctor);
      setError('');
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError('Failed to load doctor profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      setError('Please select a date and time for your appointment.');
      return;
    }

    try {
      setLoading(true);
      await appointmentService.book({
        doctorId,
        appointmentDate: bookingData.date,
        timeSlot: bookingData.time,
        notes: bookingData.notes,
      });
      
      setSuccess(true);
      setError('');
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <div className="ml-2 text-xl">Loading...</div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <Link
            to="/patient/search"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            &larr; Back to search
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment with Dr. {doctor?.name} on {new Date(bookingData.date).toLocaleDateString()} at {bookingData.time} has been confirmed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/patient/dashboard"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              View My Appointments
            </Link>
            <Link
              to="/patient/search"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-300"
            >
              Find More Doctors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          to={`/patient/doctor/${doctorId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          &larr; Back to doctor profile
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          {doctor && (
            <p className="mt-2">
              with Dr. {doctor.name} - {doctor.specialty}
            </p>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a time</option>
                    {doctor?.availableSlots?.find(slot => slot.date === bookingData.date)?.times.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={bookingData.notes}
                onChange={handleChange}
                placeholder="Any specific concerns or information you'd like to share with the doctor"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Summary</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Doctor</p>
                    <p className="text-sm text-gray-600">
                      {doctor ? `Dr. ${doctor.name} - ${doctor.specialty}` : 'Loading...'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm text-gray-600">
                      {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not selected'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Time</p>
                    <p className="text-sm text-gray-600">
                      {bookingData.time || 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment; 