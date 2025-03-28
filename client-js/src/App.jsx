import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import DoctorSearch from './pages/patient/DoctorSearch';
import DoctorProfile from './pages/patient/DoctorProfile';
import BookAppointment from './pages/patient/BookAppointment';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfileManagement from './pages/doctor/Profile';
import NotFound from './pages/NotFound';
import PublicDoctorSearch from './pages/public/DoctorSearch';
import AuthCheck from './components/AuthCheck';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public Routes */}
              <Route path="/search" element={<PublicDoctorSearch />} />
              <Route path="/doctor/:id" element={<AuthCheck><DoctorProfile /></AuthCheck>} />
              
              {/* Patient Routes */}
              <Route path="/patient" element={<PrivateRoute role="patient" />}>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="search" element={<DoctorSearch />} />
                <Route path="doctor/:id" element={<DoctorProfile />} />
                <Route path="book/:doctorId" element={<BookAppointment />} />
              </Route>

              {/* Doctor Routes */}
              <Route path="/doctor" element={<PrivateRoute role="doctor" />}>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="profile" element={<DoctorProfileManagement key="doctor-profile" />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
