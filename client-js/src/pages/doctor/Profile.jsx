import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/api';

// Helper function to get default profile data structure
const getDefaultProfileData = () => ({
  specialty: '',
  experience: '',
  education: '',
  bio: '',
  consultationFee: '',
  location: { city: '', state: '' },
  availability: {
    monday: { available: false, start: '09:00', end: '17:00' },
    tuesday: { available: false, start: '09:00', end: '17:00' },
    wednesday: { available: false, start: '09:00', end: '17:00' },
    thursday: { available: false, start: '09:00', end: '17:00' },
    friday: { available: false, start: '09:00', end: '17:00' },
    saturday: { available: false, start: '09:00', end: '17:00' },
    sunday: { available: false, start: '09:00', end: '17:00' },
  }
});

// Helper function to format profile data from API response
const formatProfileData = (profile) => ({
  specialty: profile.specialty || '',
  experience: profile.experience || '',
  education: profile.education || '',
  bio: profile.bio || '',
  consultationFee: profile.consultationFee?.toString() || '',
  location: profile.location || { city: '', state: '' },
  availability: profile.availability || getDefaultProfileData().availability,
});

const DoctorProfile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(getDefaultProfileData());
  const [originalData, setOriginalData] = useState(null);

  // Always fetch fresh data when the component mounts
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (user?._id) {
          console.log('Fetching profile for doctor:', user._id);
          const profile = await doctorService.getProfile();
          console.log('Retrieved doctor profile:', profile);
          
          if (profile) {
            const formattedData = formatProfileData(profile);
            setProfileData(formattedData);
            setOriginalData(formattedData);
            
            // Store in sessionStorage for persistence between page navigations
            sessionStorage.setItem('doctorProfileData', JSON.stringify(formattedData));
          }
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error status:', err.response.status);
        }
        setError('Failed to load your profile. Please try again later.');
        
        // Try to load from sessionStorage as fallback
        const cachedProfile = sessionStorage.getItem('doctorProfileData');
        if (cachedProfile) {
          try {
            const parsedData = JSON.parse(cachedProfile);
            setProfileData(parsedData);
            setOriginalData(parsedData);
          } catch (parseError) {
            console.error('Error parsing cached profile:', parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if we have cached data first
    const cachedProfile = sessionStorage.getItem('doctorProfileData');
    if (cachedProfile) {
      try {
        const parsedData = JSON.parse(cachedProfile);
        setProfileData(parsedData);
        setOriginalData(parsedData);
        setLoading(false);
        
        // Still fetch fresh data in the background
        fetchDoctorProfile();
      } catch (parseError) {
        console.error('Error parsing cached profile:', parseError);
        fetchDoctorProfile();
      }
    } else {
      fetchDoctorProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setProfileData({
      ...profileData,
      availability: {
        ...profileData.availability,
        [day]: {
          ...profileData.availability[day],
          [field]: value,
        },
      },
    });
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (originalData) {
      setProfileData(originalData);
    }
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      // Prepare data for submission
      const submissionData = {
        ...profileData,
        consultationFee: parseFloat(profileData.consultationFee) || 0,
        // Ensure we have a location object with at least empty strings
        location: profileData.location || { city: '', state: '' }
      };

      console.log('Submitting doctor profile data:', submissionData);
      const result = await doctorService.updateProfile(submissionData);
      console.log('Update profile response:', result);
      
      // Update our stored data with the server response to ensure it's accurate
      if (result.profile) {
        const updatedProfile = result.profile;
        const formattedData = formatProfileData(updatedProfile);
        
        setProfileData(formattedData);
        setOriginalData(formattedData);
        
        // Update sessionStorage
        sessionStorage.setItem('doctorProfileData', JSON.stringify(formattedData));
      } else {
        // If no profile returned, use what we submitted as our new data
        setOriginalData({...profileData});
        sessionStorage.setItem('doctorProfileData', JSON.stringify(profileData));
      }
      
      setSuccess(true);
      setIsEditing(false);
      
      // Scroll to the top to show the success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      // Log more detailed error information
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        setError(err.response.data.message || 'Failed to update your profile. Please try again.');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection and try again.');
      } else {
        console.error('Error message:', err.message);
        setError('Failed to update your profile. Please try again.');
      }
      
      // Scroll to the top to show the error message
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Profile</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Display mode (profile view)
  if (!isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Edit Profile
          </button>
        </div>
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>Your profile has been successfully updated!</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Professional Information</h2>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700">Specialty</h3>
                <p className="text-gray-600">{profileData.specialty || 'Not specified'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700">Years of Experience</h3>
                <p className="text-gray-600">{profileData.experience || 'Not specified'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700">Education & Qualifications</h3>
                <p className="text-gray-600 whitespace-pre-line">{profileData.education || 'Not specified'}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700">Consultation Fee</h3>
                <p className="text-gray-600">{profileData.consultationFee ? `$${profileData.consultationFee}` : 'Not specified'}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Biography</h2>
              <p className="text-gray-600 whitespace-pre-line mb-6">{profileData.bio || 'No biography provided.'}</p>
              
              <h3 className="text-lg font-medium text-gray-700 mb-2">Location</h3>
              <p className="text-gray-600 mb-6">
                {profileData.location?.city && profileData.location?.state
                  ? `${profileData.location.city}, ${profileData.location.state}`
                  : 'Location not specified'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Weekly Availability</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(profileData.availability).map(([day, dayData]) => (
              <div key={day} className={`p-4 rounded-md ${dayData.available ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize text-gray-800">{day}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${dayData.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {dayData.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                {dayData.available && (
                  <p className="text-sm text-gray-600">
                    {dayData.start} - {dayData.end}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Edit mode (form)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={profileData.specialty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={profileData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Education & Qualifications
            </label>
            <textarea
              id="education"
              name="education"
              value={profileData.education}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Professional Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Fee ($)
            </label>
            <input
              type="number"
              id="consultationFee"
              name="consultationFee"
              value={profileData.consultationFee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profileData.location?.city || ''}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      location: {
                        ...profileData.location,
                        city: e.target.value
                      }
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={profileData.location?.state || ''}
                  onChange={(e) => {
                    setProfileData({
                      ...profileData,
                      location: {
                        ...profileData.location,
                        state: e.target.value
                      }
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(profileData.availability).map(([day, dayData]) => (
                <div key={day} className="border border-gray-300 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium capitalize">{day}</span>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={dayData.available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={dayData.start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!dayData.available}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={dayData.end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={!dayData.available}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile; 