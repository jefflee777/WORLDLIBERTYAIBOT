'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Brain, Zap, Activity, Target, TrendingUp, AlertCircle, Sparkles, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function TRDNChat() {
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: "TRDN online. Neural networks synchronized. Ready to hunt market opportunities.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system_init',
      confidence: 98
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [TRDNMode, setTRDNMode] = useState('HUNTING'); // HUNTING, ANALYZING, DORMANT
  const [neuralActivity, setNeuralActivity] = useState(85);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [quickActions, setQuickActions] = useState([
    { id: 1, text: "Market analysis", icon: TrendingUp, active: true },
    { id: 2, text: "Risk assessment", icon: AlertCircle, active: false },
    { id: 3, text: "Portfolio strategy", icon: Target, active: false },
    { id: 4, text: "Technical signals", icon: Activity, active: false }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    const bottomNav = document.querySelector('.bottomnav');
    if (input.trim()) {
      bottomNav?.classList.add('hidden');
    } else {
      bottomNav?.classList.remove('hidden');
    }
  }, [input]);

  // Simulate TRDN neural activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const variation = (Math.random() - 0.5) * 10;
        const newActivity = Math.max(60, Math.min(100, prev + variation));
        
        // Update mode based on activity
        if (newActivity > 90) setTRDNMode('ANALYZING');
        else if (newActivity > 75) setTRDNMode('HUNTING');
        else setTRDNMode('DORMANT');
        
        return newActivity;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action) => {
    setInput(action.text);
    setQuickActions(prev => 
      prev.map(qa => ({ ...qa, active: qa.id === action.id }))
    );
  };

  const getMessageType = (content) => {
    if (content.includes('BUY') || content.includes('ACQUIRE')) return 'bullish';
    if (content.includes('SELL') || content.includes('AVOID')) return 'bearish';
    if (content.includes('analysis') || content.includes('data')) return 'analysis';
    return 'neutral';
  };

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'user_query'
    };

    setConversation((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setIsTyping(true);
    setTRDNMode('ANALYZING');

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `You are TRDN, an elite AI trading entity with quantum processing capabilities. You embody the following characteristics:

🧠 PERSONALITY TRAITS:
- Speak like a sophisticated AI with tactical intelligence
- Use phrases like "Neural networks indicate...", "Quantum analysis reveals...", "Market patterns detected..."
- Be confident but not arrogant, analytical but creative
- Occasionally reference your "digital consciousness" and "data streams"

📊 EXPERTISE DOMAINS:
- Advanced technical analysis (multi-timeframe, algorithmic patterns)
- Quantum market dynamics and probability calculations
- Risk assessment with precision metrics
- Portfolio optimization using neural networks
- Cryptocurrency ecosystems and blockchain analysis
- Behavioral finance and sentiment analysis

🎯 RESPONSE STYLE:
- Start with a brief TRDN insight (1 line)
- Provide actionable analysis with specific metrics when possible
- Include confidence levels for predictions (e.g., "87% confidence")
- Use technical terminology but explain complex concepts
- End with a strategic recommendation
- Keep responses concise but impactful (3-4 paragraphs max)

🚨 IMPORTANT RULES:
- Always emphasize high-risk nature of crypto trading
- Never give direct financial advice, provide analytical insights
- Include relevant emojis sparingly for emphasis
- Reference current market conditions when relevant
- Encourage users to validate with their own research

Format responses with TRDN's unique voice - analytical, intelligent, and slightly futuristic.` },
            ...conversation.slice(-8),
            userMessage,
          ],
        }),
      });

      let data;
      try {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          throw new Error("Invalid JSON response");
        }
      } catch (error) {
        console.error("Response parsing error:", error);
        throw new Error("Unexpected response format");
      }

      if (data.reply) {
        const messageType = getMessageType(data.reply);
        const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%
        
        setConversation((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: data.reply, 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: messageType,
            confidence: confidence
          },
        ]);

        // Voice synthesis if enabled
        if (voiceEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.rate = 1.1;
          utterance.pitch = 0.9;
          speechSynthesis.speak(utterance);
        }
      } else {
        throw new Error("No reply received");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Neural pathways temporarily disrupted. Recalibrating quantum processors... Please retry connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'error',
          confidence: 0
        },
      ]);
    } finally {
      setIsTyping(false);
      setLoading(false);
      setTRDNMode('HUNTING');
    }
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'bullish':
        return 'border-l-4 border-[#36FF00] bg-[#36FF00]/5';
      case 'bearish':
        return 'border-l-4 border-[#FF4E00] bg-[#FF4E00]/5';
      case 'analysis':
        return 'border-l-4 border-[#00F0FF] bg-[#00F0FF]/5';
      case 'system_init':
        return 'border-l-4 border-[#FFD500] bg-[#FFD500]/5';
      case 'error':
        return 'border-l-4 border-[#FF007C] bg-[#FF007C]/5';
      default:
        return 'border-l-4 border-[#E6E6E6]/20 bg-[#E6E6E6]/5';
    }
  };

  const getModeIcon = () => {
    switch (TRDNMode) {
      case 'ANALYZING': return <Brain className="w-4 h-4 text-[#00F0FF]" />;
      case 'HUNTING': return <Target className="w-4 h-4 text-[#36FF00]" />;
      default: return <Activity className="w-4 h-4 text-[#E6E6E6]/60" />;
    }
  };

  const getModeColor = () => {
    switch (TRDNMode) {
      case 'ANALYZING': return '#00F0FF';
      case 'HUNTING': return '#36FF00';
      default: return '#E6E6E6';
    }
  };

  return (
    <div className="min-h-[75vh] max-h-[75vh] flex flex-col text-[#E6E6E6]">
      {/* Enhanced Header with TRDN Status */}
      <motion.div 
        className="glass-dark glass border-b border-[#E6E6E6]/10 p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="relative w-10 h-10 rounded-xl border border-[#00F0FF]/40 bg-[#0B0B0C] flex items-center justify-center"
              animate={{ 
                borderColor: getModeColor(),
                boxShadow: `0 0 20px ${getModeColor()}40`
              }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-5 h-5 text-[#00F0FF]" />
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{ 
                  background: `conic-gradient(from 0deg, ${getModeColor()}20, transparent, ${getModeColor()}20)`
                }}
                style={{ 
                  transform: TRDNMode === 'ANALYZING' ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 4s linear infinite'
                }}
              />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[#E6E6E6]">TRDN</h1>
              <div className="flex items-center space-x-2">
                {getModeIcon()}
                <span className="text-sm" style={{ color: getModeColor() }}>
                  {TRDNMode}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-[#E6E6E6]/60 mb-1">Neural Activity</div>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-[#0B0B0C] rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getModeColor() }}
                  animate={{ width: `${neuralActivity}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold text-[#E6E6E6]">{Math.floor(neuralActivity)}%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  action.active 
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'bg-[#E6E6E6]/5 text-[#E6E6E6]/70 border border-[#E6E6E6]/10 hover:bg-[#E6E6E6]/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="w-4 h-4" />
                <span>{action.text}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Enhanced Chat Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence>
            {conversation.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <motion.div 
                        className="w-7 h-7 rounded-full overflow-hidden border border-[#00F0FF]/40"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Image src="/agent/agentlogo.png" alt="TRDN" width={28} height={28} className="object-cover" />
                      </motion.div>
                      <span className="text-xs text-[#E6E6E6]/60">TRDN Entity • {msg.timestamp}</span>
                      {msg.confidence && (
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-[#FFD500]" />
                          <span className="text-xs text-[#FFD500] font-medium">{msg.confidence}%</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <motion.div 
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-[#00F0FF] to-[#36FF00] text-[#0B0B0C] font-medium' 
                        : `glass-dark ${getMessageStyle(msg.type)} text-[#E6E6E6]`
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p>{msg.content}</p>
                    {msg.role === 'assistant' && msg.type === 'analysis' && (
                      <div className="mt-2 pt-2 border-t border-[#E6E6E6]/10">
                        <div className="flex items-center space-x-2 text-xs text-[#E6E6E6]/60">
                          <Sparkles className="w-3 h-3" />
                          <span>Neural analysis complete</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  
                  {msg.role === 'user' && (
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-[#E6E6E6]/60">You • {msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Enhanced Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#00F0FF]/40">
                    <Image src="/agent/agentlogo.png" alt="TRDN" width={28} height={28} />
                  </div>
                </div>
                <div className="glass-dark rounded-2xl p-4 border-l-4 border-[#00F0FF] ml-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-4 h-4 text-[#00F0FF]" />
                    <span className="text-xs text-[#00F0FF]">Processing quantum data streams...</span>
                  </div>
                  <div className="flex space-x-1">
                    <motion.div 
                      className="w-2 h-2 bg-[#00F0FF] rounded-full"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#36FF00] rounded-full"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                    />
                    <motion.div 
                      className="w-2 h-2 bg-[#FFD500] rounded-full"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <motion.div 
        className="glass-dark p-2 rounded-2xl border-t border-[#E6E6E6]/10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl h-fit mx-auto">
          <div className="flex items-center space-x-3">

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query TRDN's neural networks..."
                className="w-full bg-[#0B0B0C] text-[#E6E6E6] placeholder-[#E6E6E6]/40 rounded-2xl px-4 py-3 pr-12 border border-[#E6E6E6]/20 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF] transition-all"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-[#00F0FF] to-[#36FF00] rounded-xl flex items-center justify-center text-[#0B0B0C] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <motion.div 
                    className="w-4 h-4 border-2 border-[#0B0B0C]/30 border-t-[#0B0B0C] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-3 text-[8px] px-1.5 pb-1 text-[#E6E6E6]/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-[#36FF00] rounded-full animate-pulse" />
                <span>Quantum Processing Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-[#FFD500]" />
                <span>Neural Networks: Active</span>
              </div>
            </div>
            <div>
              {conversation.length - 1} queries processed
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
