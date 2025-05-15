import React, { useState } from 'react';
import { Gift, Award, Trophy, Crown, Clock, Check, X } from 'lucide-react';

export const LoyaltyProgram = () => {
  const [points, setPoints] = useState(150);
  const [tier, setTier] = useState('silver');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const pointsHistory = [
    { id: 1, date: '2024-03-15', points: 50, type: 'earned', description: 'Order #1234' },
    { id: 2, date: '2024-03-10', points: -100, type: 'redeemed', description: 'Free Side Redemption' },
    { id: 3, date: '2024-03-05', points: 75, type: 'earned', description: 'Order #1233' },
    { id: 4, date: '2024-03-01', points: 125, type: 'earned', description: 'Birthday Bonus' }
  ];

  const tiers = {
    bronze: { min: 0, max: 100, color: 'text-orange-600', icon: Gift },
    silver: { min: 100, max: 300, color: 'text-gray-500', icon: Award },
    gold: { min: 300, max: 600, color: 'text-yellow-500', icon: Trophy },
    platinum: { min: 600, max: Infinity, color: 'text-purple-600', icon: Crown }
  };

  const rewards = [
    { points: 50, description: 'Free Drink', value: '$3.99' },
    { points: 100, description: 'Free Side', value: '$4.49' },
    { points: 200, description: 'Free Burger', value: '$8.99' },
    { points: 500, description: 'Free Meal', value: '$15.99' }
  ];

  const getCurrentTier = (points) => {
    return Object.entries(tiers).find(([_, value]) => 
      points >= value.min && points < value.max
    )[0];
  };

  const getNextTierProgress = () => {
    const currentTierInfo = tiers[tier];
    return ((points - currentTierInfo.min) / (currentTierInfo.max - currentTierInfo.min)) * 100;
  };

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedemption = () => {
    setPoints(prev => prev - selectedReward.points);
    setShowRedeemModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Loyalty Program</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              {React.createElement(tiers[tier].icon, { 
                className: `w-12 h-12 ${tiers[tier].color}`,
                strokeWidth: 1.5 
              })}
              <div>
                <h3 className="text-xl font-semibold capitalize">{tier} Member</h3>
                <p className="text-gray-600">{points} Points</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to next tier</span>
                <span>{Math.round(getNextTierProgress())}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${tiers[tier].color} bg-current`}
                  style={{ width: `${getNextTierProgress()}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Tier Benefits:</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Free birthday reward</li>
                <li>• Exclusive monthly offers</li>
                <li>• Points multiplier: {
                  tier === 'bronze' ? '1x' :
                  tier === 'silver' ? '1.2x' :
                  tier === 'gold' ? '1.5x' : '2x'
                }</li>
                {tier === 'platinum' && <li>• Priority ordering</li>}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Points History</h3>
            <div className="space-y-4">
              {pointsHistory.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      record.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {record.type === 'earned' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-medium">{record.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    record.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.type === 'earned' ? '+' : '-'}{Math.abs(record.points)} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Available Rewards</h3>
          <div className="space-y-4">
            {rewards.map((reward, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{reward.description}</p>
                    <p className="text-sm text-gray-500">Value: {reward.value}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{reward.points} pts</span>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  className={`w-full mt-2 px-4 py-2 rounded-lg ${
                    points >= reward.points
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={points < reward.points}
                >
                  Redeem Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redemption Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h4 className="text-xl font-semibold mb-4">Confirm Redemption</h4>
            <p className="text-gray-600 mb-4">
              Are you sure you want to redeem {selectedReward.description} for {selectedReward.points} points?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check size={20} />
          Reward redeemed successfully!
        </div>
      )}
    </div>
  );
};