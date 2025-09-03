'use client'

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Activity, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX,
  Bell,
  Eye,
  BarChart3,
  Clock,
  RefreshCw,
  Star,
  Settings
} from 'lucide-react';

export default function WLFIMobileAgent() {
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: "WLFI AI Core Agent online. Neural networks synchronized with global markets. Ready for elite financial intelligence.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system_init',
      confidence: 98
    }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [wlfiMode, setWlfiMode] = useState('HUNTING');
  const [neuralActivity, setNeuralActivity] = useState(92);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [marketData, setMarketData] = useState({});

  const [quickActions] = useState([
    { id: 1, text: "Market overview", icon: BarChart3 },
    { id: 2, text: "Whale movements", icon: Eye },
    { id: 3, text: "Price predictions", icon: TrendingUp },
    { id: 4, text: "Risk analysis", icon: AlertCircle },
    { id: 5, text: "Compare WLFI vs BTC", icon: Star }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll and activity simulation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const variation = (Math.random() - 0.5) * 12;
        const newActivity = Math.max(75, Math.min(100, prev + variation));
        
        if (newActivity > 92) setWlfiMode('ANALYZING');
        else if (newActivity > 80) setWlfiMode('HUNTING');
        else setWlfiMode('STANDBY');
        
        return newActivity;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Market data simulation
  useEffect(() => {
    const fetchData = () => {
      setMarketData({
        btc: { price: 45250 + Math.random() * 1000, change: (Math.random() - 0.5) * 6 },
        eth: { price: 2850 + Math.random() * 200, change: (Math.random() - 0.5) * 8 }
      });
    };
    
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action) => {
    setInput(action.text);
  };

  const getMessageType = (content) => {
    const lower = content.toLowerCase();
    if (lower.includes('bullish') || lower.includes('accumulate') || lower.includes('buy')) return 'bullish';
    if (lower.includes('bearish') || lower.includes('sell') || lower.includes('avoid')) return 'bearish';
    if (lower.includes('alert') || lower.includes('warning')) return 'alert';
    if (lower.includes('analysis') || lower.includes('data')) return 'analysis';
    return 'neutral';
  };

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    setWlfiMode('ANALYZING');

    try {
      const systemPrompt = `You are WLFI AI, World Liberty AI's elite financial intelligence system. 

Key characteristics:
- Provide clear, actionable crypto insights
- Use simple language without markdown formatting
- Include specific metrics when possible
- Reference current market conditions
- Emphasize WLFI's revolutionary approach
- Keep responses concise (3-4 sentences max)
- Always mention risks in crypto trading

Current market context:
${marketData.btc ? `- Bitcoin: $${marketData.btc.price.toLocaleString()} (${marketData.btc.change > 0 ? '+' : ''}${marketData.btc.change.toFixed(2)}%)` : ''}
${marketData.eth ? `- Ethereum: $${marketData.eth.price.toLocaleString()} (${marketData.eth.change > 0 ? '+' : ''}${marketData.eth.change.toFixed(2)}%)` : ''}

Respond with intelligence and confidence, using emojis sparingly for emphasis.`;

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...conversation.slice(-8),
            userMessage,
          ],
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const messageType = getMessageType(data.reply);
        const confidence = Math.floor(Math.random() * 15) + 80;
        
        // Clean response of markdown
        const cleanContent = data.reply
          .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
          .replace(/\*(.*?)\*/g, '$1')      // Remove italics
          .replace(/#{1,6}\s/g, '')         // Remove headers
          .replace(/`(.*?)`/g, '$1')        // Remove code
          .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links
        
        setConversation(prev => [...prev, {
          role: "assistant", 
          content: cleanContent, 
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: messageType,
          confidence: confidence
        }]);

        // Voice synthesis
        if (voiceEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(cleanContent);
          utterance.rate = 1.0;
          utterance.pitch = 0.8;
          speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      setConversation(prev => [...prev, {
        role: "assistant",
        content: "Connection error. WLFI AI neural pathways temporarily disrupted. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'error'
      }]);
    } finally {
      setIsTyping(false);
      setLoading(false);
      setWlfiMode('HUNTING');
    }
  };

  const getModeColor = () => {
    switch (wlfiMode) {
      case 'ANALYZING': return '#e7ac08';
      case 'HUNTING': return '#4ade80';
      default: return '#aaa29d';
    }
  };

  const getMessageBg = (type) => {
    switch (type) {
      case 'bullish': return 'bg-green-500/10 border-l-4 border-green-500';
      case 'bearish': return 'bg-red-500/10 border-l-4 border-red-500';
      case 'alert': return 'bg-yellow-500/10 border-l-4 border-yellow-500';
      case 'analysis': return 'bg-blue-500/10 border-l-4 border-blue-500';
      case 'system_init': return 'bg-[#e7ac08]/10 border-l-4 border-[#e7ac08]';
      default: return 'bg-gray-500/10 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#171412] text-[#fafaf9] overflow-hidden">
      
      {/* Mobile Header */}
      <motion.div 
        className="glass glass-edges px-4 py-3 border-b border-[#44403c]/30"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="glass-content">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e7ac08] to-[#fdd949] flex items-center justify-center"
                animate={{ 
                  boxShadow: `0 0 15px ${getModeColor()}40`
                }}
              >
                <Brain className="w-5 h-5 text-[#171412]" />
              </motion.div>
              
              <div>
                <h1 className="text-lg font-bold text-[#e7ac08]">WLFI AI</h1>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                  <span style={{ color: getModeColor() }}>{wlfiMode}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  voiceEnabled ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-[#44403c]/30 text-[#aaa29d]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  alertsEnabled ? 'bg-[#fdd949]/20 text-[#fdd949]' : 'bg-[#44403c]/30 text-[#aaa29d]'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {/* Activity Bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-[#e7ac08]" />
              <span className="text-[#aaa29d]">Neural Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-[#44403c]/30 rounded-full h-1.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getModeColor() }}
                  animate={{ width: `${neuralActivity}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-[#fafaf9] font-medium">{Math.floor(neuralActivity)}%</span>
            </div>
          </div>

          {/* Market Data */}
          {marketData.btc && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="p-2 bg-[#171412]/40 rounded-lg text-center">
                <div className="text-xs text-[#aaa29d]">BTC</div>
                <div className="text-sm font-bold">${(marketData.btc.price / 1000).toFixed(1)}K</div>
                <div className={`text-xs ${marketData.btc.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {marketData.btc.change >= 0 ? '+' : ''}{marketData.btc.change.toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-[#171412]/40 rounded-lg text-center">
                <div className="text-xs text-[#aaa29d]">ETH</div>
                <div className="text-sm font-bold">${marketData.eth.price.toLocaleString()}</div>
                <div className={`text-xs ${marketData.eth.change >= 0 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                  {marketData.eth.change >= 0 ? '+' : ''}{marketData.eth.change.toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-[#e7ac08]/10 rounded-lg text-center">
                <div className="text-xs text-[#e7ac08]">WLFI</div>
                <div className="text-sm font-bold text-[#fdd949]">Soon</div>
                <div className="text-xs text-[#e7ac08]">Launch</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-b border-[#44403c]/20">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-2 px-3 py-2 bg-[#171412]/40 border border-[#44403c]/30 rounded-lg text-xs font-medium whitespace-nowrap text-[#aaa29d] hover:text-[#fafaf9] hover:border-[#e7ac08]/40 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-3 h-3" />
                {action.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {conversation.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e7ac08] to-[#fdd949] flex items-center justify-center">
                      <Brain className="w-3 h-3 text-[#171412]" />
                    </div>
                    <span className="text-xs text-[#aaa29d]">WLFI AI • {msg.timestamp}</span>
                    {msg.confidence && (
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#fdd949]" />
                        <span className="text-xs text-[#fdd949]">{msg.confidence}%</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'glass-button text-[#171412]' 
                    : `glass glass-light ${getMessageBg(msg.type)} text-[#fafaf9]`
                }`}>
                  {msg.content}
                </div>
                
                {msg.role === 'user' && (
                  <div className="text-right mt-1">
                    <span className="text-xs text-[#aaa29d]">You • {msg.timestamp}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#e7ac08] to-[#fdd949] flex items-center justify-center">
                    <Brain className="w-3 h-3 text-[#171412]" />
                  </div>
                  <span className="text-xs text-[#aaa29d]">WLFI AI analyzing...</span>
                </div>
                <div className="glass glass-light rounded-2xl px-4 py-3 border-l-4 border-[#e7ac08] ml-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#e7ac08]" />
                    <span className="text-xs text-[#e7ac08]">Processing quantum data...</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div 
                        key={i}
                        className="w-2 h-2 bg-[#e7ac08] rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Mobile Input */}
      <motion.div 
        className="glass glass-edges border-t border-[#44403c]/30 p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="glass-content">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask WLFI AI anything..."
                className="w-full bg-[#171412]/60 text-[#fafaf9] placeholder-[#aaa29d] rounded-2xl px-4 py-3 pr-12 border border-[#44403c]/40 focus:outline-none focus:ring-2 focus:ring-[#e7ac08]/50 focus:border-[#e7ac08] transition-all text-sm"
                disabled={loading}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[#e7ac08] to-[#fdd949] rounded-xl flex items-center justify-center text-[#171412] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? (
                  <motion.div 
                    className="w-4 h-4 border-2 border-[#171412]/30 border-t-[#171412] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </form>

          {/* Status */}
          <div className="flex items-center justify-between mt-2 text-xs text-[#aaa29d]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
              <span>WLFI Neural Network Online</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-[#e7ac08]" />
              <span>World Liberty AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
