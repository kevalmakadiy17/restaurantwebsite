import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

export const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    visitDate: '',
    category: '',
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { ...formData, rating });
    setSubmitted(true);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      rating: 0,
      visitDate: '',
      category: '',
      comment: ''
    });
    setRating(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (submitted) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-green-50 rounded-lg shadow-md p-8 text-center">
          <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank You for Your Feedback!</h3>
          <p className="text-green-600 mb-4">Your feedback helps us improve our service.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Customer Feedback</h2>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Visit
              </label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a category</option>
                <option value="food">Food Quality</option>
                <option value="service">Service</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="speed">Speed of Service</option>
                <option value="value">Value for Money</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};