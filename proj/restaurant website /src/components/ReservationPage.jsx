import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, Phone, User } from 'lucide-react';

const ReservationPage = () => {
  const [reservationData, setReservationData] = useState({
    name: '',
    phoneNumber: '',
    date: '',
    time: '',
    tableNumber: '',
    partySize: 2,
    specialRequests: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null); // Assuming you have a user state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Ensure date is in YYYY-MM-DD format (input type="date" should already do this)
    const formattedData = {
      ...reservationData,
      date: reservationData.date, // Should be YYYY-MM-DD
      userId: user?._id
    };

    try {
      const response = await axios.post('/api/reservations', formattedData);
      
      if (response.data.success) {
        setSuccess('Reservation created successfully!');
        // Reset form
        setReservationData({
          name: '',
          phoneNumber: '',
          date: '',
          time: '',
          tableNumber: '',
          partySize: 2,
          specialRequests: ''
        });
      }
    } catch (error) {
      // Log the backend error for debugging
      console.error('Reservation error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Make a Reservation
            </h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline-block mr-2" size={16} />
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reservationData.name}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      name: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline-block mr-2" size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={reservationData.phoneNumber}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      phoneNumber: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline-block mr-2" size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={reservationData.date}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      date: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Time Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline-block mr-2" size={16} />
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={reservationData.time}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      time: e.target.value
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Table Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <select
                    required
                    value={reservationData.tableNumber}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      tableNumber: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a table</option>
                    {[...Array(50)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Table {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Party Size Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline-block mr-2" size={16} />
                    Party Size
                  </label>
                  <select
                    value={reservationData.partySize}
                    onChange={(e) => setReservationData({
                      ...reservationData,
                      partySize: parseInt(e.target.value)
                    })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {[2, 3, 4, 5, 6, 7, 8].map((size) => (
                      <option key={size} value={size}>
                        {size} people
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={reservationData.specialRequests}
                  onChange={(e) => setReservationData({
                    ...reservationData,
                    specialRequests: e.target.value
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests or dietary requirements?"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-auto px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Make Reservation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage; 