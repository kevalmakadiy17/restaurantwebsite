import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = ({ orderId }) => {
  const [orderStatus, setOrderStatus] = useState({
    status: 'preparing',
    estimatedTime: 15,
    currentStep: 1,
    steps: [
      { id: 1, name: 'Order Received', completed: true },
      { id: 2, name: 'Preparing', completed: false },
      { id: 3, name: 'Cooking', completed: false },
      { id: 4, name: 'Ready for Pickup', completed: false },
      { id: 5, name: 'Completed', completed: false }
    ]
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOrderStatus(prev => {
        const newSteps = [...prev.steps];
        const currentIndex = newSteps.findIndex(step => !step.completed);
        
        if (currentIndex !== -1) {
          newSteps[currentIndex].completed = true;
          
          if (currentIndex === newSteps.length - 1) {
            clearInterval(interval);
            return {
              ...prev,
              status: 'completed',
              currentStep: currentIndex + 1,
              steps: newSteps
            };
          }
          
          return {
            ...prev,
            currentStep: currentIndex + 1,
            steps: newSteps
          };
        }
        
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (step, index) => {
    if (step.completed) {
      return <CheckCircle className="status-icon completed" />;
    }
    if (index === orderStatus.currentStep - 1) {
      return <Clock className="status-icon in-progress" />;
    }
    return <AlertCircle className="status-icon pending" />;
  };

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h2>Order #{orderId}</h2>
        <div className="status-badge">
          {orderStatus.status === 'completed' ? (
            <CheckCircle size={20} className="status-icon completed" />
          ) : (
            <Clock size={20} className="status-icon in-progress" />
          )}
          <span className="status-text">{orderStatus.status}</span>
        </div>
      </div>

      <div className="progress-bar">
        {orderStatus.steps.map((step, index) => (
          <div key={step.id} className="progress-step">
            <div className="step-icon">
              {getStatusIcon(step, index)}
            </div>
            <div className="step-info">
              <span className="step-name">{step.name}</span>
              {index === orderStatus.currentStep - 1 && (
                <span className="estimated-time">
                  Estimated time: {orderStatus.estimatedTime} minutes
                </span>
              )}
            </div>
            {index < orderStatus.steps.length - 1 && (
              <div className={`step-connector ${step.completed ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="tracking-footer">
        <div className="estimated-completion">
          <Clock size={20} />
          <span>Estimated completion: {new Date(Date.now() + orderStatus.estimatedTime * 60000).toLocaleTimeString()}</span>
        </div>
        <button className="help-button">
          Need help? Contact us
        </button>
      </div>
    </div>
  );
};

export default OrderTracking;