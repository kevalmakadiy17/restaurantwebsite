import React, { useState } from 'react';

const PaymentModal = ({ 
  order, 
  onClose, 
  onComplete,
  isProcessing 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  if (!order) return null;

  const handleCardInput = (e, field) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (field === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (field === 'expiry') {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }

    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;

    if (!cardDetails.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }

    if (!cardDetails.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      setError('Please enter a valid CVV (3 or 4 digits)');
      return false;
    }

    if (!cardDetails.name.trim()) {
      setError('Please enter the cardholder name');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    try {
      setError('');
      
      if (paymentMethod === 'card' && !validateCardDetails()) {
        return;
      }

      // Close the modal immediately
      onClose();

      // For cash payments, we can proceed directly
      if (paymentMethod === 'cash') {
        onComplete({ 
          paymentMethod,
          status: 'completed',
          paymentDate: new Date().toISOString()
        });
        return;
      }

      // For card payments, include card details
      onComplete({ 
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null,
        status: 'completed',
        paymentDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Your Payment</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            {order.pointsUsed > 0 && (
              <div className="flex justify-between text-orange-600">
                <span>Points Used</span>
                <span>-{order.pointsUsed}</span>
              </div>
            )}
            {order.pointsEarned > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Points to Earn</span>
                <span>+{order.pointsEarned}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Select Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => handleCardInput(e, 'name')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                maxLength="19"
                value={cardDetails.number}
                onChange={(e) => handleCardInput(e, 'number')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  maxLength="5"
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInput(e, 'expiry')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  maxLength="4"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInput(e, 'cvv')}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="123"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 