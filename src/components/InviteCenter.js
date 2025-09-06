import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, CheckCircle, Brain, Users, Gift, Sparkles } from 'lucide-react';
import Image from 'next/image';

function InviteCenter() {
  const [inviteCode] = useState('WLFIAI2025');
  const [copySuccess, setCopySuccess] = useState(false);
  const [inviteStats, setInviteStats] = useState({ referred: 0, rewards: 0 });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    
    // Simulate loading user stats
    setInviteStats({ referred: Math.floor(Math.random() * 10), rewards: Math.floor(Math.random() * 500) });
  }, []);

  const generateInviteLink = () => {
    return `https://t.me/WorldLibertyAI_Bot`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleInviteTraders = () => {
    const inviteLink = generateInviteLink();
    const shareText = `🚀 Join World Liberty AI - Revolutionary Financial Intelligence!

🧠 AI-powered market analysis
💎 Real-time crypto insights  
🎯 Elite trading community access
⚡ Earn WLFIAI tokens through missions

My exclusive code: ${inviteCode}

Join the revolution: ${inviteLink}`;

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Join World Liberty AI',
          text: shareText,
          url: inviteLink
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Invite details copied to clipboard! 🎉');
      }
    }
  };

  return (
    <div className="min-h-screen text-[#E6E6E6] overflow-hidden pb-20">
      <div className="relative z-10 max-w-md mx-auto">
        
        {/* Enhanced Header */}
        <motion.div 
          className="flex items-center justify-between pt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e7ac08] to-[#fdd949]">
              Invite Network
            </h1>
            <p className="text-[#e7ac08] text-lg">Expand the WLFIAI ecosystem</p>
          </div>
        </motion.div>
        {/* Hero Logo */}
        <motion.div 
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="relative"
            animate={{ 
              filter: [
                "hue-rotate(0deg) drop-shadow(0 0 20px rgba(231, 172, 8, 0.5))", 
                "hue-rotate(60deg) drop-shadow(0 0 30px rgba(253, 217, 73, 0.6))", 
                "hue-rotate(0deg) drop-shadow(0 0 20px rgba(231, 172, 8, 0.5))"
              ]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-64 h-64 rounded-full flex items-center justify-center">
              <Image src='/logo.png' alt='logo' width={400} height={400} className='scale-150'/>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Invite Card */}
        <motion.div 
          className="glass glass-edges glass-particles border border-[#e7ac08]/30 rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="glass-content relative z-10 text-center">
            
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#fdd949]" />
              <h2 className="text-2xl font-bold text-[#fafaf9]">Neural Access Code</h2>
            </div>
            
            {/* Enhanced Code Display */}
            <motion.div 
              className="bg-[#0B0B0C]/60 border border-[#e7ac08]/40 rounded-2xl py-3 mb-8 relative overflow-hidden"
              whileHover={{ 
                borderColor: "rgba(231, 172, 8, 0.8)",
                boxShadow: "0 0 40px rgba(231, 172, 8, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Scanning Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e7ac08]/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                className="font-mono text-3xl text-[#e7ac08] tracking-[0.4em] relative z-10 font-bold"
                animate={{ 
                  textShadow: [
                    "0 0 15px rgba(231, 172, 8, 0.8)", 
                    "0 0 25px rgba(253, 217, 73, 1)", 
                    "0 0 15px rgba(231, 172, 8, 0.8)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                {inviteCode}
              </motion.div>
              
              <div className="mt-3 text-sm text-[#aaa29d]">
                Exclusive World Liberty AI Access
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.button
                onClick={handleInviteTraders}
                className="glass py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
                <span>Share Network</span>
              </motion.button>

              <motion.button
                onClick={handleCopyCode}
                className="glass glass-light border border-[#fdd949]/40 text-[#fdd949] font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 25px rgba(253, 217, 73, 0.4)",
                  borderColor: "rgba(253, 217, 73, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <AnimatePresence mode="wait">
                    {copySuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        <span>Copy Code</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>

            {/* Benefits List */}
            <div className="text-left space-y-2 mb-6">
              <div className="text-sm font-semibold text-[#e7ac08] mb-3">Invite Benefits:</div>
              {[
                'Earn WLFIAI tokens for each referral',
                'Access to exclusive AI trading insights',
                'Priority access to new features',
                'Bonus rewards for active users'
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-[#d7d3d0]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-[#4ade80] rounded-full" />
                  {benefit}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div 
          className="mt-8 text-center pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <motion.div 
              className="w-2 h-2 bg-[#4ade80] rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-[#aaa29d]">Neural network expanding globally</span>
          </div>
          <p className="text-xs text-[#aaa29d]">
            Build the future of AI-powered finance together 🚀
          </p>
          
          <div className="mt-4 text-xs text-[#e7ac08] font-medium">
            World Liberty AI - Revolutionary Financial Intelligence
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InviteCenter;
