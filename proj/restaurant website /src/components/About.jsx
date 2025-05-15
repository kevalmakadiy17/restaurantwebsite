import React from 'react';

const About = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80"
        alt="Restaurant Interior"
        className="w-full md:w-1/2 h-56 object-cover rounded-lg shadow mb-4 md:mb-0"
      />
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4 text-orange-600">About Our Restaurant</h1>
        <p className="text-lg text-gray-700 mb-2">
          Welcome to <span className="font-semibold text-orange-500">FoodExpress</span>, where passion for food meets exceptional service! Our restaurant was founded with the vision of bringing people together over delicious meals in a warm, inviting atmosphere. We believe in using only the freshest ingredients, sourced locally whenever possible, to create dishes that delight the senses and nourish the soul.
        </p>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <blockquote className="border-l-4 border-orange-400 pl-4 italic text-gray-600 mb-4">
          "Cooking is like love. It should be entered into with abandon or not at all."<br/>
          <span className="block text-right font-semibold text-orange-500 mt-2">- Our Head Chef</span>
        </blockquote>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Our Story</h2>
        <div className="mb-4 text-gray-600">
          <ul className="list-disc pl-6">
            <li><span className="font-semibold">2024:</span> FoodExpress opens as a small family-run eatery.</li>
            <li><span className="font-semibold">2025:</span> Expanded menu to include international flavors and signature cocktails.</li>
            <li><span className="font-semibold">2026:</span> Recognized as a top dining destination in the city.</li>
          </ul>
          <p className="mt-2">Our chefs blend traditional recipes with modern flavors, offering a menu that celebrates both classic favorites and innovative new dishes.</p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"
        alt="Chef at work"
        className="w-full md:w-1/2 h-56 object-cover rounded-lg shadow"
      />
    </div>

    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        alt="Signature Dessert"
        className="w-full md:w-1/2 h-48 object-cover rounded-lg shadow mb-4 md:mb-0"
      />
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Our Values</h2>
        <ul className="list-disc pl-6 mb-4 text-gray-600">
          <li>Fresh, high-quality ingredients</li>
          <li>Friendly and attentive service</li>
          <li>Comfortable, welcoming environment</li>
          <li>Community involvement and support</li>
          <li>Continuous innovation in our menu</li>
          <li>Sustainability and eco-friendly practices</li>
        </ul>
        <div className="bg-orange-50 rounded-lg p-4 mb-4">
          <h3 className="text-xl font-bold text-orange-600 mb-2">Did You Know?</h3>
          <p className="text-gray-700">Our signature dessert, the Chocolate Lava Cake, is made fresh every day and has been voted the city's favorite for two years in a row!</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Contact Us</h2>
      <p className="mb-2 text-gray-600">123 Main Street, Your City, Country</p>
      <p className="mb-2 text-gray-600">Phone: (123) 456-7890</p>
      <p className="mb-2 text-gray-600">Email: info@foodexpress.com</p>
      <div className="mt-8 text-center">
        <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">We look forward to serving you and making every visit a memorable experience!</span>
      </div>
    </div>
  </div>
);

export default About; 