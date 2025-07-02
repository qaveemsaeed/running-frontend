import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Utensils, Clock } from 'lucide-react';
import { getApiUrl, API_CONFIG } from '../config/api';

const SearchField = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        axios
          .get(`${getApiUrl(API_CONFIG.ENDPOINTS.SEARCH)}?q=${encodeURIComponent(query)}`)
          .then((res) => {
            setResults(res.data || []);
            setShowResults(true);
          })
          .catch(() => {
            setResults([]);
            setShowResults(false);
          });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col items-center pt-10 mx-2 relative z-50">
      {/* Search Container */}
      <div className="flex w-full max-w-2xl items-center space-x-2 relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search food items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && results.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="relative w-full bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-2xl font-medium text-gray-800 placeholder-gray-500 transition-all duration-300"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg" />
        </div>

        {/* Search Button */}
        <button
          className="relative bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative">
            <FaSearch />
          </div>
        </button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-4 w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 max-h-64 overflow-hidden transition-all duration-300 animate-in slide-in-from-top-4">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{results.length} delicious options found</span>
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-52 overflow-y-auto">
            {results.map((item, index) => (
              <Link
                to={`/recipe/${item.id || item._id}`}
                key={item.id || item._id}
                className="group block px-6 py-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 border-b border-gray-50 last:border-b-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors duration-200">
                    <Utensils className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors duration-200">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-1 group-hover:text-gray-700 transition-colors duration-200">
                      {item.description}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Available now</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <FaSearch className="text-orange-600 text-sm" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .max-h-52::-webkit-scrollbar {
          width: 6px;
        }
        .max-h-52::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .max-h-52::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #ef4444);
          border-radius: 10px;
        }
        .max-h-52::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #dc2626);
        }
        @keyframes slide-in-from-top-4 {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in-from-top-4 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchField;