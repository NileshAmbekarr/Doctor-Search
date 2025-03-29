import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, User, MapPin, X, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setLoading(true);
      await appointmentService.cancelAppointment(appointmentId);
      // Refresh appointments after cancellation
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group appointments by status
  const upcomingAppointments = appointments.filter(app => app.status === 'booked');
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/patient/search"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Find a Doctor
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">You don't have any upcoming appointments.</p>
                <Link
                  to="/patient/search"
                  className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                >
                  Book an appointment
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="bg-blue-600 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Appointment with Dr. {appointment.doctor.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirmed
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Doctor</p>
                            <p className="text-sm text-gray-600">
                              Dr. {appointment.doctor.name} - {appointment.doctor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date</p>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Time</p>
                            <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Location</p>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor.location?.city}, {appointment.doctor.location?.state}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 text-sm rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancelled Appointments */}
          {cancelledAppointments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancelled Appointments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cancelledAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden opacity-75"
                  >
                    <div className="bg-gray-600 text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Appointment with Dr. {appointment.doctor.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Cancelled
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Doctor</p>
                            <p className="text-sm text-gray-600">
                              Dr. {appointment.doctor.name} - {appointment.doctor.specialty}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Date</p>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Time</p>
                            <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          to="/patient/search"
                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-sm rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          Book New
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 