import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import loginpic from '../../assets/auth.png'; // Make sure this path is correct
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, API_CONFIG } from '../../config/api';
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      const response = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), data);
      console.log("Full login response:", response.data);
      login(response.data);
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left image section */}
      <div className="hidden md:block md:w-1/2">
        <img src={loginpic} alt="Cover" className="w-full h-screen object-cover object-center" />
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-gray-50">
        {/* Top-left Recipe Basket */}
        <div className="absolute top-6 left-6 text-2xl font-semibold text-orange-500">
          Recipe Basket
        </div>

        {/* Centered login form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-[400px]">
            <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">Login</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  placeholder="Enter your email"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="flex flex-col space-y-1 relative">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { 
                    required: "Password is required"
                  })}
                  placeholder="Enter your password"
                  className="border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <div
                  className="absolute right-3 top-[60%] transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.password && (
                  <span className="text-red-500 text-xs">{errors.password.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2.5 rounded-lg transition"
              >
                Login
              </button>

              {/* Signup link */}
              <p className="text-center text-gray-600 mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-500 hover:text-orange-600">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
