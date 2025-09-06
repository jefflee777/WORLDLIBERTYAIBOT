'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  Eye, 
  Bookmark,
  MessageCircle,
  Send,
  X,
  Sparkles
} from 'lucide-react';

export default function DataCenter() {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [watchlist, setWatchlist] = useState(new Set());
  const [priceHistory, setPriceHistory] = useState({});
  const [activeSignals, setActiveSignals] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchCoins() {
      try {
        setLoading(true);
        const response = await fetch('/api/coins');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch coin data');
        }

        if (isMounted) {
          setCoins(data);
          setError(null);
          
          const initialPrices = {};
          data.forEach(coin => {
            initialPrices[coin.symbol] = parseFloat(coin.priceUsd);
          });
          setPriceHistory(initialPrices);
          
          data.forEach((coin, index) => {
            setTimeout(() => getAIAnalysis(coin), index * 600);
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCoins();

    const interval = setInterval(() => {
      if (coins.length > 0) {
        const randomCoin = coins[Math.floor(Math.random() * coins.length)];
        const variation = (Math.random() - 0.5) * 0.03;
        const newPrice = parseFloat(randomCoin.priceUsd) * (1 + variation);
        
        setPriceHistory(prev => ({
          ...prev,
          [`${randomCoin.symbol}_live`]: newPrice
        }));
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [coins.length]);

  const getAIAnalysis = async (coin) => {
    const coinKey = coin.symbol.toUpperCase();
    
    setAnalysisLoading(prev => ({ ...prev, [coinKey]: true }));
    
    try {
      const systemPrompt = `You are WLFIAI. Analyze ${coin.name} (${coin.symbol}) at $${coin.priceUsd} with ${coin.changePercent24Hr}% change.
      
      Respond exactly as:
      ACTION: [ACCUMULATE/MONITOR/DIVEST]
      THESIS: [One sharp insight - max 10 words]
      TIMELINE: [SHORT/MEDIUM/LONG]
      CONVICTION: [X.X/10]`;

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Analyze ${coin.name} with current data` 
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.reply) {
        const reply = data.reply;
        const actionMatch = reply.match(/ACTION:\s*(ACCUMULATE|MONITOR|DIVEST)/i);
        const thesisMatch = reply.match(/THESIS:\s*(.+)/i);
        const timelineMatch = reply.match(/TIMELINE:\s*(SHORT|MEDIUM|LONG)/i);
        const convictionMatch = reply.match(/CONVICTION:\s*(\d+\.?\d*)\/10/i);
        
        const action = actionMatch ? actionMatch[1].toUpperCase() : 'MONITOR';
        const thesis = thesisMatch ? thesisMatch[1].trim() : 'Market analysis pending';
        const timeline = timelineMatch ? timelineMatch[1].toUpperCase() : 'MEDIUM';
        const conviction = convictionMatch ? parseFloat(convictionMatch[1]) : 7.5;
        
        setAiAnalysis(prev => ({
          ...prev,
          [coinKey]: {
            action,
            thesis,
            timeline,
            conviction,
            timestamp: Date.now()
          }
        }));

        if (action === 'ACCUMULATE') {
          setActiveSignals(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis(prev => ({
        ...prev,
        [coinKey]: {
          action: 'MONITOR',
          thesis: 'Analysis temporarily unavailable',
          timeline: 'MEDIUM',
          conviction: 5.0,
          timestamp: Date.now()
        }
      }));
    } finally {
      setAnalysisLoading(prev => ({ ...prev, [coinKey]: false }));
    }
  };

  const toggleWatchlist = (coinSymbol) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(coinSymbol)) {
        newWatchlist.delete(coinSymbol);
      } else {
        newWatchlist.add(coinSymbol);
      }
      return newWatchlist;
    });
  };

  const openCoinChat = (coin) => {
    setSelectedCoin(coin);
    setChatMessages([
      {
        role: 'assistant',
        content: `🧠 **WLFIAI Analysis**: ${coin.name} (${coin.symbol.toUpperCase()})
        
**Current Price**: $${parseFloat(coin.priceUsd).toFixed(4)}
**24h Change**: ${parseFloat(coin.changePercent24Hr).toFixed(2)}%
**Market Rank**: #${coin.rank}

What would you like to know about ${coin.name}?`,
        timestamp: Date.now()
      }
    ]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      role: 'user',
      content: chatInput,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are WLFIAI analyzing ${selectedCoin.name}. Be concise and helpful.`
            },
            ...chatMessages.slice(-5),
            userMessage
          ],
        }),
      });

      const data = await response.json();
      
      if (data.reply) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ Technical error. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'ACCUMULATE':
        return <Target className="w-4 h-4" />;
      case 'MONITOR':
        return <Eye className="w-4 h-4" />;
      case 'DIVEST':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionStyle = (action) => {
    switch (action) {
      case 'ACCUMULATE':
        return 'text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/20';
      case 'MONITOR':
        return 'text-[#fdd949] bg-[#fdd949]/10 border-[#fdd949]/20';
      case 'DIVEST':
        return 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/20';
      default:
        return 'text-[#e7ac08] bg-[#e7ac08]/10 border-[#e7ac08]/20';
    }
  };

  const getTimelineColor = (timeline) => {
    switch (timeline) {
      case 'SHORT': return '#f87171';
      case 'MEDIUM': return '#fdd949';
      case 'LONG': return '#4ade80';
      default: return '#e7ac08';
    }
  };

  const formatPrice = (price) => {
    if (price >= 1000) return `$${(price/1000).toFixed(2)}K`;
    if (price >= 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getPriceMovement = (coin) => {
    const livePrice = priceHistory[`${coin.symbol}_live`];
    const originalPrice = priceHistory[coin.symbol];
    if (livePrice && originalPrice) {
      return ((livePrice - originalPrice) / originalPrice) * 100;
    }
    return 0;
  };

  return (
    <div className="text-[#fafaf9] min-h-screen">
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div 
            className="w-12 h-12 border-2 border-[#e7ac08]/30 border-t-[#e7ac08] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#e7ac08] mt-4 text-sm font-medium">
            Initializing WLFIAI systems...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <AnimatePresence>
          {coins.map((coin, index) => {
            const coinKey = coin.symbol.toUpperCase();
            const analysis = aiAnalysis[coinKey];
            const isAnalysisLoading = analysisLoading[coinKey];
            const isWatched = watchlist.has(coin.symbol);
            const priceMovement = getPriceMovement(coin);
            const livePrice = priceHistory[`${coin.symbol}_live`] || parseFloat(coin.priceUsd);
            
            return (
              <motion.div
                key={coin.symbol}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                }}
                whileHover={{ y: -5 }}
              >
                <div className="glass glass-edges glass-particles relative h-full">
                  
                  {/* Price Movement Indicator */}
                  {Math.abs(priceMovement) > 0.01 && (
                    <motion.div
                      className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${
                        priceMovement > 0 ? 'bg-[#4ade80]' : 'bg-[#f87171]'
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  <div className="glass-content">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-[#171412] border border-[#44403c]/30 rounded-xl overflow-hidden flex items-center justify-center">
                            {coin.image ? (
                              <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                            ) : (
                              <span className="text-lg font-bold text-[#e7ac08]">
                                {coin.symbol?.charAt(0)}
                              </span>
                            )}
                          </div>
                          {coin.rank <= 10 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#fdd949] text-[#171412] text-xs font-bold rounded-full flex items-center justify-center">
                              {coin.rank}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-[#ffffff] group-hover:text-[#fdd949] transition-colors">
                            {coin.symbol?.toUpperCase()}
                          </h3>
                          <p className="text-sm text-[#aaa29d] line-clamp-1">{coin.name}</p>
                        </div>
                      </div>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(coin.symbol);
                        }}
                        className="p-2 rounded-lg border border-[#44403c]/30 hover:border-[#fdd949]/60 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bookmark 
                          className={`w-5 h-5 ${isWatched ? 'text-[#fdd949] fill-current' : 'text-[#aaa29d]'}`}
                        />
                      </motion.button>
                    </div>

                    {/* Price Section */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-[#fdd949]">
                          {formatPrice(livePrice)}
                        </div>
                        {coin.changePercent24Hr && (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${
                            coin.changePercent24Hr >= 0 
                              ? 'text-[#4ade80] bg-[#4ade80]/10' 
                              : 'text-[#f87171] bg-[#f87171]/10'
                          }`}>
                            {coin.changePercent24Hr >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {formatChange(coin.changePercent24Hr)}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#aaa29d]">Market Cap</span>
                          <div className="text-[#ffffff] font-semibold">
                            {coin.marketCapUsd ? `$${(parseFloat(coin.marketCapUsd) / 1e9).toFixed(2)}B` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#aaa29d]">Rank</span>
                          <div className="text-[#ffffff] font-semibold">#{coin.rank}</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="border-t border-[#44403c]/30 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#e7ac08]" />
                          <span className="text-sm font-medium text-[#e7ac08]">WLFIAI</span>
                        </div>
                        
                        {analysis && (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getTimelineColor(analysis.timeline) }}
                            />
                            <span className="text-xs text-[#aaa29d]">{analysis.timeline}</span>
                          </div>
                        )}
                      </div>
                      
                      {isAnalysisLoading ? (
                        <div className="flex items-center gap-2 py-3">
                          <div className="w-full h-2 bg-[#44403c]/20 rounded-full overflow-hidden">
                            <motion.div
                              className="w-1/3 h-full bg-[#e7ac08] rounded-full"
                              animate={{ x: ['-100%', '300%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                          <span className="text-xs text-[#e7ac08]">Analyzing...</span>
                        </div>
                      ) : analysis ? (
                        <motion.div 
                          className="space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getActionStyle(analysis.action)}`}>
                              {getActionIcon(analysis.action)}
                              {analysis.action}
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#ffffff]">
                                {analysis.conviction}/10
                              </div>
                              <div className="text-xs text-[#aaa29d]">Confidence</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-[#d7d3d0] italic leading-relaxed">
                            "{analysis.thesis}"
                          </p>
                        </motion.div>
                      ) : (
                        <div className="text-sm text-[#aaa29d] py-2">
                          Awaiting AI analysis...
                        </div>
                      )}
                      
                      {/* Chat Button */}
                      <motion.button
                        onClick={() => openCoinChat(coin)}
                        className="glass-button w-full mt-4 flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat with AI
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedCoin && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCoin(null)}
          >
            <motion.div
              className="glass glass-dark max-w-2xl w-full max-h-[80vh] flex flex-col"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-content">
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#44403c]/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#171412] border border-[#e7ac08]/30 rounded-xl overflow-hidden flex items-center justify-center">
                      <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#ffffff]">
                        Chat about {selectedCoin.name}
                      </h3>
                      <p className="text-sm text-[#aaa29d]">
                        {selectedCoin.symbol.toUpperCase()} • {formatPrice(parseFloat(selectedCoin.priceUsd))}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCoin(null)}
                    className="p-2 rounded-lg hover:bg-[#44403c]/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#aaa29d]" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === 'user' 
                          ? 'glass-button' 
                          : 'glass glass-light'
                      }`}>
                        <div className="whitespace-pre-line leading-relaxed text-sm glass-content">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="glass glass-light p-4 rounded-2xl">
                        <div className="flex items-center gap-2 glass-content">
                          <div className="w-2 h-2 bg-[#e7ac08] rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-[#e7ac08] rounded-full animate-pulse delay-100" />
                          <div className="w-2 h-2 bg-[#e7ac08] rounded-full animate-pulse delay-200" />
                          <span className="text-[#aaa29d] text-sm ml-2">WLFIAI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChatMessage();
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about ${selectedCoin.name}...`}
                    className="flex-1 p-3 bg-[#171412]/50 border border-[#44403c]/40 rounded-xl text-[#fafaf9] placeholder-[#aaa29d] focus:outline-none focus:ring-2 focus:ring-[#e7ac08]/50 focus:border-[#e7ac08]/60 transition-all duration-300"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="glass-button px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
