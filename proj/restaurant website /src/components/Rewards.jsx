import React from 'react';
import { Gift, Award, Crown } from 'lucide-react';

const Rewards = ({ user, points }) => {
  const tiers = [
    { name: 'Bronze', min: 0, max: 999, icon: Gift, color: 'text-amber-600' },
    { name: 'Silver', min: 1000, max: 4999, icon: Award, color: 'text-gray-400' },
    { name: 'Gold', min: 5000, max: Infinity, icon: Crown, color: 'text-yellow-400' }
  ];

  const getCurrentTier = (points) => {
    return tiers.find(tier => points >= tier.min && points <= tier.max);
  };

  const currentTier = getCurrentTier(points);
  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const progress = nextTier 
    ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">My Rewards</h2>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <currentTier.icon className={`w-8 h-8 ${currentTier.color}`} />
            <div>
              <p className="font-semibold">{currentTier.name} Member</p>
              <p className="text-sm text-gray-500">{points} points</p>
            </div>
          </div>
          {nextTier && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Next Tier</p>
              <p className="font-semibold">{nextTier.name}</p>
            </div>
          )}
        </div>

        {nextTier && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Available Benefits</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-green-600">
              <span className="mr-2">✓</span> Free birthday dessert
            </li>
            <li className="flex items-center text-green-600">
              <span className="mr-2">✓</span> Priority seating
            </li>
            <li className="flex items-center text-green-600">
              <span className="mr-2">✓</span> Points multiplier: {currentTier.name === 'Gold' ? '3x' : currentTier.name === 'Silver' ? '2x' : '1x'}
            </li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            {/* Add recent points activity here */}
            <div className="flex justify-between">
              <span>Order #123</span>
              <span className="text-green-600">+150 points</span>
            </div>
            <div className="flex justify-between">
              <span>Redeemed Reward</span>
              <span className="text-red-600">-500 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards; 