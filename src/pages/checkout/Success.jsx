import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const [showAnimation, setShowAnimation] = useState(false);
  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId;

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className={`text-center mb-8 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Celebration rings */}
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-2 border-green-300 rounded-full animate-ping animation-delay-300"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Order Placed Successfully! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Thank you for choosing us!
          </p>
          <p className="text-gray-500">
            Your delicious meal is being prepared with care
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details Card */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 delay-300 ${showAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            </div>

            <div className="space-y-4">
              {orderId && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-400">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-bold text-lg text-gray-800">#{orderId}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-l-4 border-green-400">
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cash on Delivery
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-l-4 border-orange-400">
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="font-semibold text-gray-800 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  30-45 minutes
                </p>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-600 font-medium">Order Confirmed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-500">Preparing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-500">Out for Delivery</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-500">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className={`bg-white rounded-2xl shadow-xl p-8 transition-all duration-1000 delay-500 ${showAnimation ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">What's Next?</h2>
            </div>

            <div className="space-y-6">
              {/* Notification Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 12h16m-7-7l7 7-7 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Track Your Order</h3>
                    <p className="text-sm text-gray-600">
                      We'll send you real-time updates about your order status via SMS and email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Link
                  to="/orders"
                  className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View My Orders</span>
                </Link>

                <Link
                  to="/"
                  className="block w-full border-2 border-orange-400 text-orange-600 py-4 px-6 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Need Help?</p>
                    <p className="text-xs text-gray-600">Contact our support team anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Thank You for Your Order!</h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're excited to prepare your delicious meal. Your support means the world to us, and we can't wait to serve you again!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default Success;