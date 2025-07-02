import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSignOutAlt, FaHome, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  // Calculate total items in cart
  const cartCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-red-600 transition-all duration-300"
            >
              Recipe Basket
            </Link>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            {/* Home Icon */}
            <Link 
              to="/" 
              className="group relative p-2 text-gray-600 hover:text-orange-500 transition-all duration-300 rounded-full hover:bg-orange-50"
              title="Home"
            >
              <FaHome className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Home
              </span>
            </Link>

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="group relative p-2 text-gray-600 hover:text-orange-500 transition-all duration-300 rounded-full hover:bg-orange-50"
              title="Shopping Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse min-w-[1.25rem] text-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Cart
              </span>
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-500 transition-all duration-300 rounded-full hover:bg-orange-50 group"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="true"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-orange-300 transition-colors duration-300"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="hidden sm:flex items-center space-x-1">
                    <span className="font-medium text-sm">
                      {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                    </span>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || 'user@example.com'}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        <FaUser className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={closeMenu}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/cart"
                        onClick={closeMenu}
                        className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <FaShoppingCart className="w-4 h-4" />
                          <span>Cart</span>
                        </div>
                        {cartCount > 0 && (
                          <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest User Actions */
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;