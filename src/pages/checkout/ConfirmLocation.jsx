import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../context/CheckoutContext';

const ConfirmLocation = () => {
  const navigate = useNavigate();
  const { address, confirmLocation } = useCheckout();

  if (!address) {
    navigate('/checkout/address');
    return null;
  }

  const handleConfirm = () => {
    confirmLocation();
    navigate('/checkout/payment');
  };

  const handleEdit = () => {
    navigate('/checkout/address');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Confirm Delivery Location</h1>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-2">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>Phone: {address.phone}</p>
            </div>
          </div>

          {/* Map placeholder - you can integrate with Google Maps or other map service */}
          <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-600">Map View</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEdit}
              className="flex-1 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Edit Address
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLocation; 