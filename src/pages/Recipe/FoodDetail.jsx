import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { Clock, Users, Globe, ShoppingCart, Star, Package } from 'lucide-react';
import { getApiUrl, API_CONFIG } from '../../config/api';
const FoodDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [foodItem, setFoodItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.RECIPE(id)));
        setFoodItem(res.data);
      } catch (error) {
        console.error('Failed to fetch food item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading food item...</p>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-white" />
          </div>
          <p className="text-2xl font-bold text-red-500 mb-4">Food item not found</p>
          <p className="text-gray-600">The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            {foodItem.name}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="text-gray-600 ml-2">(4.8 rating)</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-white/20">
              <img
                src={foodItem.images?.[0] || 'https://placehold.co/400x300'}
                alt={foodItem.name}
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
              <div className="absolute top-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                Fresh & Hot
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <Package className="w-6 h-6 text-orange-500" />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {foodItem.description}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Prep Time</p>
                <p className="font-bold text-gray-800">{foodItem.prepTimeInMinutes} mins</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Servings</p>
                <p className="font-bold text-gray-800">{foodItem.servings}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-600">Cuisine</p>
                <p className="font-bold text-gray-800">{foodItem.cuisineType}</p>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600">Special Price</p>
                  <p className="text-4xl font-bold text-green-600">Rs {foodItem.price}</p>
                  <p className="text-sm text-gray-500 line-through">Rs {(foodItem.price * 1.2).toFixed(0)}</p>
                </div>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    20% OFF
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg flex items-center justify-center gap-3"
                onClick={() => addToCart(foodItem, 1)}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🚚 Free delivery on orders above Rs 500
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        {foodItem.ingredients?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Fresh Ingredients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItem.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {ingredient.product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;