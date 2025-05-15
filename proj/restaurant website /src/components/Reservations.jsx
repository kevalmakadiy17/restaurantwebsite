import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

const Reservations = () => {
  const [reservation, setReservation] = useState({
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });

  const availableTimes = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '5:00 PM',
    '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle reservation submission
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Make a Reservation</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={reservation.date}
                  onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <select
                  value={reservation.time}
                  onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Select time</option>
                  {availableTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={reservation.guests}
                  onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                  min="1"
                  max="10"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  required
                />
                <Users className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                value={reservation.specialRequests}
                onChange={(e) => setReservation({ ...reservation, specialRequests: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                rows="3"
                placeholder="Any special requests?"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservations; 