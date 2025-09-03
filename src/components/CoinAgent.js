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
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink
} from 'lucide-react';

export default function WLFIOptimizedAgent() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [watchlist, setWatchlist] = useState(new Set());
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Load saved watchlist
  useEffect(() => {
    const saved = localStorage.getItem('wlfi-watchlist');
    if (saved) setWatchlist(new Set(JSON.parse(saved)));
  }, []);

  // Save watchlist
  useEffect(() => {
    localStorage.setItem('wlfi-watchlist', JSON.stringify([...watchlist]));
  }, [watchlist]);

  // Fetch top 10 coins + WLFI
  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h'
        );
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        // Create WLFI special card
        const wlfiCard = {
          id: 'wlfi',
          symbol: 'wlfi',
          name: 'World Liberty AI',
          image: 'https://via.placeholder.com/64/e7ac08/171412?text=WLFI',
          current_price: null,
          market_cap: null,
          market_cap_rank: null,
          price_change_percentage_24h: null,
          isComingSoon: true,
          maxSupply: '1,000,000,000',
          status: 'Pre-Launch',
          description: 'Revolutionary AI-powered financial intelligence platform launching soon. Join our community for exclusive updates!'
        };

        const allCoins = [wlfiCard, ...data];
        setCoins(allCoins);
        setFilteredCoins(allCoins);
        
        // Start AI analysis for real coins only
        data.slice(0, 5).forEach((coin, index) => {
          setTimeout(() => getAIAnalysis(coin), index * 1000);
        });
        
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCoins(coins);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCoins(
        coins.filter(coin => 
          coin.name.toLowerCase().includes(query) || 
          coin.symbol.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, coins]);

  const getAIAnalysis = async (coin) => {
    const coinKey = coin.symbol.toUpperCase();
    setAnalysisLoading(prev => ({ ...prev, [coinKey]: true }));
    
    try {
      const systemPrompt = `You are WLFI AI. Analyze ${coin.name} (${coin.symbol}) at $${coin.current_price}.
      
      Respond with:
      VERDICT: [ACCUMULATE/MONITOR/DIVEST]
      CONFIDENCE: [75/100 format]
      THESIS: [Sharp insight - max 10 words]
      WLFI_SCORE: [1-100 rating]`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze ${coin.name} at current price` }
          ]
        })
      });

      const data = await response.json();
      
      if (data.reply) {
        const reply = data.reply;
        const verdict = reply.match(/VERDICT:\s*(ACCUMULATE|MONITOR|DIVEST)/i)?.[1] || 'MONITOR';
        const confidence = parseInt(reply.match(/CONFIDENCE:\s*(\d+)\/100/i)?.[1]) || 75;
        const thesis = reply.match(/THESIS:\s*(.+)/i)?.[1]?.trim() || 'Market analysis pending';
        const wlfiScore = parseInt(reply.match(/WLFI_SCORE:\s*(\d+)/i)?.[1]) || 70;
        
        setAiAnalysis(prev => ({
          ...prev,
          [coinKey]: { verdict, confidence, thesis, wlfiScore, timestamp: Date.now() }
        }));
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
    } finally {
      setAnalysisLoading(prev => ({ ...prev, [coinKey]: false }));
    }
  };

  const toggleWatchlist = (coinId) => {
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(coinId)) {
        newSet.delete(coinId);
      } else {
        newSet.add(coinId);
      }
      return newSet;
    });
  };

  const toggleExpanded = (coinKey) => {
    setExpandedCards(prev => ({
      ...prev,
      [coinKey]: !prev[coinKey]
    }));
  };

  const openCoinChat = (coin) => {
    setSelectedCoin(coin);
    setChatMessages([
      {
        role: 'assistant',
        content: coin.isComingSoon 
          ? `🚀 ${coin.name} is launching soon! \n\nJoin our community on X for exclusive updates and early access information.`
          : `🧠 WLFI AI Analysis: ${coin.name} (${coin.symbol.toUpperCase()})\n\nCurrent Price: $${coin.current_price?.toFixed(4)}\n24h Change: ${coin.price_change_percentage_24h?.toFixed(2)}%\n\nWhat would you like to know about ${coin.name}?`,
        timestamp: Date.now()
      }
    ]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: 'user', content: chatInput, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: `You are WLFI AI assistant. Provide concise, helpful analysis about ${selectedCoin.name}. Be professional and engaging.` 
            },
            ...chatMessages.slice(-4),
            userMessage
          ]
        })
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
        content: "⚠️ I'm experiencing technical difficulties. Please try again later.",
        timestamp: Date.now()
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return price >= 1000 ? `$${(price/1000).toFixed(2)}K` : `$${price.toFixed(4)}`;
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return 'N/A';
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'ACCUMULATE': return 'text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/30';
      case 'DIVEST': return 'text-[#f87171] bg-[#f87171]/10 border-[#f87171]/30';
      default: return 'text-[#fdd949] bg-[#fdd949]/10 border-[#fdd949]/30';
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="min-h-screen text-[#fafaf9] pb-28">
      {/* Search Bar */}
      <motion.div 
        className="glass glass-p glass-edges mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-content">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#e7ac08]" />
            <input
              type="text"
              placeholder="Search coins by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#171412]/50 border border-[#44403c]/40 rounded-xl text-[#fafaf9] placeholder-[#aaa29d] focus:outline-none focus:ring-2 focus:ring-[#e7ac08]/50 focus:border-[#e7ac08]/60 transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div 
            className="w-12 h-12 border-2 border-[#e7ac08]/30 border-t-[#e7ac08] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#e7ac08] mt-4 text-lg font-medium">
            Loading top cryptocurrencies...
          </p>
        </div>
      )}

      {/* Coins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredCoins.map((coin, index) => {
            const coinKey = coin.symbol.toUpperCase();
            const analysis = aiAnalysis[coinKey];
            const isAnalysisLoading = analysisLoading[coinKey];
            const isExpanded = expandedCards[coinKey];
            const isWatched = watchlist.has(coin.id);
            
            return (
              <motion.div
                key={coin.id}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -5 }}
              >
                <div className={`glass glass-edges glass-p glass-particles h-full ${
                  coin.isComingSoon ? 'border-[#e7ac08]/60' : ''
                }`}>
                  <div className="glass-content">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                            <img 
                              src={coin.image} 
                              alt={coin.name} 
                              className=" rounded-full"
                              onError={(e) => {
                                e.target.src = `/logo.png`
                              }}
                            />
                          </div>
                          {coin.market_cap_rank <= 10 && !coin.isComingSoon && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#fdd949] text-[#171412] text-xs font-bold rounded-full flex items-center justify-center">
                              {coin.market_cap_rank}
                            </div>
                          )}
                          {coin.isComingSoon && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#e7ac08] text-[#171412] text-xs font-bold rounded-full flex items-center justify-center">
                              🚀
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-[#fafaf9]">
                              {coin.symbol?.toUpperCase()}
                            </h2>
                            {analysis?.wlfiScore >= 85 && (
                              <Star className="w-4 h-4 text-[#fdd949] fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-[#aaa29d] line-clamp-1">{coin.name}</p>
                        </div>
                      </div>

                      {!coin.isComingSoon && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(coin.id);
                          }}
                          className="p-2 rounded-lg border border-[#44403c]/30 hover:border-[#fdd949]/60 transition-colors"
                          whileTap={{ scale: 0.95 }}
                        >
                          <Bookmark 
                            className={`w-4 h-4 ${isWatched ? 'text-[#fdd949] fill-current' : 'text-[#aaa29d]'}`}
                          />
                        </motion.button>
                      )}
                    </div>

                    {/* WLFI Coming Soon Content */}
                    {coin.isComingSoon ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#e7ac08] mb-2">COMING SOON</div>
                          <h3 className="text-xl font-bold text-[#fafaf9] mb-2">World Liberty AI</h3>
                          <h4 className="text-lg font-semibold text-[#fdd949] mb-4">WLFI</h4>
                        </div>
                        
                        <p className="text-[#d7d3d0] leading-relaxed text-center">
                          {coin.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-[#171412]/40 rounded-lg border border-[#44403c]/20">
                            <span className="text-[#aaa29d]">Max Supply:</span>
                            <span className="text-[#fafaf9] font-semibold">{coin.maxSupply} WLFI</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-[#171412]/40 rounded-lg border border-[#44403c]/20">
                            <span className="text-[#aaa29d]">Status:</span>
                            <span className="text-[#fdd949] font-semibold">{coin.status}</span>
                          </div>
                        </div>
                        
                        <motion.a
                          href="https://twitter.com/worldlibertyai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button w-full py-3 flex items-center justify-center gap-2 font-bold"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Join WLFI on X
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
                      </div>
                    ) : (
                      /* Regular Coin Content */
                      <>
                        {/* Price Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold text-[#fdd949]">
                              {formatPrice(coin.current_price)}
                            </div>
                            {coin.price_change_percentage_24h !== null && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold ${
                                coin.price_change_percentage_24h >= 0 
                                  ? 'text-[#4ade80] bg-[#4ade80]/10' 
                                  : 'text-[#f87171] bg-[#f87171]/10'
                              }`}>
                                {coin.price_change_percentage_24h >= 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                {formatChange(coin.price_change_percentage_24h)}
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-[#aaa29d]">Market Cap</span>
                              <div className="text-[#fafaf9] font-semibold">
                                {coin.market_cap ? `$${(coin.market_cap / 1e9).toFixed(2)}B` : 'N/A'}
                              </div>
                            </div>
                            <div>
                              <span className="text-[#aaa29d]">Rank</span>
                              <div className="text-[#fafaf9] font-semibold">#{coin.market_cap_rank}</div>
                            </div>
                          </div>
                        </div>

                        {/* AI Analysis */}
                        <div className="border-t border-[#44403c]/30 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#e7ac08]" />
                              <span className="text-sm font-medium text-[#e7ac08]">WLFI AI</span>
                            </div>
                            
                            <motion.button
                              onClick={() => toggleExpanded(coinKey)}
                              className="flex items-center gap-1 text-xs text-[#aaa29d] hover:text-[#e7ac08] transition-colors"
                              whileHover={{ scale: 1.05 }}
                            >
                              {isExpanded ? (
                                <>
                                  <span>Less</span>
                                  <ChevronUp className="w-4 h-4" />
                                </>
                              ) : (
                                <>
                                  <span>More</span>
                                  <ChevronDown className="w-4 h-4" />
                                </>
                              )}
                            </motion.button>
                          </div>
                          
                          {isAnalysisLoading ? (
                            <motion.div 
                              className="flex items-center gap-2 py-3"
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Activity className="w-4 h-4 text-[#e7ac08]" />
                              <span className="text-sm text-[#e7ac08]">Analyzing...</span>
                            </motion.div>
                          ) : analysis ? (
                            <motion.div 
                              className="space-y-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getVerdictStyle(analysis.verdict)}`}>
                                  <Target className="w-4 h-4" />
                                  {analysis.verdict}
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-sm font-bold text-[#fafaf9]">{analysis.wlfiScore}/100</div>
                                  <div className="text-xs text-[#aaa29d]">WLFI Score</div>
                                </div>
                              </div>
                              
                              <div className="glass glass-light p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Eye className="w-4 h-4 text-[#e7ac08] mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-[#fafaf9] italic">"{analysis.thesis}"</p>
                                </div>
                              </div>

                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#aaa29d]">Confidence</span>
                                    <span className="font-bold text-[#fafaf9]">{analysis.confidence}%</span>
                                  </div>
                                  <div className="w-full bg-[#171412]/30 rounded-full h-2">
                                    <motion.div 
                                      className="h-full rounded-full bg-[#e7ac08]"
                                      initial={{ width: '0%' }}
                                      animate={{ width: `${analysis.confidence}%` }}
                                      transition={{ duration: 1 }}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            <div className="text-sm text-[#aaa29d] italic py-2">
                              Awaiting WLFI AI analysis...
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
                            Chat with WLFI AI
                          </motion.button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty Search State */}
      {!loading && filteredCoins.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-[#aaa29d] mx-auto mb-4 opacity-50" />
          <p className="text-[#aaa29d] text-xl">No coins found</p>
          <p className="text-[#aaa29d] text-sm mt-2">Try adjusting your search query</p>
        </div>
      )}

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
                      <h3 className="text-xl font-bold text-[#fafaf9]">
                        Chat about {selectedCoin.name}
                      </h3>
                      <p className="text-sm text-[#aaa29d]">
                        {selectedCoin.symbol.toUpperCase()} {!selectedCoin.isComingSoon && `• ${formatPrice(selectedCoin.current_price)}`}
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
                          <span className="text-[#aaa29d] text-sm ml-2">WLFI AI is thinking...</span>
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
