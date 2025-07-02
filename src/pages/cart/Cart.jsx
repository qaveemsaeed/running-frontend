import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});

  const handleCheckout = () => {
    if (!user || !user.id) {
      alert('You must be logged in to proceed to checkout.');
      navigate('/login');
      return;
    }
    navigate('/checkout/address');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-orange-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl shadow-xl">
            <div className="w-24 h-24 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Start adding some delicious recipes!</p>
            <Link
              to="/"
              className="bg-orange-500 text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const calculateItemSubtotal = (item) => {
    const food = item.foodItem || {};
    const ingredientTotal =
      food.ingredients?.reduce((sum, ing) => {
        const rawPrice = ing.product?.price || '0';
        const priceNumber = parseFloat(rawPrice.toString().split(' ')[0]);
        return sum + priceNumber ;
      }, 0) || 0;
    return ingredientTotal * item.quantity;
  };

  const totalCartPrice = cart.reduce((total, item) => {
    return total + calculateItemSubtotal(item);
  }, 0);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-orange-600">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Your Items</h2>
              <button
                onClick={clearCart}
                className="text-red-500 hover:underline flex items-center gap-2"
              >
                <Trash2 size={16} />
                Clear Cart
              </button>
            </div>

            {cart.map((item) => {
              const food = item.foodItem || {};
              const image = food.images?.[0] || 'https://placehold.co/96x96?text=No+Image';
              const name = food.name || 'Unknown Item';
              const subtotal = calculateItemSubtotal(item);
              const isExpanded = expandedItems[item.id];

              return (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl shadow-lg border border-orange-100"
                >
                  <div className="flex gap-4">
                    <img
                      src={image}
                      alt={name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{name}</h3>
                      <p className="text-green-600 font-medium mb-3">
                        Rs {subtotal / item.quantity}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200 disabled:opacity-50"
                          >
                            <Minus size={16} className="mx-auto text-orange-600" />
                          </button>
                          <span className="text-gray-800 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-orange-100 hover:bg-orange-200"
                          >
                            <Plus size={16} className="mx-auto text-orange-600" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-lg font-bold text-gray-800">Rs {subtotal}</p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedItems((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="mt-4 text-sm text-orange-600 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={16} /> Hide Ingredients
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} /> Show Ingredients
                          </>
                        )}
                      </button>

                      {isExpanded && food.ingredients?.length > 0 && (
                        <div className="mt-4 space-y-2 border-t pt-4">
                          {food.ingredients.map((ingredient, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                            >
                              <span className="text-gray-700">
                                {ingredient.product?.title || 'Unknown Product'} -{' '}
                                {ingredient.quantity} {ingredient.unit}
                              </span>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="text-red-500"
                                  onChange={() =>
                                    console.log(
                                      `Marking ingredient ${ingredient.id} for removal`
                                    )
                                  }
                                />
                                <span className="text-sm text-gray-500">Remove</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <div className="bg-white p-6 rounded-xl shadow-xl border border-orange-100 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Price</span>
                  <span className="text-green-600">Rs {totalCartPrice}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                Proceed to Checkout
              </button>
              <p className="text-xs text-center mt-3 text-gray-400">🔒 Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
