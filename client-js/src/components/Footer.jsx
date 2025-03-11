import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Doctor Search</h3>
            <p className="text-gray-300 mb-4">
              Find the best doctors in your area and book appointments online. Our platform
              connects patients with healthcare professionals for better healthcare access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/patient/search" className="text-gray-300 hover:text-white">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span className="text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span className="text-gray-300">contact@doctorsearch.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-gray-300">123 Medical Plaza, Healthcare City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; {new Date().getFullYear()} Doctor Search. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 