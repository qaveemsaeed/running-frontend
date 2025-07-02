{/* Tailwind-style shortcut classes */}
<style jsx>{`
  .input {
    @apply w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400;
  }
  .btn {
    @apply bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600;
  }
`}</style>

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getApiUrl, API_CONFIG } from '../../config/api';
const ORDER_STATUSES = [
  'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
];

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Food Item State
  const [foodItem, setFoodItem] = useState({
    food_name: '',
    food_description: '',
    food_images: [''],
    food_recipe: '',
    prep_time_minutes: 0,
    servings: 1,
    cuisine_type: '',
    ingredients: [{ productName: '', ingredient_quantity: 0, ingredient_unit: '' }]
  });
  const [foodItems, setFoodItems] = useState([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState('');

  // Product State
  const [product, setProduct] = useState({
    product_title: '',
    product_description: '',
    product_price: 0,
    product_stock: 0,
    product_images: [''],
    category_id: 1,
    product_brand: ''
  });
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState({}); // { [orderId]: true/false }

  // Fetch all food items
  useEffect(() => {
    if (activeTab !== 'foodList') return;
    setFoodLoading(true);
    setFoodError('');
    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.HOME))
      .then(res => setFoodItems(res.data || []))
      .catch(() => setFoodError('Failed to fetch food items.'))
      .finally(() => setFoodLoading(false));
  }, [activeTab]);

  // Fetch all products
  useEffect(() => {
    if (activeTab !== 'productList') return;
    setProductLoading(true);
    setProductError('');
    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_PRODUCTS))
      .then(res => setProducts(res.data || []))
      .catch(() => setProductError('Failed to fetch products.'))
      .finally(() => setProductLoading(false));
  }, [activeTab]);

  // Fetch all orders
  useEffect(() => {
    if (activeTab !== 'orders') return;
    setOrdersLoading(true);
    setOrdersError('');
    axios.get(getApiUrl(API_CONFIG.ENDPOINTS.ORDERS))
      .then(res => setOrders(res.data || []))
      .catch(() => setOrdersError('Failed to fetch orders.'))
      .finally(() => setOrdersLoading(false));
  }, [activeTab]);

  // Food Item CRUD
  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_CREATE_FOOD), foodItem);
      alert('Food item created successfully');
      setFoodItem({
        food_name: '', food_description: '', food_images: [''], food_recipe: '', prep_time_minutes: 0, servings: 1, cuisine_type: '', ingredients: [{ productName: '', ingredient_quantity: 0, ingredient_unit: '' }]
      });
      if (activeTab === 'foodList') setActiveTab('foodList'); // refresh list
    } catch (err) {
      alert('Failed to create food item');
    }
  };
  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_DELETE_FOOD(id)));
      setFoodItems(items => items.filter(f => f.id !== id));
    } catch {
      alert('Failed to delete food item');
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_CREATE_PRODUCT), product);
      alert('Product created successfully');
      setProduct({ product_title: '', product_description: '', product_price: 0, product_stock: 0, product_images: [''], category_id: 1, product_brand: '' });
      if (activeTab === 'productList') setActiveTab('productList'); // refresh list
    } catch (err) {
      alert('Failed to create product');
    }
  };
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.ADMIN_DELETE_PRODUCT(id)));
      setProducts(items => items.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  // Orders
  const handleCancelOrder = async (orderId) => {
    setUpdatingOrder(prev => ({ ...prev, [orderId]: true }));
    try {
      await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ORDER_CANCEL(orderId)));
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch {
      alert('Failed to cancel order');
    } finally {
      setUpdatingOrder(prev => ({ ...prev, [orderId]: false }));
    }
  };
  const handleStatusChange = async (orderId, status) => {
    setUpdatingOrder(prev => ({ ...prev, [orderId]: true }));
    try {
      await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ORDER_STATUS(orderId)), { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrder(prev => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">Admin Dashboard</h2>
          <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
        </div>
        <div className="flex space-x-4 mb-4">
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Orders</button>
          <button onClick={() => setActiveTab('food')} className={`px-4 py-2 rounded ${activeTab === 'food' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Create Food Item</button>
          <button onClick={() => setActiveTab('foodList')} className={`px-4 py-2 rounded ${activeTab === 'foodList' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Food Items</button>
          <button onClick={() => setActiveTab('product')} className={`px-4 py-2 rounded ${activeTab === 'product' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Create Product</button>
          <button onClick={() => setActiveTab('productList')} className={`px-4 py-2 rounded ${activeTab === 'productList' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Products</button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h3 className="text-xl font-bold mb-4">All Orders</h3>
            {ordersLoading ? <div>Loading orders...</div> : ordersError ? <div className="text-red-500">{ordersError}</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Order ID</th>
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-t">
                        <td className="px-4 py-2">{order.id}</td>
                        <td className="px-4 py-2">{order.user?.fullName || order.user?.email || 'N/A'}</td>
                        <td className="px-4 py-2 capitalize">{order.status}</td>
                        <td className="px-4 py-2">Rs. {order.totalAmount}</td>
                        <td className="px-4 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                        <td className="px-4 py-2 space-x-2">
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <>
                              <select
                                value={order.status}
                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                disabled={!!updatingOrder[order.id]}
                                className="border rounded px-2 py-1 text-sm"
                              >
                                {ORDER_STATUSES.filter(s => s !== 'cancelled' && s !== 'delivered').map(status => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={!!updatingOrder[order.id]}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                              >
                                {updatingOrder[order.id] ? 'Cancelling...' : 'Cancel'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Food Item Tab */}
        {activeTab === 'food' && (
          <form onSubmit={handleFoodSubmit} className="space-y-4">
            <input type="text" placeholder="Food Name" value={foodItem.food_name}
              onChange={(e) => setFoodItem({ ...foodItem, food_name: e.target.value })}
              className="input" />
            <textarea placeholder="Description" value={foodItem.food_description}
              onChange={(e) => setFoodItem({ ...foodItem, food_description: e.target.value })}
              className="input" />
            <input type="text" placeholder="Recipe Steps" value={foodItem.food_recipe}
              onChange={(e) => setFoodItem({ ...foodItem, food_recipe: e.target.value })}
              className="input" />
            <input type="text" placeholder="Cuisine Type" value={foodItem.cuisine_type}
              onChange={(e) => setFoodItem({ ...foodItem, cuisine_type: e.target.value })}
              className="input" />
            <input type="number" placeholder="Prep Time (minutes)" value={foodItem.prep_time_minutes}
              onChange={(e) => setFoodItem({ ...foodItem, prep_time_minutes: Number(e.target.value) })}
              className="input" />
            <input type="number" placeholder="Servings" value={foodItem.servings}
              onChange={(e) => setFoodItem({ ...foodItem, servings: Number(e.target.value) })}
              className="input" />
            <input type="text" placeholder="Image URL"
              value={foodItem.food_images[0]}
              onChange={(e) => setFoodItem({ ...foodItem, food_images: [e.target.value] })}
              className="input" />
            <h4 className="font-medium">Ingredients</h4>
            {foodItem.ingredients.map((ing, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Product Name"
                  value={ing.productName}
                  onChange={(e) => {
                    const newIngredients = [...foodItem.ingredients];
                    newIngredients[idx].productName = e.target.value;
                    setFoodItem({ ...foodItem, ingredients: newIngredients });
                  }}
                  className="input"
                />
                <input type="number" placeholder="Qty" value={ing.ingredient_quantity}
                  onChange={(e) => {
                    const newIngredients = [...foodItem.ingredients];
                    newIngredients[idx].ingredient_quantity = Number(e.target.value);
                    setFoodItem({ ...foodItem, ingredients: newIngredients });
                  }}
                  className="input"
                />
                <input type="text" placeholder="Unit" value={ing.ingredient_unit}
                  onChange={(e) => {
                    const newIngredients = [...foodItem.ingredients];
                    newIngredients[idx].ingredient_unit = e.target.value;
                    setFoodItem({ ...foodItem, ingredients: newIngredients });
                  }}
                  className="input"
                />
              </div>
            ))}
            <button type="submit" className="btn">Create Food Item</button>
          </form>
        )}

        {/* Food Items Tab */}
        {activeTab === 'foodList' && (
          <div>
            <h3 className="text-xl font-bold mb-4">All Food Items</h3>
            {foodLoading ? <div>Loading food items...</div> : foodError ? <div className="text-red-500">{foodError}</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.id}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">Rs. {item.price}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleDeleteFood(item.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create Product Tab */}
        {activeTab === 'product' && (
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <input type="text" placeholder="Title" value={product.product_title}
              onChange={(e) => setProduct({ ...product, product_title: e.target.value })}
              className="input" />
            <textarea placeholder="Description" value={product.product_description}
              onChange={(e) => setProduct({ ...product, product_description: e.target.value })}
              className="input" />
            <input type="number" placeholder="Price" value={product.product_price}
              onChange={(e) => setProduct({ ...product, product_price: Number(e.target.value) })}
              className="input" />
            <input type="number" placeholder="Stock" value={product.product_stock}
              onChange={(e) => setProduct({ ...product, product_stock: Number(e.target.value) })}
              className="input" />
            <input type="text" placeholder="Image URL"
              value={product.product_images[0]}
              onChange={(e) => setProduct({ ...product, product_images: [e.target.value] })}
              className="input" />
            <input type="number" placeholder="Category ID" value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: Number(e.target.value) })}
              className="input" />
            <input type="text" placeholder="Brand" value={product.product_brand}
              onChange={(e) => setProduct({ ...product, product_brand: e.target.value })}
              className="input" />
            <button type="submit" className="btn">Create Product</button>
          </form>
        )}

        {/* Products Tab */}
        {activeTab === 'productList' && (
          <div>
            <h3 className="text-xl font-bold mb-4">All Products</h3>
            {productLoading ? <div>Loading products...</div> : productError ? <div className="text-red-500">{productError}</div> : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">ID</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Stock</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(item => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.id}</td>
                        <td className="px-4 py-2">{item.title}</td>
                        <td className="px-4 py-2">Rs. {item.price}</td>
                        <td className="px-4 py-2">{item.stock}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => handleDeleteProduct(item.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
