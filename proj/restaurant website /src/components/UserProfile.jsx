import React, { useState, useEffect } from 'react';
import { User, Award, Clock, Settings, CreditCard, Bell, Shield } from 'lucide-react';
import axios from 'axios';

const UserProfile = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name || '',
    email: user.email,
    phone: user.phone || '',
    preferences: user.preferences || {}
  });
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPointsHistory();
  }, []);

  const fetchPointsHistory = async () => {
    try {
      const response = await axios.get(`/api/users/${user._id}/points-history`);
      setPointsHistory(response.data);
    } catch (error) {
      console.error('Error fetching points history:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch('/api/users/profile', userData);
      onUpdateUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-orange-500 hover:text-orange-600"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div>
                <h4 className="text-xl font-semibold">{user.name}</h4>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && <p className="text-gray-600">{user.phone}</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Rewards Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">Current Points</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{user.points || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Points Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {pointsHistory.reduce((total, record) => 
                total + (record.type === 'earned' ? record.points : 0), 0
              )}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Points Used</span>
            </div>
            <p className="text-2xl font-bold text-blue-500">
              {pointsHistory.reduce((total, record) => 
                total + (record.type === 'used' ? record.points : 0), 0
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-6">Points History</h3>
        <div className="space-y-4">
          {pointsHistory.map((record, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  record.type === 'earned' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {record.type === 'earned' ? '+' : '-'}
                </div>
                <div>
                  <p className="font-medium">{record.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`font-semibold ${
                record.type === 'earned' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {record.type === 'earned' ? '+' : '-'}{record.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Order Notifications</p>
              <p className="text-sm text-gray-500">Get updates about your orders</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Account</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'profile'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile & Points
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 py-4 text-center font-medium ${
              activeTab === 'preferences'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {activeTab === 'profile' ? renderProfile() : renderPreferences()}
    </div>
  );
};

export default UserProfile; 