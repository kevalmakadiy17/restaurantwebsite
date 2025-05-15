import React from 'react';
import { MapPin, Phone, Clock, Mail, Globe } from 'lucide-react';

const RestaurantInfo = () => {
  const locations = [
    {
      name: 'Downtown',
      address: '123 Main Street, Downtown, City 12345',
      phone: '(555) 123-4567',
      hours: 'Mon-Sun: 10:00 AM - 10:00 PM'
    },
    {
      name: 'Westside',
      address: '456 West Avenue, Westside, City 12345',
      phone: '(555) 987-6543',
      hours: 'Mon-Sun: 11:00 AM - 11:00 PM'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Restaurant Information</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Our Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Hours</h3>
            <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
            <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@restaurant.com</p>
            <p>Address: 123 Food Street, Cuisine City</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {locations.map((location, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">{location.name} Location</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-red-600 mt-1" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-red-600" />
                <span>{location.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-red-600" />
                <span>{location.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">About Us</h3>
        <p className="text-gray-600 mb-4">
          Our restaurant has been serving delicious, quality food since 2010. We pride ourselves on our 
          friendly staff, welcoming atmosphere, and exceptional dining experience.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Mail className="text-red-600" />
            <span>info@restaurant.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-red-600" />
            <span>www.restaurant.com</span>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Dine-In Information</h3>
        <div className="space-y-2 text-gray-700">
          <p>• Table reservation available</p>
          <p>• Online ordering for dine-in</p>
          <p>• Points system for regular customers</p>
          <p>• Multiple payment options available</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;