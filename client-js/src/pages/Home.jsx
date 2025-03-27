import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Clock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated, isDoctor, isPatient } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find the Right Doctor, Right Now
              </h1>
              <p className="text-xl mb-8">
                Book appointments with the best doctors in your area. Quick, easy, and secure.
              </p>
              {isAuthenticated ? (
                // For authenticated users
                <div className="space-x-4">
                  {isPatient && (
                    <Link
                      to="/patient/search"
                      className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                    >
                      Find a Doctor
                    </Link>
                  )}
                  {isDoctor && (
                    <Link
                      to="/doctor/dashboard"
                      className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                    >
                      My Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                // For unauthenticated users
                <div className="space-x-4">
                  <Link
                    to="/search"
                    className="inline-block bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                  >
                    Find a Doctor
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block bg-blue-800 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-900 transition duration-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <img
                src="https://img.freepik.com/free-photo/medium-shot-doctor-with-stethoscope_23-2148868176.jpg"
                alt="Doctor"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Doctors</h3>
              <p className="text-gray-600">
                Find doctors by specialty, location, or name. Filter results to match your needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
              <p className="text-gray-600">
                Select a convenient time slot from the doctor's available schedule and book instantly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Care</h3>
              <p className="text-gray-600">
                Visit the doctor at the scheduled time. Receive reminders before your appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Specialties</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Psychiatry'].map(
              (specialty) => (
                <Link
                  key={specialty}
                  to={`/search?specialty=${specialty}`}
                  className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-lg font-medium text-gray-900">{specialty}</h3>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - Show different CTAs based on authentication */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white text-blue-600 rounded-full mb-6">
            <Shield className="h-8 w-8" />
          </div>
          
          {isAuthenticated ? (
            <>
              <h2 className="text-3xl font-bold mb-4">Welcome back, {user?.name || 'User'}!</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                {isPatient ? 
                  'Ready to find your next appointment? Browse doctors and book your visit now.' : 
                  'Check your upcoming appointments and manage your schedule.'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isPatient && (
                  <Link
                    to="/patient/search"
                    className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                  >
                    Find a Doctor
                  </Link>
                )}
                <Link
                  to={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}
                  className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition duration-300"
                >
                  Go to Dashboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4">Ready to find your doctor?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Join thousands of patients who have found the perfect doctor and booked appointments
                through our platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition duration-300"
                >
                  Sign Up Now
                </Link>
                <Link
                  to="/search"
                  className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition duration-300"
                >
                  Find a Doctor
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 