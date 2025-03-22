import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/api';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    specialty: '',
    experience: '',
    education: '',
    bio: '',
    consultationFee: '',
    availability: {
      monday: { available: false, start: '09:00', end: '17:00' },
      tuesday: { available: false, start: '09:00', end: '17:00' },
      wednesday: { available: false, start: '09:00', end: '17:00' },
      thursday: { available: false, start: '09:00', end: '17:00' },
      friday: { available: false, start: '09:00', end: '17:00' },
      saturday: { available: false, start: '09:00', end: '17:00' },
      sunday: { available: false, start: '09:00', end: '17:00' },
    },
  });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        // Assuming user._id contains the doctor's ID
        if (user?._id) {
          const profile = await doctorService.getProfile();
          if (profile) {
            setProfileData(prevData => ({
              ...prevData,
              ...profile,
              consultationFee: profile.consultationFee?.toString() || '',
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      // Prepare data for submission
      const submissionData = {
        ...profileData,
        consultationFee: parseFloat(profileData.consultationFee),
      };

      await doctorService.updateProfile(submissionData);
      setSuccess(true);
      
      // Scroll to the top to show the success message
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError('Failed to update your profile. Please try again.');
      
      // Scroll to the top to show the error message
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Management</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Management</h1>
      
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

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfile; 