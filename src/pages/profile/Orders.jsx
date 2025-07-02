import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getApiUrl, API_CONFIG } from '../../config/api';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState({}); // { [orderId]: true/false }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.USER_ORDERS(user.id)));
        setOrders(response.data || []);
      } catch (err) {
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    setCancelling(prev => ({ ...prev, [orderId]: true }));
    setError('');
    try {
      await axios.put(getApiUrl(API_CONFIG.ENDPOINTS.ORDER_CANCEL(orderId)));
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'CANCELLED' } : order
      ));
    } catch (err) {
      setError('Failed to cancel order.');
    } finally {
      setCancelling(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (!user?.id) {
    return <div className="text-center py-12">Please log in to view your orders.</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

  if (!orders.length) {
    return <div className="text-center py-12 text-gray-600">You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-orange-600">My Orders</h1>
      <div className="space-y-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <div>
                <div className="text-lg font-semibold text-gray-800">Order #{order.id}</div>
               
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={!!cancelling[order.id]}
                    className="ml-2 px-3 py-1 text-xs font-semibold rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 transition-all"
                  >
                    {cancelling[order.id] ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
            <div className="mb-2 text-gray-700 font-medium">Total: Rs. {order.totalAmount}</div>
            <div className="mb-2 text-gray-600">Delivery Address: {order.deliveryAddress}</div>
         
            <div className="mt-4">
              <div className="font-semibold mb-2">Items:</div>
              <ul className="space-y-2">
                {order.orderItems && order.orderItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-50 rounded p-2">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>Rs. {item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 