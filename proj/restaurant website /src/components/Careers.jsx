import React from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Send } from 'lucide-react';

export const Careers = () => {
  const positions = [
    {
      id: 1,
      title: 'Kitchen Manager',
      location: 'Downtown',
      type: 'Full-time',
      salary: '$45,000 - $55,000',
      description: 'Lead our kitchen team and maintain high quality standards.'
    },
    {
      id: 2,
      title: 'Line Cook',
      location: 'Multiple Locations',
      type: 'Full-time',
      salary: '$30,000 - $35,000',
      description: 'Prepare food items according to recipes and quality standards.'
    },
    {
      id: 3,
      title: 'Customer Service Representative',
      location: 'Westside',
      type: 'Part-time',
      salary: '$15 - $18/hour',
      description: 'Provide excellent customer service and handle orders.'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We're always looking for talented individuals who are passionate about food and customer service.
          Join us in our mission to serve delicious meals with exceptional service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Why Work With Us?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <DollarSign size={20} />
              </div>
              <div>
                <h4 className="font-semibold">Competitive Pay</h4>
                <p className="text-gray-600">Above industry average compensation with regular reviews</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-semibold">Flexible Schedule</h4>
                <p className="text-gray-600">Work-life balance with flexible scheduling options</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="font-semibold">Growth Opportunities</h4>
                <p className="text-gray-600">Clear career path with training and advancement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Quick Apply</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position of Interest
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a position</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.title}>{pos.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume
              </label>
              <input
                type="file"
                className="w-full"
                accept=".pdf,.doc,.docx"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Application
            </button>
          </form>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-6">Open Positions</h3>
      <div className="grid gap-4">
        {positions.map(position => (
          <div key={position.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold">{position.title}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{position.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    <span>{position.salary}</span>
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{position.description}</p>
              </div>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 whitespace-nowrap">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};