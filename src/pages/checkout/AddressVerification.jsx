import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_CONFIG } from '../../config/api';
const AddressVerification = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    address: '',
    phNumber: '',
    city: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user has existing address data and populate form
  useEffect(() => {
    if (user?.address && user?.phNumber && user?.city) {
      setForm({
        address: user.address,
        phNumber: user.phNumber,
        city: user.city
      });
      setHasExistingData(true);
      setIsEditing(false); // Start in view mode if data exists
    } else {
      setIsEditing(true); // Start in edit mode if no data
    }
  }, [user?.address, user?.phNumber, user?.city, user?.id]);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    // Reset form to original user data
    setForm({
      address: user.address || '',
      phNumber: user.phNumber || '',
      city: user.city || ''
    });
    setIsEditing(false);
    setError('');
  };

  const validateForm = () => {
    if (!form.address.trim()) return 'Address is required';
    if (!form.phNumber.trim()) return 'Phone number is required';
    if (!form.city.trim()) return 'City is required';
    
    // Basic phone validation
    const phoneRegex = /^\d{10,15}$/;
    const cleanPhone = form.phNumber.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError("User not logged in.");
      return;
    }

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        address: form.address.trim(),
        city: form.city.trim(),
        phNumber: form.phNumber.trim(),
      };

      // Make API call to save address
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.USER_DATA + `/${user.id}`), 
        payload,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Address saved successfully:', response.data);

      // Update AuthContext with new address data
      updateUser({ ...user, ...payload });
      
      setIsEditing(false);
      setHasExistingData(true);
      
      // Show success message briefly before navigation
      setTimeout(() => {
        navigate('/checkout/payment');
      }, 500);
      
    } catch (err) {
      console.error('Error saving address:', err);
      
      // Handle different error types
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to save address. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndContinue = () => {
    // User confirms existing address, navigate directly
    console.log('User confirmed existing address');
    navigate('/checkout/payment');
  };

  const isFormValid = form.address.trim() && form.phNumber.trim() && form.city.trim();

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
        {hasExistingData && !isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Display Mode */}
      {hasExistingData && !isEditing && (
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-700 mb-3">Current Address:</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Address:</strong> {form.address}</p>
              <p><strong>Phone:</strong> {form.phNumber}</p>
              <p><strong>City:</strong> {form.city}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleConfirmAndContinue}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              ✓ Confirm & Continue
            </button>
            <button
              onClick={handleEdit}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Enter your street address"
              value={form.address}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="phNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              id="phNumber"
              type="tel"
              name="phNumber"
              placeholder="Enter your phone number"
              value={form.phNumber}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10-15 digits</p>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              id="city"
              type="text"
              name="city"
              placeholder="Enter your city"
              value={form.city}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                hasExistingData ? 'Update Address' : 'Save Address'
              )}
            </button>
            
            {hasExistingData && (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Status indicator */}
      {hasExistingData && !error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
          ✓ Address information saved
        </div>
      )}
    </div>
  );
};

export default AddressVerification;