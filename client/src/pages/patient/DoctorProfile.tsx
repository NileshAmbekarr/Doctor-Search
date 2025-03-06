import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../../services/api';
import { MapPin, Star, Clock, Calendar, Award, Phone, Mail } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  experience: number;
  education: string[];
  about: string;
  imageUrl: string;
  phone: string;
  email: string;
  availableSlots: {
    date: string;
    times: string[];
  }[];
}

const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchDoctorProfile(id);
    }
  }, [id]);

  const fetchDoctorProfile = async (doctorId: string) => {
    try {
      const data = await doctorService.getProfile(doctorId);
      setDoctor(data);
    } catch (err: any) {
      setError('Failed to load doctor profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Doctor not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white"
            />
            <div className="md:ml-6 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="text-xl opacity-90">{doctor.specialty}</p>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span>{doctor.rating} Rating</span>
                <span className="mx-2">•</span>
                <Award className="h-5 w-5 mr-2" />
                <span>{doctor.experience} years experience</span>
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
              <p className="text-gray-600">{doctor.about}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              <ul className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start">
                    <Award className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <span>{doctor.email}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Appointment Booking */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
              <div className="space-y-4">
                {doctor.availableSlots.map((slot, index) => (
                  <div key={index} className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">{slot.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {slot.times.map((time, timeIndex) => (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;