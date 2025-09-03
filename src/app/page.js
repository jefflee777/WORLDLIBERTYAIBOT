'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/storage';
import { useTelegram } from '@/lib/useTelegram';
import CustomLoader from '@/components/Loader';
import BottomNav from '@/components/BottomNav';
import CoinAgent from '@/components/CoinAgent';
import Agent from '@/components/Agent';
import AiNews from '@/components/AiNews';
import TaskCenter from '@/components/TaskCenter';
import InviteCenter from '@/components/InviteCenter';
import DataCenterHome from '@/components/DataCenterHome';
import { SquareCheckBig, UserPlus, History, Check, CheckCircle, Brain, Zap, Target, Activity, Star, TrendingUp } from 'lucide-react';
import { GoTasklist } from "react-icons/go";
import { BsPeople } from "react-icons/bs";
import { PiCoinsLight } from "react-icons/pi";
import TradonCommunityCenter from '@/components/CommunityCenter';


// Enhanced Earning Timer Component
const EarningTimer = () => {
  const { earningTimer, startEarningTimer, formatTime } = useStore();
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    if (earningTimer.isActive && earningTimer.startTimestamp) {
      const duration = 6 * 60 * 60;
      const elapsedSeconds = Math.floor((Date.now() - earningTimer.startTimestamp) / 1000);
      const newTimeRemaining = Math.max(duration - elapsedSeconds, 0);

      if (newTimeRemaining === 0 && !earningTimer.hasAwardedPoints) {
        useStore.getState().updateEarningTimer();
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 3000);
      }
    }
  }, [earningTimer.isActive, earningTimer.startTimestamp, earningTimer.hasAwardedPoints]);

  const totalDuration = 6 * 60 * 60;
  const progress = earningTimer.isActive 
    ? ((totalDuration - earningTimer.timeRemaining) / totalDuration) * 100
    : 0;

  const circumference = 2 * Math.PI * 130;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div 
      className="glass border border-[#00F0FF]/20 rounded-3xl relative overflow-hidden h-fit flex flex-col items-center justify-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 via-[#36FF00]/5 to-[#FF007C]/10 rounded-3xl"
        animate={{
          background: earningTimer.isActive 
            ? ["linear-gradient(45deg, rgba(0,240,255,0.1), rgba(54,255,0,0.05))", 
               "linear-gradient(135deg, rgba(54,255,0,0.1), rgba(255,0,124,0.05))",
               "linear-gradient(225deg, rgba(255,0,124,0.1), rgba(0,240,255,0.05))"]
            : "linear-gradient(45deg, rgba(230,230,230,0.05), rgba(230,230,230,0.02))"
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Enhanced Bottom content */}
      <motion.div 
        className="text-center space-y-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className='flex items-center justify-between w-full max-w-sm mx-auto'>
          {/* Enhanced Earn text */}
          <motion.div 
            className="text-[#E6E6E6] text-xl font-bold tracking-wide"
            animate={{ 
              color: earningTimer.isActive 
                ? ["#00F0FF", "#36FF00", "#FFD500", "#00F0FF"]
                : "#E6E6E6"
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Earn 3,000 WLFI
          </motion.div>

          {/* Enhanced Timer display */}
          <motion.div 
            className="text-[#E6E6E6] text-2xl ml-3 font-mono font-bold"
            animate={{
              textShadow: earningTimer.isActive 
                ? ["0 0 10px #00F0FF", "0 0 15px #36FF00", "0 0 10px #00F0FF"]
                : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {earningTimer.isActive ? formatTime(earningTimer.timeRemaining) : '06:00:00'}
          </motion.div>
        </div>

        {/* Enhanced Start button */}
        {!earningTimer.isActive && (
          <motion.button
            onClick={() => startEarningTimer(6 * 60 * 60)}
            className="mt-6 w-full max-w-sm mx-auto px-8 py-4 glass border border-[#00F0FF]/30 text-[#E6E6E6] font-bold rounded-2xl text-lg transition-all duration-300"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(0, 240, 255, 0.4)",
              borderColor: "rgba(0, 240, 255, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Activate WLFI</span>
            </div>
          </motion.button>
        )}

        {/* Status Indicator */}
        <motion.div 
          className="flex items-center justify-center space-x-2 text-sm"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-2 h-2 rounded-full ${earningTimer.isActive ? 'bg-[#36FF00]' : 'bg-[#E6E6E6]/40'}`} />
          <span className="text-[#E6E6E6]/80">
            {earningTimer.isActive ? 'Neural Networks Active' : 'WLFI Dormant'}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced User Balance Component
const UserBalance = () => {
  const { spaiPoints, agentTickets } = useStore();
  
  return (
    <motion.div 
      className="flex gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div 
        className="flex-1 glass border border-[#00F0FF]/20 rounded-2xl p-4 text-center relative overflow-hidden"
        whileHover={{ scale: 1.02, borderColor: "rgba(0, 240, 255, 0.4)" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/5 to-[#36FF00]/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative z-10">
          <div className="text-[#E6E6E6]/70 font-medium text-sm mb-1">WLFI Balance</div>
          <motion.div 
            className="text-[#00F0FF] font-bold text-2xl"
            animate={{ 
              textShadow: ["0 0 5px #00F0FF", "0 0 15px #00F0FF", "0 0 5px #00F0FF"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {spaiPoints.toLocaleString()}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex-1 glass border border-[#FFD500]/20 rounded-2xl p-4 text-center relative overflow-hidden"
        whileHover={{ scale: 1.02, borderColor: "rgba(255, 213, 0, 0.4)" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#FFD500]/5 to-[#FF4E00]/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <div className="relative z-10">
          <div className="text-[#E6E6E6]/70 font-medium text-sm mb-1">AI Licenses</div>
          <motion.div 
            className="text-[#FFD500] font-bold text-2xl"
            animate={{ 
              textShadow: ["0 0 5px #FFD500", "0 0 15px #FFD500", "0 0 5px #FFD500"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {agentTickets.toLocaleString()}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Social Task Component
const SocialTask = () => {
  const { addSpaiPoints, setTwitterFollowCompleted, tasks } = useStore();
  const [completed, setCompleted] = useState(tasks.followX.completed);
  const { hapticFeedback } = useTelegram();

  const handleJoinX = () => {
    if (!completed) {
      setCompleted(true);
      addSpaiPoints(1000);
      setTwitterFollowCompleted(true);
      hapticFeedback('success');
      window.open('https://x.com/aitradonx', '_blank');
    }
  };

  return (
    <motion.div 
      className="glass glass-p border border-[#36FF00]/20 rounded-2xl -mt-20 mb-6 relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#36FF00]/5 to-[#00F0FF]/5"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative z-10 p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 bg-[#0B0B0C] border border-[#E6E6E6]/20 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, borderColor: "rgba(54, 255, 0, 0.4)" }}
          >
            <svg className="w-6 h-6 text-[#E6E6E6]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </motion.div>
          <div>
            <h3 className="text-[#E6E6E6] font-semibold text-lg">Join WLFI Official</h3>
            <p className="text-[#E6E6E6]/70 text-xs">Follow on X for 1,000 WLFI Points</p>
          </div>
        </div>
        
        <motion.button
          onClick={handleJoinX}
          className={cn(
            'p-3 rounded-xl transition-all duration-300',
            completed 
              ? 'bg-[#36FF00]/20 text-[#36FF00] border border-[#36FF00]/40' 
              : 'bg-[#E6E6E6]/10 text-[#E6E6E6]/70 border border-[#E6E6E6]/20 hover:bg-[#E6E6E6]/20'
          )}
          disabled={completed}
          whileHover={{ scale: completed ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Enhanced Navigation Buttons Component
const NavigationButtons = ({ setActiveTab, earningTimer, startEarningTimer }) => {
  const { hapticFeedback } = useTelegram();
     
  const navItems = [
    { key: 'task', icon: GoTasklist, label: 'Tasks', color: '#36FF00' },
    { key: 'SPAI', icon: '/agent/agentlogo.png', label: 'WLFI AI', color: '#00F0FF', isImage: true },
    { key: 'invite', icon: BsPeople, label: 'Invite', color: '#FFD500' },
    { key: 'earn', icon: PiCoinsLight, label: 'Earn', color: '#FF4E00' }
  ];

  const handleNavClick = (tab) => {
    hapticFeedback('light');
    if (tab === 'earn') {
      startEarningTimer(6 * 60 * 60);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-4 gap-3 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, staggerChildren: 0.1 }}
    >
      {navItems.map((item, index) => (
        <motion.button
          key={item.key}
          onClick={() => handleNavClick(item.key)}
          disabled={item.key === 'earn' && earningTimer.isActive}
          className={cn(
            'transition-all duration-300',
            item.key === 'earn' && earningTimer.isActive ? 'opacity-50' : 'opacity-100'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="glass border border-[#E6E6E6]/20 rounded-2xl py-4 flex items-center justify-center relative overflow-hidden"
            whileHover={{ borderColor: `${item.color}40` }}
          >
            <motion.div 
              className="absolute inset-0 opacity-0 transition-opacity duration-300"
              style={{ background: `linear-gradient(45deg, ${item.color}10, transparent)` }}
              whileHover={{ opacity: 1 }}
            />
            {item.isImage ? (
              <Image src={item.icon} alt={item.label} width={60} height={60} className="relative z-10 scale-200 py-3" />
            ) : (
              <item.icon size={35} className="relative z-10 text-white" />
            )}
          </motion.div>
          <p className="text-[#E6E6E6]/80 text-sm font-medium mt-2">{item.label}</p>
        </motion.button>
      ))}
    </motion.div>
  );
};

// Debug Panel Component (unchanged)
const DebugPanel = ({ user, error, webApp }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 z-50 hidden">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-600 text-white p-2 rounded text-xs"
      >
        Debug
      </button>
      {showDebug && (
        <div className="absolute top-10 right-0 bg-black text-white p-4 rounded text-xs max-w-xs overflow-auto max-h-96">
          <h4 className="font-bold mb-2">Debug Info:</h4>
          <p><strong>User:</strong> {user ? '✅' : '❌'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>WebApp:</strong> {webApp ? '✅' : '❌'}</p>
          <p><strong>Platform:</strong> {webApp?.platform || 'Unknown'}</p>
          <p><strong>Version:</strong> {webApp?.version || 'Unknown'}</p>
          {user && (
            <div className="mt-2">
              <p><strong>User Data:</strong></p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Component
function TelegramMiniApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLoader, setShowLoader] = useState(true);
  
  const { 
    user, 
    loading: telegramLoading, 
    error: telegramError, 
    webApp,
    showAlert,
    hapticFeedback,
    retry: retryTelegram,
    loadFallbackUser
  } = useTelegram();
  
  const { 
    agentTickets, 
    useAgentTicket, 
    setUser, 
    earningTimer, 
    startEarningTimer 
  } = useStore();
  
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      console.log('✅ Setting user in store:', user);
      setUser(user);
    }
  }, [user, setUser]);

  const handleAgentAccess = useCallback(() => {
    if (agentTickets > 0) {
      useAgentTicket();
      setActiveTab('SPAI');
      hapticFeedback('success');
    } else {
      showAlert('You need at least 1 Agent Ticket to access the AI Agent.');
      hapticFeedback('error');
    }
  }, [agentTickets, useAgentTicket, showAlert, hapticFeedback]);

  const handleTabNavigation = useCallback((tab) => {
    console.log('Navigating to tab:', tab);
    setActiveTab(tab);
    hapticFeedback('light');
    router.push(`/?tab=${tab}`, { scroll: false });
  }, [router, hapticFeedback]);

  // Enhanced Top Navigation
  const TopNav = () => (
    <motion.div className="w-full flex justify-between items-center pb-6 px-1">
      <motion.div>
        <Image src="/logo.png" alt="WLFI" width={100} height={60} priority className='scale-150' />
      </motion.div>
      
      <motion.div 
        className="text-right"
      >
        <p className="text-[#E6E6E6]/60 text-sm">Welcome back</p>
        <motion.p 
          className="text-[#00F0FF] text-lg font-bold"
        >
          {user?.first_name || 'WLFI User'}
        </motion.p>
      </motion.div>
    </motion.div>
  );

  const renderHomeContent = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <NavigationButtons
        setActiveTab={handleTabNavigation}
        earningTimer={earningTimer}
        startEarningTimer={startEarningTimer}
      />
      {/* Enhanced Section Header */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#36FF00]" />
          <h2 className="text-[#E6E6E6] text-xl font-bold">Market Intelligence</h2>
        </div>
        <motion.button
          onClick={() => handleTabNavigation('dataCenter')}
          className="text-[#00F0FF] text-sm font-medium hover:text-[#36FF00] transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          View All →
        </motion.button>
      </motion.div>
      
      <DataCenterHome />
      <SocialTask />
      <EarningTimer />
      <UserBalance />
      <TradonCommunityCenter/>
      <div className="h-10" />
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'dataCenter':
        return <CoinAgent />;
      case 'SPAI':
        return <Agent />;
      case 'task':
        return <TaskCenter user={user} />;
      case 'invite':
        return <InviteCenter user={user} />;
      default:
        return renderHomeContent();
    }
  };

  if (showLoader || telegramLoading) {
    return <CustomLoader />;
  }

  if (telegramError && !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-4">
        <motion.div 
          className="text-center space-y-4 max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-[#FF4E00] mb-4">
            <h2 className="text-xl font-bold mb-2">Neural Connection Failed</h2>
            <p className="text-sm text-[#E6E6E6]/70">{telegramError}</p>
          </div>
          <div className="space-y-3">
            <motion.button
              onClick={retryTelegram}
              className="bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#00F0FF] px-6 py-3 rounded-xl block w-full transition-all"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 240, 255, 0.3)" }}
            >
              🔄 Retry Connection
            </motion.button>
            <motion.button
              onClick={loadFallbackUser}
              className="bg-[#E6E6E6]/10 border border-[#E6E6E6]/20 text-[#E6E6E6] px-6 py-3 rounded-xl block w-full transition-all"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(230, 230, 230, 0.2)" }}
            >
              🧪 Test Mode
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Suspense fallback={<CustomLoader />}>
      <div className="min-h-screen max-w-md w-full tektur mx-auto bg-[#0B0B0C] text-[#E6E6E6] flex flex-col items-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 via-transparent to-[#FF007C]/5 pointer-events-none" />
        
        <DebugPanel user={user} error={telegramError} webApp={webApp} />
        
        <div className="w-full relative z-10">
          <TopNav />
          <SearchParamsWrapper setActiveTab={setActiveTab} renderContent={renderContent} />
        </div>
        
        {/* Enhanced Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
          <BottomNav
            activeTab={activeTab}
            setActiveTab={handleTabNavigation}
            handleAgentAccess={handleAgentAccess}
          />
        </div>
      </div>
    </Suspense>
  );
}

// Component to handle useSearchParams (unchanged)
const SearchParamsWrapper = ({ setActiveTab, renderContent }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab') || 'home';
    setActiveTab(tab);
  }, [searchParams, setActiveTab]);

  return renderContent();
};

export default TelegramMiniApp;
