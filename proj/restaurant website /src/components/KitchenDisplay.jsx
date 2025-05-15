import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export const KitchenDisplay = ({ orders, onUpdateStatus }) => {
  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {activeOrders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Order #{order.orderNumber}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between items-center">
                <span>{item.quantity}x {item.menuItem.name}</span>
                {item.specialInstructions && (
                  <span className="text-sm text-gray-500 italic">
                    Note: {item.specialInstructions}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
              </div>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            
            {getNextStatus(order.status) && (
              <button
                onClick={() => onUpdateStatus(order.id, getNextStatus(order.status))}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Mark as {getNextStatus(order.status)}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};