import { useState } from 'react';
import './App.css';

import Home from './pages/home/Home';
import Recipe from './pages/Recipe/recipe';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import RecipeDetail from './pages/Recipe/RecipeDetail';
import Cart from './pages/cart/Cart';
import AddressVerification from './pages/checkout/AddressVerification';
import ConfirmLocation from './pages/checkout/ConfirmLocation';
import Payment from './pages/checkout/Payment';
import Success from './pages/checkout/Success';
import Navbar from './components/Navbar';
import Profile from './pages/profile/Profile';
import AdminPage from './pages/admin/Admin';
import Orders from './pages/profile/Orders';
import FoodDetail from './pages/Recipe/FoodDetail'; // ✅ Import this component

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutProvider>
          <Router>
            <Navbar />
            <div className="pt-[72px]">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="recipe" element={<Recipe />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="profile" element={<Profile />} />
                <Route path="recipe/:id" element={<RecipeDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout/address" element={<AddressVerification />} />
                <Route path="checkout/payment" element={<Payment />} />
                <Route path="checkout/success" element={<Success />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/orders" element={<Orders />} />
                
                {/* ✅ New Route for Food Item from Search */}
                <Route path="food/:id" element={<FoodDetail />} />
              </Routes>
            </div>
          </Router>
        </CheckoutProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
