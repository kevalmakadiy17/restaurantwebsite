import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, User, LogOut, CreditCard, Wallet, Award } from 'lucide-react';
import RestaurantInfo from './components/RestaurantInfo';
import { menuItems, categories } from './data/menuItems';
import PaymentModal from './components/PaymentModal';
import OrderHistory from './components/OrderHistory';
import UserProfile from './components/UserProfile';
import ReservationPage from './components/ReservationPage';
import About from './components/About';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderType, setOrderType] = useState('dine-in');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [view, setView] = useState('menu');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check for existing session on mount
    const sessionData = localStorage.getItem('sessionData');
    if (sessionData) {
      const { token, user: savedUser } = JSON.parse(sessionData);
      if (token && savedUser) {
        // Set axios authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(savedUser);
        fetchUserData(token);
      }
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      // Ensure token is set in headers
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get('/api/users/me');
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch user data');
      }
      
      const updatedUser = response.data.user;
      
      // Update session data with fresh user info
      const sessionData = localStorage.getItem('sessionData');
      if (sessionData) {
        const updatedSessionData = {
          ...JSON.parse(sessionData),
          user: updatedUser,
          lastActivity: new Date().toISOString()
        };
        localStorage.setItem('sessionData', JSON.stringify(updatedSessionData));
      }
      
      setUser(updatedUser);
      fetchOrders();
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      if (!user || !user._id) {
        console.error('No user ID available');
        setOrdersLoading(false);
        return;
      }

      const response = await axios.get(`/api/orders/user/${user._id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }

      const allOrders = response.data.orders;
      
      // Sort orders by status and date
      const sortedOrders = allOrders.sort((a, b) => {
        // First sort by status (completed orders first)
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;
        
        // Then sort by date (most recent first)
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Unable to fetch orders. Please try again later.';
      setError(errorMessage);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await axios.post(endpoint, formData);
      
      if (!response.data.success) {
        setError(response.data.message || 'Authentication failed');
        return;
      }

      // Save complete user session data
      const sessionData = {
        token: response.data.token,
        user: response.data.user,
        timestamp: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Set axios authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Update state
      setUser(response.data.user);
      setFormData({ email: '', password: '', name: '' });
      
      // Fetch fresh user data
      await fetchUserData(response.data.token);
      
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || 'An error occurred during authentication');
    }
  };

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem('sessionData');
    localStorage.removeItem('isLoggedIn');
    
    // Clear state
    setUser(null);
    setCart([]);
    setOrders([]);
    setPointsToUse(0);
    
    // Clear axios defaults
    delete axios.defaults.headers.common['Authorization'];
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const generateOrderId = () => {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const pointsDiscount = pointsToUse / 100; // 100 points = $1
    return Math.max(0, subtotal - pointsDiscount);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getAvailablePoints = () => {
    return parseInt(user?.points) || 0;
  };

  const calculatePointsEarned = (total) => {
    return Math.floor(total * 10); // 10 points per dollar
  };

  const validateTableNumber = (number) => {
    const tableNum = parseInt(number);
    return tableNum > 0 && tableNum <= 50;
  };

  const handleTableNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 50)) {
      setTableNumber(value);
      setError('');
    }
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const availablePoints = getAvailablePoints();
    
    if (value >= 0 && value <= availablePoints) {
      setPointsToUse(value);
      setError('');
    } else {
      setError(`Points must be between 0 and ${availablePoints}`);
      setPointsToUse(0);
    }
  };

  const calculateBonusPoints = (total, tableNumber) => {
    let bonusPoints = 0;
    
    // Bonus points for higher spending
    if (total >= 100) bonusPoints += 500;
    else if (total >= 50) bonusPoints += 200;
    
    // Bonus points for specific table numbers (e.g., VIP tables)
    const vipTables = [1, 2, 3, 4, 5]; // Define VIP tables
    if (vipTables.includes(parseInt(tableNumber))) {
      bonusPoints += 100;
    }
    
    return bonusPoints;
  };

  const handlePlaceOrder = () => {
    // Validate table number
    if (!tableNumber || !validateTableNumber(tableNumber)) {
      setError('Please enter a valid table number (1-50)');
      return;
    }
    // Validate cart
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    // Validate points
    if (pointsToUse > getAvailablePoints()) {
      setError(`You only have ${getAvailablePoints()} points available`);
      return;
    }

    // Create order object
    const orderData = {
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: calculateTotal(),
      pointsUsed: pointsToUse,
      pointsEarned: calculatePointsEarned(calculateTotal()),
      tableNumber,
      paymentMethod,
      specialInstructions
    };

    // Set current order and show payment modal
    setCurrentOrder(orderData);
    setShowPayment(true);
  };

  const updatePointsDisplay = (newPoints) => {
    setUser(prevUser => ({
      ...prevUser,
      points: newPoints
    }));
  };

  const handlePaymentComplete = async (paymentData) => {
    try {
      setError('');
      setIsProcessing(true);

      if (!user?._id) {
        throw new Error('User not authenticated');
      }

      // Create the order with payment information
      const orderData = {
        ...currentOrder,
        userId: user._id,
        paymentMethod: paymentData.paymentMethod,
        status: 'completed',
        paymentDate: paymentData.paymentDate,
        cardDetails: paymentData.paymentMethod === 'card' ? {
          number: paymentData.cardDetails?.number,
          expiry: paymentData.cardDetails?.expiry
        } : null
      };

      // Send order to server
      const response = await axios.post('/api/orders', orderData);

      if (response.data.success) {
        // Update points immediately from the response
        const newPoints = response.data.points;
        updatePointsDisplay(newPoints);

        // Clear cart and reset state
        setCart([]);
        setPointsToUse(0);
        setTableNumber('');
        setSpecialInstructions('');
        setCurrentOrder(null);
        setShowCart(false);
        setShowPayment(false);

        // Show success message with points information
        const pointsMessage = orderData.pointsEarned > 0 
          ? `\nPoints Earned: +${orderData.pointsEarned}`
          : '';
        const pointsUsedMessage = orderData.pointsUsed > 0
          ? `\nPoints Used: -${orderData.pointsUsed}`
          : '';
        
        setSuccess(`Order placed successfully!${pointsMessage}${pointsUsedMessage}`);
        setTimeout(() => setSuccess(''), 3000);

        // Refresh user data and orders to get updated points
        await fetchUserData();
        await fetchOrders();
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Payment completion error:', error);
      if (error.message === 'User not authenticated') {
        setError('Please log in to place an order');
        setShowCart(false);
      } else if (error.response?.status === 400 && error.response?.data?.message?.includes('card')) {
        setShowCart(false);
        setSuccess('Order placed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(error.response?.data?.message || 'Failed to complete payment');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMenu = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden mb-12 fade-in">
        <img 
          src="/static/category-mains.jpg"
          alt="Restaurant ambiance"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="px-8 md:px-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 slide-in">
              Experience Fine Dining
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl slide-in-delayed">
              Discover our carefully curated menu featuring fresh ingredients and expert craftsmanship
            </p>
            <button 
              className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors slide-in-delayed-2"
              onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}
            >
              View Menu
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Section - Moved to top */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Recent Orders</h2>
          <button
            onClick={() => setView('orders')}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
          >
            View All Orders
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {ordersLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.slice(0, 3).map((order) => (
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

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        const newCart = order.items.map(item => ({
                          id: item._id || item.id,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity
                        }));
                        setCart(newCart);
                        setShowCart(true);
                      }}
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Categories */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer category-button ${
                selectedCategory === category ? 'ring-4 ring-orange-500' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={category === 'All' ? '/static/category-mains.jpg' : 
                     category === 'Drinks' ? '/static/coffee.jpg' : 
                     category === 'Alcohol' ? '/static/category-alcohol.jpg' :
                     `/static/category-${category.toLowerCase()}.jpg`}
                alt={category}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <span className="text-white text-xl font-semibold">{category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Section */}
      <div id="menu-section" className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems
            .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
            .map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 menu-card-hover fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                  {item.isSpicy && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      Spicy 🌶️
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">${item.price}</span>
                      {item.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                    >
                      <span>Add to Cart</span>
                      {item.isPopular && <span className="text-xs">🔥</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2">Happy Hour</h3>
            <p className="mb-4">50% off on selected items between 3 PM - 5 PM</p>
            <button className="bg-white text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Learn More
            </button>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2">Weekend Special</h3>
            <p className="mb-4">Free dessert with orders above $50</p>
            <button className="bg-white text-purple-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo only */}
            <div className="flex items-center">
              <button 
                onClick={() => setView('menu')} 
                className="flex items-center space-x-2 hover:text-orange-500 transition-colors"
              >
                <img 
                  src="/images/logo.svg" 
                  alt="FoodExpress Logo"
                  className="h-16 w-16 object-cover rounded-full shadow-md"
                />
                <span className="text-2xl font-bold text-gray-800">FoodExpress</span>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <button 
                onClick={() => setView('menu')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'menu' 
                    ? 'text-orange-500' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Menu
              </button>
              <button 
                onClick={() => setView('reservations')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'reservations' 
                    ? 'text-orange-500' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Reservations
              </button>
              <button 
                onClick={() => setView('orders')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'orders' 
                    ? 'text-orange-500' 
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setView('about')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  view === 'about'
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                About
              </button>
            </div>

            {/* Right side - User actions */}
            <div className="flex items-center space-x-4">
              {/* Points Display */}
              <div className="hidden md:flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full mr-4">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">
                  {user?.points || 0} points
                </span>
              </div>

              {/* Profile Button */}
              <button 
                onClick={() => setView('profile')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  view === 'profile'
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{user?.name || user?.email}</span>
              </button>

              {/* Cart Button */}
              <button 
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:text-gray-800"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {view === 'menu' && renderMenu()}
        {view === 'orders' && <OrderHistory userId={user?._id} />}
        {view === 'profile' && (
          <UserProfile 
            user={user} 
            onUpdateUser={(updatedUser) => setUser(updatedUser)} 
          />
        )}
        {view === 'reservations' && <ReservationPage />}
        {view === 'about' && <About />}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Table Order</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Table Number Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={handleTableNumberChange}
                    min="1"
                    max="50"
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 ${
                      !tableNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter table number (1-50)"
                    required
                  />
                  {!tableNumber && (
                    <p className="text-red-500 text-xs mt-1">Table number is required</p>
                  )}
                  {tableNumber && (parseInt(tableNumber) >= 1 && parseInt(tableNumber) <= 5) && (
                    <p className="text-green-500 text-xs mt-1">VIP table - Earn bonus points!</p>
                  )}
                </div>
              </div>

              {/* Cart Items */}
              <div className="max-h-64 overflow-y-auto mb-4 flex-grow">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${item.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Points Redemption */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Points ({getAvailablePoints()} available)
                </label>
                <input
                  type="number"
                  value={pointsToUse}
                  onChange={handlePointsChange}
                  min="0"
                  max={getAvailablePoints()}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter points to redeem"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {pointsToUse > 0 && `Points discount: $${(pointsToUse / 100).toFixed(2)}`}
                </p>
              </div>

              {/* Special Instructions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                  placeholder="Any special requests?"
                  rows="3"
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center space-x-2 p-3 rounded-lg border ${
                      paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex items-center space-x-2 p-3 rounded-lg border ${
                      paymentMethod === 'wallet' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Wallet</span>
                  </button>
                </div>
              </div>

              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2">Points Information</h3>
                <div className="space-y-2 text-sm">
                  <p>• Earn 10 points per $1 spent</p>
                  <p>• Bonus 500 points for orders over $100</p>
                  <p>• Bonus 200 points for orders over $50</p>
                  <p>• Bonus 100 points for VIP tables (1-5)</p>
                  <p>• 100 points = $1 discount</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200 mt-auto"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && currentOrder && (
        <PaymentModal
          order={currentOrder}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

export default App;