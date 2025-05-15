import React, { useState } from 'react';
import { menuItems } from '../data/menuItems';
import { Plus, Minus, Trash2, UtensilsCrossed } from 'lucide-react';

export const OrderForm = ({ onSubmitOrder, lastOrderNumber }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState({});

  const addToOrder = (menuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { 
        menuItem, 
        quantity: 1,
        specialInstructions: specialInstructions[menuItem.id] || ''
      }]);
    }
  };

  const removeFromOrder = (menuItem) => {
    const existingItem = orderItems.find(item => item.menuItem.id === menuItem.id);
    if (existingItem?.quantity === 1) {
      setOrderItems(orderItems.filter(item => item.menuItem.id !== menuItem.id));
    } else if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.menuItem.id === menuItem.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    }
  };

  const updateSpecialInstructions = (menuItemId, instructions) => {
    setSpecialInstructions(prev => ({
      ...prev,
      [menuItemId]: instructions
    }));
    
    setOrderItems(orderItems.map(item =>
      item.menuItem.id === menuItemId
        ? { ...item, specialInstructions: instructions }
        : item
    ));
  };

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleSubmitOrder = () => {
    if (orderItems.length === 0) return;

    const newOrder = {
      items: orderItems,
      status: 'pending',
      totalAmount,
      orderNumber: lastOrderNumber + 1
    };

    onSubmitOrder(newOrder);
    setOrderItems([]);
    setSpecialInstructions({});
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      <div className="col-span-2">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => addToOrder(item)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Current Order</h2>
        {orderItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UtensilsCrossed className="mx-auto mb-2" size={32} />
            <p>No items in order</p>
          </div>
        ) : (
          <>
            {orderItems.map((item) => (
              <div key={item.menuItem.id} className="py-2 border-b">
                <div className="flex justify-between items-center">
                  <span>{item.menuItem.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromOrder(item.menuItem)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => addToOrder(item.menuItem)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setOrderItems(orderItems.filter(i => i.menuItem.id !== item.menuItem.id))}
                      className="p-1 hover:bg-gray-100 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Special instructions..."
                  value={specialInstructions[item.menuItem.id] || ''}
                  onChange={(e) => updateSpecialInstructions(item.menuItem.id, e.target.value)}
                  className="mt-2 w-full px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                onClick={handleSubmitOrder}
                className="w-full bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};