import React, { useState } from 'react';
import { Users, Calendar, Clock, DollarSign, Send } from 'lucide-react';

export const Catering = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    eventType: '',
    message: ''
  });

  const packages = [
    {
      name: 'Office Lunch',
      price: 15,
      perPerson: true,
      minGuests: 10,
      includes: [
        'Assorted Sandwiches',
        'Side Salads',
        'Cookies',
        'Soft Drinks',
        'Setup & Cleanup'
      ]
    },
    {
      name: 'Party Package',
      price: 25,
      perPerson: true,
      minGuests: 20,
      includes: [
        'Burger Station',
        'French Fries',
        'Salad Bar',
        'Dessert Platter',
        'Beverages',
        'Full Service Staff'
      ]
    },
    {
      name: 'Premium Event',
      price: 35,
      perPerson: true,
      minGuests: 30,
      includes: [
        'Custom Menu',
        'Appetizers',
        'Main Course Options',
        'Dessert Station',
        'Premium Beverages',
        'Full Service Staff',
        'Custom Setup'
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Catering inquiry submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: '',
      eventType: '',
      message: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Catering Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Make your event memorable with our professional catering services.
          From office lunches to special events, we've got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {packages.map((pkg, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-red-600">${pkg.price}</span>
              <span className="text-gray-600">per person</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Minimum {pkg.minGuests} guests
            </div>
            <ul className="space-y-2 mb-6">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
              Get Quote
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-2xl font-bold mb-6">Request a Quote</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              min="10"
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Select event type</option>
              <option value="corporate">Corporate Event</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday Party</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};