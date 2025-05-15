import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, MapPin, Cake } from 'lucide-react';

const Profile = ({ user, onUpdate }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    tableNumber: '',
    partySize: 2,
    name: '',
    phoneNumber: '',
    specialRequests: ''
  });
  const [personalInfo, setPersonalInfo] = useState({
    birthday: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchReservations();
    fetchPersonalInfo();
  }, [user?._id]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`/api/reservations/user/${user._id}`);
      if (response.data.success) {
        setReservations(response.data.reservations);
      }
    } catch (error) {
      setError('Failed to fetch reservations');
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get('/api/users/personal-info');
      if (response.data.success) {
        setPersonalInfo(response.data.personalInfo);
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
      setError('Failed to fetch personal information');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reservations', {
        ...reservationData,
        userId: user._id
      });

      if (response.data.success) {
        setReservations([...reservations, response.data.reservation]);
        setShowReservationForm(false);
        setReservationData({
          date: '',
          time: '',
          tableNumber: '',
          partySize: 2,
          name: '',
          phoneNumber: '',
          specialRequests: ''
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create reservation');
    }
  };

  const handlePersonalInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/users/personal-info', personalInfo);
      if (response.data.success) {
        setIsEditing(false);
        setPersonalInfo(response.data.user);
        if (onUpdate) onUpdate(response.data.user);
      }
    } catch (error) {
      setError('Failed to update personal information');
      console.error('Error updating personal info:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handlePersonalInfoUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  value={personalInfo.birthday ? new Date(personalInfo.birthday).toISOString().split('T')[0] : ''}
                  onChange={(e) => setPersonalInfo({
                    ...personalInfo,
                    birthday: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo({
                    ...personalInfo,
                    phoneNumber: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="font-semibold">
                {personalInfo.birthday ? new Date(personalInfo.birthday).toLocaleDateString() : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Phone Number</p>
              <p className="font-semibold">{personalInfo.phoneNumber || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-600">Points Balance</p>
              <p className="font-semibold text-orange-500">{user.points || 0} points</p>
            </div>
            <div>
              <p className="text-gray-600">Member Since</p>
              <p className="font-semibold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reservations Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Reservations</h2>
          <button
            onClick={() => setShowReservationForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Make Reservation
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="mx-auto mb-2" size={32} />
            <p>No reservations yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Reservation #{reservation._id.slice(-6)}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center text-gray-600">
                        <Calendar className="mr-2" size={16} />
                        {new Date(reservation.date).toLocaleDateString()}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Clock className="mr-2" size={16} />
                        {reservation.time}
                      </p>
                      <p className="flex items-center text-gray-600">
                        <Users className="mr-2" size={16} />
                        {reservation.partySize} people
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    reservation.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
                {reservation.specialRequests && (
                  <p className="mt-2 text-sm text-gray-600">
                    Special Requests: {reservation.specialRequests}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Make a Reservation</h2>
            <form onSubmit={handleReservationSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={reservationData.name}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      name: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={reservationData.phoneNumber}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      phoneNumber: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={reservationData.date}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      date: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    required
                    value={reservationData.time}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      time: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Table Number</label>
                  <select
                    required
                    value={reservationData.tableNumber}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      tableNumber: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="">Select a table</option>
                    {[...Array(50)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Table {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Party Size</label>
                  <select
                    value={reservationData.partySize}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      partySize: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map((size) => (
                      <option key={size} value={size}>
                        {size} people
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    value={reservationData.specialRequests}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      specialRequests: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    rows="3"
                    placeholder="Any special requests or dietary requirements?"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowReservationForm(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 