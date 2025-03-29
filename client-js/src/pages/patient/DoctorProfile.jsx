import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/api';
import { MapPin, Star, Clock, Calendar, Award, Phone, Mail } from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDoctorProfile(id);
    }
  }, [id]);

  const fetchDoctorProfile = async (doctorId) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching doctor profile for ID:', doctorId);
      
      const data = await doctorService.getProfile(doctorId);
      console.log('API Response:', data);
      
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
        about: data.bio || `${data.specialty} with ${data.experience} years of experience.`,
        education: data.education ? [data.education] : ['Medical Degree'],
        phone: data.phone || 'Phone not available',
        imageUrl: data.imageUrl || 'https://via.placeholder.com/128',
        // Transform availability to the expected format
        availableSlots: data.availability ? Object.entries(data.availability)
          .filter(([_, day]) => day.available)
          .map(([day, schedule]) => {
            // Get the next occurrence of this weekday
            const today = new Date();
            const currentDay = today.getDay();
            const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day.toLowerCase());
            
            // Calculate days until next occurrence
            let daysUntilNext = targetDay - currentDay;
            if (daysUntilNext <= 0) daysUntilNext += 7;
            
            // Get the date for this slot
            const slotDate = new Date(today);
            slotDate.setDate(today.getDate() + daysUntilNext);
            
            // Generate time slots between start and end time
            const timeSlots = [];
            const [startHour] = schedule.start.split(':').map(Number);
            const [endHour] = schedule.end.split(':').map(Number);
            
            for (let hour = startHour; hour < endHour; hour++) {
              timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
            }
            
            return {
              date: slotDate.toISOString().split('T')[0],
              displayDate: slotDate.toLocaleDateString(),
              times: timeSlots
            };
          }) : []
      };
      
      setDoctor(formattedDoctor);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError('Failed to load doctor profile. Please try again later.');
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <div className="ml-2 text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Doctor not found'}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link
          to="/patient/search"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          &larr; Back to search
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <img
              src={doctor.imageUrl || 'https://via.placeholder.com/128'}
              alt={doctor.name || 'Doctor'}
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold">{doctor.name || 'Unknown Doctor'}</h1>
              <p className="text-xl opacity-90">{doctor.specialty || 'Specialty not specified'}</p>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{doctor.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span>{typeof doctor.rating !== 'undefined' ? `${doctor.rating} Rating` : 'Rating not available'}</span>
                <span className="mx-2">•</span>
                <Award className="h-5 w-5 mr-2" />
                <span>{typeof doctor.experience !== 'undefined' ? `${doctor.experience} years experience` : 'Experience not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600">{doctor.about || 'No information available about this doctor.'}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              {doctor.education && doctor.education.length > 0 ? (
                <ul className="space-y-2">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                      <span>{edu}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No education information available.</p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{doctor.phone || 'Phone number not available'}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{doctor.email || 'Email not available'}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Appointment Booking */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
              {doctor.availableSlots && doctor.availableSlots.length > 0 ? (
                <div className="space-y-4">
                  {doctor.availableSlots.map((slot, index) => (
                    <div key={index} className="bg-white rounded-md p-4 shadow-sm">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">{slot.displayDate}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {slot.times && slot.times.map((time, timeIndex) => (
                          <Link
                            key={timeIndex}
                            to={`/patient/book/${doctor.id}?date=${slot.date}&time=${time}`}
                            className="flex items-center justify-center px-3 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            {time}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-100 rounded-md">
                  <p className="text-gray-500">No available slots</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 