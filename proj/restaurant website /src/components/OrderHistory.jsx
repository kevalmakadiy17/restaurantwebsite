import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Check, AlertCircle } from 'lucide-react';

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/user/${userId}`);
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Order History</h2>
      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">No orders yet</p>
          <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div 
              key={order._id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Order #{order._id.slice(-6)}
                      {order.status === 'completed' && 
                        <span className="ml-2 text-green-500 text-sm">✓ Completed</span>
                      }
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Table #{order.tableNumber}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span>Points Earned</span>
                    <span className="text-green-600">+{order.pointsEarned || 0}</span>
                  </div>
                  {order.pointsUsed > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Points Used</span>
                      <span className="text-orange-600">-{order.pointsUsed}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;