import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isDoctor, isPatient } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">Doctor Search</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {isPatient && (
                  <>
                    <Link
                      to="/patient/search"
                      className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                    >
                      Find Doctors
                    </Link>
                    <Link
                      to="/patient/dashboard"
                      className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                    >
                      My Appointments
                    </Link>
                  </>
                )}

                {isDoctor && (
                  <>
                    <Link
                      to="/doctor/dashboard"
                      className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/profile"
                      className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                    >
                      Profile
                    </Link>
                  </>
                )}

                <div className="flex items-center ml-4">
                  <span className="text-gray-700 mr-2">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <LogOut className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
              onClick={toggleMenu}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {isPatient && (
                  <>
                    <Link
                      to="/patient/search"
                      className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Find Doctors
                    </Link>
                    <Link
                      to="/patient/dashboard"
                      className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      My Appointments
                    </Link>
                  </>
                )}

                {isDoctor && (
                  <>
                    <Link
                      to="/doctor/dashboard"
                      className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/profile"
                      className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                  </>
                )}

                <div className="flex items-center px-3 py-2">
                  <User className="h-5 w-5 mr-1 text-gray-700" />
                  <span className="text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 