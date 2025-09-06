'use client';

import { useState } from 'react';
import { useStore } from '@/lib/storage';
import Image from 'next/image';

const TaskCenter = () => {
  const {
    tasks,
    purchasePass,
    completeTask,
    setTwitterFollowCompleted,
  } = useStore();
  const [error, setError] = useState(null);

  const handlePurchasePass = (count) => {
    const success = purchasePass(count);
    if (!success) {
      setError('Insufficient WLFIAI Points');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTask = (taskName, points, action) => {
    if (!tasks[taskName].completed) {
      completeTask(taskName, points);
      if (action) action();
    }
  };

  const TradonAIIcon = () => (
    <div className="w-12 h-12 rounded-full flex items-center justify-center">
    <Image src='/agent/agentlogo.png' alt='logo' width={50} height={50} className='scale-150'/>
    </div>
  );

  return (
    <div className="text-gray-200 pb-14">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-3xl font-semibold text-gray-200">Mission Control</h2>
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
        <Image src='/agent/agentlogo.png' alt='logo' width={50} height={50} className='scale-200'/>
        </div>
      </div>

      <div className="max-w-md mx-auto">

        {/* Daily Task Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TradonAIIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-200">Neural Maintenance</h3>
              <p className="text-gray-300 text-sm">Daily quantum sync</p>
            </div>
          </div>

          {/* Daily Reward Task */}
          <div className="glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TradonAIIcon />
                <div>
                  <h4 className="text-gray-200 font-semibold">Neural Calibration</h4>
                  <p className="text-gray-300 text-sm">100 WLFIAI TOKENS</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  tasks.dailyReward.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    tasks.dailyReward.completed ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
            {!tasks.dailyReward.completed && (
              <button
                onClick={() => handleTask('dailyReward', 100)}
                className="w-full mt-3 py-2 glass-light glass-blue rounded-xl text-gray-300 font-medium transition-all duration-300"
              >
                Synchronize Neural Core
              </button>
            )}
          </div>

          {/* RT Post Task */}
          <div className="glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TradonAIIcon />
                <div>
                  <h4 className="text-gray-200 font-semibold">Amplify Signal</h4>
                  <p className="text-gray-300 text-sm">1K WLFIAI TOKENS</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  tasks.rtPost.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    tasks.rtPost.completed ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
            {!tasks.rtPost.completed && (
              <button
                onClick={() => handleTask('rtPost', 1000, () => window.open('https://x.com/aitradonx', '_blank'))}
                className="w-full mt-3 py-2 glass-light glass-blue rounded-xl text-gray-300 font-medium transition-all duration-300"
              >
                Boost & Claim
              </button>
            )}
          </div>
        </div>

        {/* Optional Task Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TradonAIIcon />
            <div>
              <h3 className="text-xl font-medium text-gray-200">Elite Missions</h3>
              <p className="text-gray-300 text-sm">Advanced protocols</p>
            </div>
          </div>

          {/* Follow X Task */}
          <div className="glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TradonAIIcon />
                <div>
                  <h4 className="text-gray-200 font-semibold">Join Network</h4>
                  <p className="text-gray-300 text-sm">1K WLFIAI TOKENS</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  tasks.followX.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    tasks.followX.completed ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
            {!tasks.followX.completed && (
              <button
                onClick={() =>
                  handleTask('followX', 1000, () => {
                    setTwitterFollowCompleted(true);
                    window.open('https://x.com/aitradonx', '_blank');
                  })
                }
                className="w-full mt-3 py-2 glass-light glass-blue rounded-xl text-gray-300 font-medium transition-all duration-300"
              >
                Connect & Claim
              </button>
            )}
          </div>

          {/* Invite 5 Users Task */}
          <div className="glass">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TradonAIIcon />
                <div>
                  <h4 className="text-gray-200 font-semibold">Expand Network</h4>
                  <p className="text-gray-300 text-sm">5K WLFIAI TOKENS</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${
                  tasks.inviteFive.completed ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                    tasks.inviteFive.completed ? 'translate-x-6' : 'translate-x-0'
                  }`}></div>
                </div>
              </div>
            </div>
            {!tasks.inviteFive.completed && (
              <button
                disabled={tasks.inviteFive.completed}
                className="w-full mt-3 py-2 glass-light glass-blue rounded-xl text-gray-300 font-medium transition-all duration-300"
              >
                Recruit & Claim
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Description */}
      <p className="text-gray-200 mb-6 text-center leading-relaxed">
                Use WLFIAI Tokens to purchase AI Licenses and activate your neural pathways. 
                Once activated, you can access quantum trading algorithms and earn rewards 
                through elite market predictions.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        {/* Pass Purchase Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => handlePurchasePass(1)}
            className="flex-1 glass-light glass-blue py-4 rounded-2xl text-gray-200 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            1 LICENSE / 500 WLFIAI
          </button>
          <button
            onClick={() => handlePurchasePass(5)}
            className="flex-1 glass-light glass-blue py-4 rounded-2xl text-gray-200 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            5 LICENSES / 2K WLFIAI
          </button>
        </div>
      <div className='h-20'/>
    </div>
  );
};

export default TaskCenter;
