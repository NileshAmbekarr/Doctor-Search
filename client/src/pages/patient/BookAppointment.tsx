import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { doctorService, appointmentService } from '../../services/api';
import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  imageUrl: string;
}

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingStatus, setBookingStatus] = useState('idle');

  const selectedDate = searchParams.get('date');
  const selectedTime = searchParams.get('time');

  useEffect(() => {
    if (doctorId) {
      fetchDoctorDetails(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorDetails = async (id: string) => {
    try {
      const data = await doctorService.getProfile(id);
      setDoctor(data);
    } catch (err: any) {
      setError('Failed to load doctor details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!doctor || !selectedDate || !selectedTime) return;

    setBookingStatus('loading');
    try {
      await appointmentService.book({
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedTime,
      });
      navigate('/patient/dashboard', { state: { success: true } });
    } catch (err: any) {
      setError('Failed to book appointment');
      setBookingStatus('error');
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm Appointment</h1>

        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-gray-600 text-sm">{doctor.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-gray-600">{selectedDate}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-gray-600">{selectedTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Consultation Fee</span>
              <span className="font-medium">$100</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Booking Fee</span>
              <span className="font-medium">$10</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Amount</span>
                <span>$110</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            onClick={handleBookAppointment}
            disabled={bookingStatus === 'loading'}
            className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {bookingStatus === 'loading' ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;