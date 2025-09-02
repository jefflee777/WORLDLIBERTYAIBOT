'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheck, FaClock, FaTrendingUp, FaBolt, FaUsers, 
  FaChartLine, FaTrophy, FaBrain, FaCoins, FaRocket,
  FaFire, FaGem, FaShieldAlt, FaAtom
} from 'react-icons/fa';
import { GoZap } from "react-icons/go";


export default function TradonCommunityCenter() {
  const [totalUsers, setTotalUsers] = useState(124789);
  const [activeTrades, setActiveTrades] = useState(97234);
  const [completedToday, setCompletedToday] = useState(189456);
  const [totalTRDNEarned, setTotalTRDNEarned] = useState(3847392);
  const [loading, setLoading] = useState(true);
  const [userActivities, setUserActivities] = useState([]);

  // Mobile haptic feedback
  const hapticFeedback = useCallback((type = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 50,
        heavy: 100,
        success: [50, 30, 50]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Generate random avatar URL
  const generateAvatarUrl = useCallback(() => {
    const backgrounds = ['b6e3f4', 'c0aede', 'd1d4f9'];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const seed = Math.random().toString(36).substring(7);
    return `https://api.dicebear.com/9.x/personas/svg?seed=${seed}&backgroundColor=${randomBg}`;
  }, []);

  // Mock trading activities - optimized
  const mockActivities = useMemo(() => [
    {
      id: 1,
      username: "CryptoSarah",
      action: "Neural network trade executed",
      reward: 2150,
      trdn: 425,
      timeAgo: "1 min ago",
      avatarUrl: generateAvatarUrl(),
      type: "neural"
    },
    {
      id: 2,
      username: "QuantMike",
      action: "AI market analysis completed",
      reward: 1890,
      trdn: 378,
      timeAgo: "3 mins ago",
      avatarUrl: generateAvatarUrl(),
      type: "analysis"
    },
    {
      id: 3,
      username: "AlgoAlex",
      action: "Quantum prediction validated",
      reward: 3270,
      trdn: 654,
      timeAgo: "5 mins ago",
      avatarUrl: generateAvatarUrl(),
      type: "prediction"
    },
    {
      id: 4,
      username: "TradeEmma",
      action: "Risk matrix optimized",
      reward: 1560,
      trdn: 312,
      timeAgo: "8 mins ago",
      avatarUrl: generateAvatarUrl(),
      type: "risk"
    },
    {
      id: 5,
      username: "AITrader",
      action: "Pattern recognition mastered",
      reward: 2340,
      trdn: 468,
      timeAgo: "12 mins ago",
      avatarUrl: generateAvatarUrl(),
      type: "pattern"
    }
  ], [generateAvatarUrl]);

  // Generate user avatars - optimized
  const userAvatars = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      name: `Trader${i + 1}`,
      avatarUrl: generateAvatarUrl()
    }))
  , [generateAvatarUrl]);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setUserActivities(mockActivities);
      setLoading(false);
    }, 1200);

    // Optimized real-time updates - reduced frequency
    const interval = setInterval(() => {
      setTotalUsers(prev => prev + Math.floor(Math.random() * 15) + 5);
      setActiveTrades(prev => prev + Math.floor(Math.random() * 12) + 3);
      setCompletedToday(prev => prev + Math.floor(Math.random() * 10) + 4);
      setTotalTRDNEarned(prev => prev + Math.floor(Math.random() * 80) + 30);
      
      // Reduced activity generation frequency
      if (Math.random() > 0.7) {
        const activities = [
          "Neural network trade executed",
          "AI market analysis completed", 
          "Quantum prediction validated",
          "Risk matrix optimized",
          "Pattern recognition mastered",
          "Sentiment analysis processed",
          "Market anomaly detected"
        ];
        
        const types = ["neural", "analysis", "prediction", "risk", "pattern"];
        
        const newActivity = {
          id: Date.now(),
          username: `Trader${Math.floor(Math.random() * 999)}`,
          action: activities[Math.floor(Math.random() * activities.length)],
          reward: Math.floor(Math.random() * 2000) + 500,
          trdn: Math.floor(Math.random() * 400) + 100,
          timeAgo: "Just now",
          avatarUrl: generateAvatarUrl(),
          type: types[Math.floor(Math.random() * types.length)]
        };
        
        setUserActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 12000); // Increased interval

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [mockActivities, generateAvatarUrl]);

  const getActivityIcon = useCallback((type) => {
    const icons = {
      neural: <FaBrain size={14} />,
      analysis: <FaChartLine size={14} />,
      prediction: <FaAtom size={14} />,
      risk: <FaShieldAlt size={14} />,
      pattern: <GoZap size={14} />
    };
    return icons[type] || <FaCoins size={14} />;
  }, []);

  const getTypeColor = useCallback((type) => {
    const colors = {
      neural: '#00F0FF',
      analysis: '#36FF00', 
      prediction: '#FFD500',
      risk: '#FF4E00',
      pattern: '#FF007C'
    };
    return colors[type] || '#00F0FF';
  }, []);

  return (
    <div className="min-h-screen text-[#E6E6E6] pb-8 relative overflow-hidden">
      {/* Neural Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 via-[#36FF00]/5 to-[#FF007C]/10" />
      </div>

      {/* Header */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-3xl font-bold text-[#E6E6E6] mb-2"
          animate={{
            textShadow: [
              '0 0 10px rgba(0, 240, 255, 0.8)',
              '0 0 20px rgba(54, 255, 0, 0.6)',
              '0 0 10px rgba(0, 240, 255, 0.8)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          TRADON <span className="text-[#00F0FF]">NETWORK</span>
        </motion.h1>
        <p className="text-[#E6E6E6]/70 text-sm">Elite AI traders optimizing quantum markets</p>
      </motion.div>

      {/* User Avatars Section */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="relative">
          <div className="flex items-center -space-x-4">
            {userAvatars.slice(0, 6).map((user, index) => (
              <motion.div
                key={index}
                className="w-14 h-14 -mt-3 border-2 border-[#00F0FF]/30 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.15, 
                  zIndex: 50,
                  borderColor: 'rgba(0, 240, 255, 0.8)',
                }}
                whileTap={{ scale: 0.95 }}
                onTap={() => hapticFeedback('light')}
              >
                <img 
                  src={user.avatarUrl} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                  loading="lazy"
                />
                {/* Neural Activity Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#36FF00]/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
            
            <motion.div
              className="w-20 h-14 glass border-2 border-[#FFD500]/40 rounded-full flex items-center justify-center text-[#FFD500] text-sm font-bold shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              +{(totalUsers - 6).toLocaleString()}
            </motion.div>
          </div>
          
          <motion.div 
            className="text-center mt-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[#E6E6E6]/80 text-sm font-medium">
              {totalUsers.toLocaleString()} neural traders active
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid - Optimized */}
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {[
          { value: totalUsers, label: "Neural Traders", icon: FaUsers, color: "#00F0FF" },
          { value: activeTrades, label: "Active Quantum", icon: FaChartLine, color: "#36FF00" },
          { value: completedToday, label: "Trades Today", icon: FaTrophy, color: "#FFD500" },
          { value: totalTRDNEarned, label: "$TRDN Earned", icon: FaCoins, color: "#FF4E00" }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="glass border border-[#E6E6E6]/10 rounded-2xl p-4 text-center relative overflow-hidden"
            whileHover={{ 
              scale: 1.05,
              borderColor: `${stat.color}40`
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <motion.div 
              className="absolute inset-0 opacity-0 transition-opacity duration-300"
              style={{ background: `linear-gradient(45deg, ${stat.color}05, transparent)` }}
              whileHover={{ opacity: 1 }}
            />
            
            <motion.div 
              className="text-xl font-bold mb-1 relative z-10"
              style={{ color: stat.color }}
              animate={{
                textShadow: [`0 0 5px ${stat.color}`, `0 0 15px ${stat.color}`, `0 0 5px ${stat.color}`]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {stat.value.toLocaleString()}
            </motion.div>
            
            <div className="text-[#E6E6E6]/60 text-xs mb-2 relative z-10">{stat.label}</div>
            <stat.icon className="w-4 h-4 mx-auto relative z-10" style={{ color: stat.color }} />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading State - Optimized */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              <motion.div 
                className="w-12 h-12 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <FaBrain className="w-6 h-6 text-[#00F0FF] absolute top-3 left-3" />
            </div>
            <p className="text-[#E6E6E6]/60 mt-4 text-sm">Initializing neural networks...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Activity Feed - Optimized */}
      <div className="max-w-md mx-auto">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div 
              className="w-3 h-3 bg-[#36FF00] rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                boxShadow: ['0 0 5px #36FF00', '0 0 20px #36FF00', '0 0 5px #36FF00']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h2 className="text-lg font-bold text-[#E6E6E6]">LIVE NEURAL ACTIVITY</h2>
          </div>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {!loading && userActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="glass border border-[#E6E6E6]/10 rounded-2xl p-4 relative overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
                whileHover={{ 
                  scale: 1.02,
                  borderColor: `${getTypeColor(activity.type)}40`
                }}
                whileTap={{ scale: 0.98 }}
                onTap={() => hapticFeedback('light')}
              >
                {/* Activity Type Indicator */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                  style={{ backgroundColor: getTypeColor(activity.type) }}
                />

                <div className="flex items-center justify-between ml-2">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden"
                      style={{ borderColor: `${getTypeColor(activity.type)}40` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <img 
                        src={activity.avatarUrl} 
                        alt={activity.username}
                        className="w-10 h-10 rounded-full"
                        loading="lazy"
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-[#E6E6E6] font-bold text-sm">{activity.username}</h3>
                      <p className="text-[#E6E6E6]/70 text-xs">{activity.action}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-[#FFD500] text-sm font-bold mb-1">
                      <FaCoins className="w-3 h-3" />
                      <span>+{activity.trdn}</span>
                    </div>
                    <p className="text-[#E6E6E6]/50 text-xs">{activity.timeAgo}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-[#E6E6E6]/10 ml-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2" style={{ color: getTypeColor(activity.type) }}>
                      <FaCheck className="w-3 h-3" />
                      <span className="text-xs font-medium">Executed</span>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="text-xs text-[#E6E6E6]/50">
                      Score: +{activity.reward.toLocaleString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <motion.p 
        className="text-[#E6E6E6]/50 text-xs text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Join the elite network of AI-powered traders earning $TRDN
      </motion.p>
    </div>
  );
}
