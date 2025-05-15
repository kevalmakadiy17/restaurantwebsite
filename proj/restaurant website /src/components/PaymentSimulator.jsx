import React, { useState } from 'react';
import { CreditCard, Wallet, Smartphone, Check } from 'lucide-react';

export const PaymentSimulator = ({ amount, onPaymentComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: CreditCard },
    { id: 'wallet', name: 'Digital Wallet', icon: Wallet },
    { id: 'mobile', name: 'Mobile Payment', icon: Smartphone }
  ];

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep(3);
    setLoading(false);
    setTimeout(() => {
      onPaymentComplete?.();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-semibold">Payment</h3>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="font-medium">Select Payment Method</h4>
              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setStep(2);
                    }}
                    className={`flex items-center gap-4 p-4 border rounded-lg hover:border-red-500 transition-colors`}
                  >
                    <method.icon className="text-gray-600" />
                    <span>{method.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength="19"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h4>
              <p className="text-gray-600">Your order has been confirmed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};