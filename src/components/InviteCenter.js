import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, CheckCircle, Brain } from 'lucide-react';
import Image from 'next/image';

function InviteCenter() {
  const [inviteCode] = useState('TRADON2025');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const generateInviteLink = () => {
    return `https://t.me/TradonAIbeta_Bot`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleInviteTraders = () => {
    const inviteLink = generateInviteLink();
    const shareText = `🤖 Join TRADON - Elite AI Trading Platform!

⚡ Neural network-powered market analysis
📈 Quantum trading algorithms
🎯 Elite trader community access
💎 Earn TRDN tokens through AI missions

My invite code: ${inviteCode}

Join the evolution: ${inviteLink}`;

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`);
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Join TRADON Elite Trading',
          text: shareText,
          url: inviteLink
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Elite invite copied to quantum clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen text-[#E6E6E6] overflow-hidden">
      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-[#E6E6E6]">Invite Network</h1>
            <p className="text-[#00F0FF] text-lg">Expand the TRADON ecosystem</p>
          </div>
          <motion.div 
            className="w-12 h-12 rounded-xl border border-[#00F0FF]/40 bg-[#0B0B0C] flex items-center justify-center"
            animate={{ 
              borderColor: ["rgba(0, 240, 255, 0.4)", "rgba(54, 255, 0, 0.4)", "rgba(0, 240, 255, 0.4)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Image src='/agent/agentlogo.png' alt='TRADON' width={32} height={32}/>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="relative mb-12 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ 
              filter: ["hue-rotate(0deg)", "hue-rotate(120deg)", "hue-rotate(240deg)", "hue-rotate(360deg)"]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Image src='/agent/agentlogo.png' alt='TRADON Core' width={320} height={320} quality={90}/>
          </motion.div>
        </motion.div>

        {/* Neural Access Code Section */}
        <motion.div 
          className="glass border border-[#00F0FF]/30 rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <h2 className="text-2xl font-bold text-[#E6E6E6]">Neural Access Code</h2>
            </div>
            
            {/* Code Display */}
            <motion.div 
              className="bg-[#0B0B0C]/60 border border-[#00F0FF]/40 rounded-2xl p-6 mb-8 relative overflow-hidden"
              whileHover={{ 
                borderColor: "rgba(0, 240, 255, 0.8)",
                boxShadow: "0 0 30px rgba(0, 240, 255, 0.2)"
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Code Scan Line Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00F0FF]/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div 
                className="font-mono text-3xl text-[#00F0FF] tracking-[0.3em] relative z-10"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(0, 240, 255, 0.8)", 
                    "0 0 20px rgba(0, 240, 255, 1)", 
                    "0 0 10px rgba(0, 240, 255, 0.8)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {inviteCode}
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                onClick={handleInviteTraders}
                className="glass border border-[#36FF00]/40 text-[#36FF00] font-bold  rounded-2xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 25px rgba(54, 255, 0, 0.4)",
                  borderColor: "rgba(54, 255, 0, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Network</span>
                </div>
              </motion.button>

              <motion.button
                onClick={handleCopyCode}
                className="glass border border-[#FFD500]/40 text-[#FFD500] font-bold py-4 px-6 rounded-2xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 25px rgba(255, 213, 0, 0.4)",
                  borderColor: "rgba(255, 213, 0, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <AnimatePresence mode="wait">
                    {copySuccess ? (
                      <motion.div
                        key="success"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="flex items-center space-x-2"
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
                        className="flex items-center space-x-2"
                      >
                        <Copy className="w-5 h-5" />
                        <span>Copy Code</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-3">
            <motion.div 
              className="w-2 h-2 bg-[#36FF00] rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-[#E6E6E6]/70">Neural network expanding</span>
          </div>
          <p className="text-xs text-[#E6E6E6]/50">
            Build the future of AI trading together 🚀
          </p>
        </motion.div>

        <div className="h-24" />
      </div>
    </div>
  );
}

export default InviteCenter;
