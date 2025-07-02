import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaEye, FaStar } from 'react-icons/fa';
import SearchField from '../../components/SearchField';
import RecipeCard from '../../components/RecipeCard';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, API_CONFIG } from '../../config/api';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.HOME));
      setRecipes(response.data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError(err.response?.data?.message || 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  const handleAddToCart = (e, recipe) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.id) {
      // Modern toast notification instead of alert
      showNotification('Please login to add items to cart.', 'warning');
      return;
    }
    
    addToCart(recipe);
    showNotification(`${recipe.name} added to cart!`, 'success');
  };

  const toggleFavorite = (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.id) {
      showNotification('Please login to save favorites.', 'warning');
      return;
    }
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
        showNotification('Removed from favorites', 'info');
      } else {
        newFavorites.add(recipeId);
        showNotification('Added to favorites!', 'success');
      }
      return newFavorites;
    });
  };

  const showNotification = (message, type) => {
    // Simple notification system - you can replace with a proper toast library
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'warning' ? 'bg-yellow-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-red-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading delicious recipes...</p>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchRecipes}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-4xl">🍽️</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
      <p className="text-gray-500">Try adjusting your search or check back later!</p>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 pt-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Amazing
              <span className="block bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Recipes
              </span>
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Explore thousands of delicious recipes from around the world
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 -right-20 w-60 h-60 bg-yellow-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-red-400/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchField />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {recipes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Featured Recipes
                </h2>
                <p className="text-gray-600">
                  {recipes.length} delicious recipe{recipes.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Sort by
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Filter
                </button>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <Link to={`/recipe/${recipe.id}`} className="block">
                    {/* Recipe Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={recipe.image || '/api/placeholder/300/225'}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Favorite button */}
                      <button
                        onClick={(e) => toggleFavorite(e, recipe.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <FaHeart 
                          className={`w-4 h-4 ${
                            favorites.has(recipe.id) ? 'text-red-500' : 'text-gray-400'
                          }`} 
                        />
                      </button>

                      {/* Quick view button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRecipeClick(recipe);
                        }}
                        className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <FaEye className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Recipe Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                          {recipe.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-400 ml-2">
                          <FaStar className="w-3 h-3" />
                          <span className="text-xs text-gray-600">4.5</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-2xl font-bold text-orange-600">
                            Rs{recipe.price}
                          </span>
                          <span className="text-xs text-gray-500">per serving</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">⏱️ 30 min</span>
                          <span className="text-xs text-gray-500">👥 4 servings</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Add to Cart Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={(e) => handleAddToCart(e, recipe)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      <span className="text-sm font-medium">Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;