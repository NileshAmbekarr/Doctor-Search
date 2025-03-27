import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { doctorService } from '../../services/api';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const PublicDoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    search: '',
  });
  const location = useLocation();

  useEffect(() => {
    // Extract specialty from URL if present
    const params = new URLSearchParams(location.search);
    const specialtyParam = params.get('specialty');
    
    if (specialtyParam) {
      setFilters(prev => ({ ...prev, specialty: specialtyParam }));
    }
  }, [location]);

  useEffect(() => {
    searchDoctors();
  }, [filters]);

  const searchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Searching with filters:', filters);
      
      const data = await doctorService.search(filters);
      console.log('API response:', data);
      
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        console.error('Unexpected API response format:', data);
        setDoctors([]);
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const specialties = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Psychiatrist',
    'Orthopedist',
  ];

  const locations = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Find a Doctor</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or specialty"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={filters.specialty}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor List */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading doctors...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-xl">No doctors found matching your criteria</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor, index) => (
                <Link
                  key={doctor._id || `doctor-${index}`}
                  to={`/doctor/${doctor._id || 'unknown'}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-start">
                    <img
                      src={doctor.imageUrl || 'https://via.placeholder.com/80'}
                      alt={(doctor.user && doctor.user.name) || 'Doctor'}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {(doctor.user && doctor.user.name) || 'Unknown Doctor'}
                      </h3>
                      <p className="text-gray-600">{doctor.specialty || 'Specialty not specified'}</p>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 text-sm">
                          {doctor.location && doctor.location.city ? 
                            `${doctor.location.city}${doctor.location.state ? `, ${doctor.location.state}` : ''}` : 
                            'Location not specified'}
                        </span>
                      </div>
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-gray-600 text-sm">
                          {typeof doctor.rating !== 'undefined' ? doctor.rating : 'N/A'} • {typeof doctor.experience !== 'undefined' ? `${doctor.experience} years experience` : 'Experience not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDoctorSearch; 