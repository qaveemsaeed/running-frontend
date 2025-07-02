import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Clock, 
  Users, 
  Globe, 
  ShoppingCart, 
  Star, 
  ChefHat, 
  Heart, 
  Share2, 
  BookOpen,
  Package,
  CheckCircle,
  ArrowLeft,
  Timer,
  Utensils
} from 'lucide-react';
import { getApiUrl, API_CONFIG } from '../../config/api';
const RecipeDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedRecipe = location.state?.recipe;

  const [foodItem, setFoodItem] = useState(passedRecipe || null);
  const [loading, setLoading] = useState(!passedRecipe);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  const isInCart = foodItem && cart.some(item => item.id === foodItem.id);

  useEffect(() => {
    if (foodItem) return;

    const fetchFoodItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.HOME));
        const foundItem = response.data.find(item => item.id === id);
        if (foundItem) {
          setFoodItem(foundItem);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError('Failed to fetch food item. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  const handleAddToCart = async () => {
    addToCart(foodItem);
    if (user && user.id) {
      try {
        const payload = {
          foodItemId: foodItem.id,
          quantity: 1,
        };
        await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.CART(user.id)), payload);
      } catch (err) {
        console.error('Failed to add to cart on backend:', err);
      }
    }
  };

  const toggleStepCompletion = (stepIndex) => {
    const newCompletedSteps = new Set(completedSteps);
    if (newCompletedSteps.has(stepIndex)) {
      newCompletedSteps.delete(stepIndex);
    } else {
      newCompletedSteps.add(stepIndex);
    }
    setCompletedSteps(newCompletedSteps);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-gray-700 text-xl font-medium">Loading your recipe...</p>
          <div className="mt-4 flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-800 text-xl">!</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-red-500 mb-4">Recipe Not Available</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">{error}</p>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold">
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <ChefHat className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 text-xl">Recipe not found.</p>
        </div>
      </div>
    );
  }

  const recipeSteps = foodItem.recipe ? foodItem.recipe.split('\n').filter(step => step.trim()) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mb-8">
            <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 font-medium">
              <ArrowLeft className="w-5 h-5" />
              Back to Recipes
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            
            {/* Recipe Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
                  {foodItem.name}
                </h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">(4.8 • 156 reviews)</span>
                  <div className="h-5 w-px bg-gray-300"></div>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <ChefHat className="w-4 h-4" />
                    Chef's Recipe
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {foodItem.description}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Prep Time</p>
                      <p className="text-lg font-bold text-gray-800">{foodItem.prepTimeInMinutes} min</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Servings</p>
                      <p className="text-lg font-bold text-gray-800">{foodItem.servings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Cuisine</p>
                      <p className="text-lg font-bold text-gray-800">{foodItem.cuisineType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Utensils className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Cook?</h3>
                  <p className="text-gray-600 text-sm">Add ingredients to your cart</p>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`w-full px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 ${
                    isInCart
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 shadow-xl'
                  }`}
                >
                  {isInCart ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Already in Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add Ingredients to Cart
                    </>
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>🛒 Get all ingredients delivered fresh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          {Array.isArray(foodItem.images) && foodItem.images.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                Recipe Gallery
              </h2>
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {foodItem.images.map((img, idx) => (
                    <div key={idx} className="relative group overflow-hidden rounded-2xl">
                      <img
                        src={img}
                        alt={`${foodItem.name} step ${idx + 1}`}
                        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-4 left-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Step {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ingredients Section */}
          {foodItem.ingredients && foodItem.ingredients.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                Fresh Ingredients
              </h2>
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foodItem.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          <span className="font-bold text-green-700">{ingredient.quantity} {ingredient.unit}</span>
                          {' '}{ingredient.product?.title || ingredient.product?.name || 'Premium ingredient'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recipe Instructions */}
          {foodItem.recipe && recipeSteps.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                Cooking Instructions
              </h2>
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/30">
                <div className="space-y-4">
                  {recipeSteps.map((step, idx) => {
                    const isCompleted = completedSteps.has(idx);
                    const cleanStep = step.replace(/^\d+\.\s*/, '');
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200 shadow-sm' 
                            : 'bg-gray-50 border-gray-200 hover:border-orange-200 hover:shadow-md'
                        }`}
                        onClick={() => toggleStepCompletion(idx)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600 fill-current" />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-lg leading-relaxed ${
                            isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                          }`}>
                            {cleanStep}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Timer className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-sm">
                    💡 Tip: Click on each step to mark it as completed
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Progress: {completedSteps.size} of {recipeSteps.length} steps completed
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;