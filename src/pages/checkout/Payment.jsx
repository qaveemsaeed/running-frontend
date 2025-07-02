import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getApiUrl, API_CONFIG } from '../../config/api';
const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.address || !user?.city) {
      navigate('/checkout/address');
    }
  }, [user, navigate]);

  if (!user?.address || !user?.city) return null;

  const createOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare order data according to your CreateOrderDto structure
      const createOrderDto = {
        orderItems: cart.map(item => ({
          foodItemId: item.foodItem?.id || item.id,
          quantity: item.quantity,
          price: item.foodItem?.price || item.price,
          name: item.foodItem?.name || item.name
        })),
        deliveryAddress: `${user.address}, ${user.city}`,
        specialInstructions: '',
        totalAmount: totalPrice,
        totalItems: totalItems,
        paymentMethod: 'CASH_ON_DELIVERY',
        phoneNumber: user.phNumber,
        status: 'PENDING',
        orderDate: new Date().toISOString()
      };

      console.log('Creating order for user:', user.id);
      console.log('Order data:', createOrderDto);

      // Make API call using the correct endpoint structure
      const response = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.CREATE_ORDER(user.id)),
        createOrderDto,
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Order created successfully:', response.data);

      // Clear cart after successful order creation
      clearCart();

      // Navigate to success page with order details
      navigate('/checkout/success', { 
        state: { 
          orderId: response.data.orderId || response.data.id,
          orderData: response.data 
        } 
      });

    } catch (err) {
      console.error('Error creating order:', err);
      
      // Handle different error types
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid order data. Please check your cart items and delivery information.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 404) {
        setError('Order service not found. Please contact support.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate cart before proceeding
    if (!cart || cart.length === 0) {
      setError('Your cart is empty. Please add items before proceeding.');
      return;
    }

    // Validate user data
    if (!user?.id) {
      setError('User authentication required. Please log in.');
      return;
    }

    // Validate required user address information
    if (!user?.address || !user?.city) {
      setError('Delivery address is required. Please update your address.');
      navigate('/checkout/address');
      return;
    }

    await createOrder();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.foodItem?.price || item.price || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Order</h1>
          <p className="text-gray-600">Review your order details and confirm payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Order Summary
                </h2>
              </div>

              {/* Items List */}
              <div className="p-6">
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-l-4 border-orange-400">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.foodItem?.name || item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-800">Rs. {((item.foodItem?.price || item.price || 0) * item.quantity).toFixed(0)}</p>
                        <p className="text-sm text-gray-500">Rs. {(item.foodItem?.price || item.price || 0).toFixed(0)} each</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Items:</span>
                      <span className="font-semibold">{totalItems} items</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">Rs. {totalPrice.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-800">
                        <span>Total Amount:</span>
                        <span className="text-orange-600">Rs. {totalPrice.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Info - Right Side */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-semibold text-gray-800">{user.address}</p>
                <p className="text-gray-600">{user.city}</p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Phone:</span> {user.phNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Payment Method
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cash on Delivery</h4>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Place Order</span>
                </>
              )}
            </button>

            {/* Order Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-blue-800">Order Information</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Your order will be prepared fresh and delivered within 30-45 minutes. You can track your order status after confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;