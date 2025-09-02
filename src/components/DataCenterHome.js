'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Brain, AlertCircle, CheckCircle, XCircle, Zap, Activity, Target, Eye, BarChart3, Clock, Star, Bookmark } from 'lucide-react';
import Image from 'next/image';

export default function DataCenterHome() {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [watchlist, setWatchlist] = useState(new Set());
  const [priceHistory, setPriceHistory] = useState({});
  const [tradingPower, setTradingPower] = useState(85);
  const [activeSignals, setActiveSignals] = useState(0);

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
          
          // Store initial prices for comparison
          const initialPrices = {};
          data.forEach(coin => {
            initialPrices[coin.symbol] = parseFloat(coin.priceUsd);
          });
          setPriceHistory(initialPrices);
          
          // Trigger AI analysis
          data.forEach((coin, index) => {
            setTimeout(() => getAIAnalysis(coin), index * 800);
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

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (coins.length > 0) {
        const randomCoin = coins[Math.floor(Math.random() * coins.length)];
        const variation = (Math.random() - 0.5) * 0.02;
        const newPrice = parseFloat(randomCoin.priceUsd) * (1 + variation);
        
        setPriceHistory(prev => ({
          ...prev,
          [`${randomCoin.symbol}_live`]: newPrice
        }));
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [coins.length]);

  const getAIAnalysis = async (coin) => {
    const coinKey = coin.symbol.toUpperCase();
    
    setAnalysisLoading(prev => ({ ...prev, [coinKey]: true }));
    
    try {
      const systemPrompt = `You are TRDN, an elite AI trading entity. Analyze ${coin.name} (${coin.symbol}) with these metrics:
      - Current Price: $${coin.priceUsd}
      - 24h Change: ${coin.changePercent24Hr}%
      - Market Cap Rank: ${coin.rank}
      
      Respond in this format:
      ACTION: [ACCUMULATE/MONITOR/DIVEST]
      THESIS: [One sharp insight - max 10 words]
      TIMELINE: [SHORT/MEDIUM/LONG]
      CONVICTION: [9.2/10 format]
      
      Be precise, professional, and strategic.`;

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
              content: `Analyze ${coin.name} trading at $${coin.priceUsd} with ${coin.changePercent24Hr}% change` 
            },
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
        const reply = data.reply;
        const actionMatch = reply.match(/ACTION:\s*(ACCUMULATE|MONITOR|DIVEST)/i);
        const thesisMatch = reply.match(/THESIS:\s*(.+)/i);
        const timelineMatch = reply.match(/TIMELINE:\s*(SHORT|MEDIUM|LONG)/i);
        const convictionMatch = reply.match(/CONVICTION:\s*(\d+\.?\d*)\/10/i);
        
        const action = actionMatch ? actionMatch[1].toUpperCase() : 'MONITOR';
        const thesis = thesisMatch ? thesisMatch[1].trim() : 'Market dynamics under review';
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
          thesis: 'Insufficient data for analysis',
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
        return 'text-[#36FF00] bg-[#36FF00]/10 border-[#36FF00]/20';
      case 'MONITOR':
        return 'text-[#FFD500] bg-[#FFD500]/10 border-[#FFD500]/20';
      case 'DIVEST':
        return 'text-[#FF4E00] bg-[#FF4E00]/10 border-[#FF4E00]/20';
      default:
        return 'text-[#00F0FF] bg-[#00F0FF]/10 border-[#00F0FF]/20';
    }
  };

  const getTimelineColor = (timeline) => {
    switch (timeline) {
      case 'SHORT': return '#FF4E00';
      case 'MEDIUM': return '#FFD500';
      case 'LONG': return '#36FF00';
      default: return '#00F0FF';
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
    <div className="text-[#E6E6E6] min-h-screen">
      {/* Elite Header */}
      <motion.div 
        className="glass glass-p mb-8 border border-[#00F0FF]/20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 px-3 py-2">
            <div className="relative hidden">
              <motion.div 
                className="w-12 h-12 rounded-xl border border-[#00F0FF]/30 bg-[#0B0B0C] flex items-center justify-center"
                whileHover={{ borderColor: '#00F0FF' }}
                transition={{ duration: 0.2 }}
              >
                <Brain className="w-6 h-6 text-[#00F0FF]" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#E6E6E6]">TRDN</h1>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-[#00F0FF] text-xs">Elite Trading AI</span>
                {/* <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#36FF00] rounded-full" />
                  <span className="text-[#E6E6E6]/60">Online</span>
                </div> */}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="text-[#E6E6E6]/60">Power</div>
                <div className="text-[#36FF00] font-bold">{tradingPower}%</div>
              </div>
              <div className="text-center">
                <div className="text-[#E6E6E6]/60">Signals</div>
                <div className="text-[#FFD500] font-bold">{activeSignals}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div 
        className="flex items-center justify-between px-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#00F0FF]" />
            <span className="text-[#E6E6E6]/80">{coins.length} Assets</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-[#FFD500]" />
            <span className="text-[#E6E6E6]/80">{watchlist.size} Watched</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-[#E6E6E6]/60">
          <Clock className="w-4 h-4" />
          <span>Live Data</span>
        </div>
      </motion.div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div 
            className="w-12 h-12 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#00F0FF] mt-4 text-sm font-medium">
            Initializing TRDN systems...
          </p>
        </div>
      )}

      <div className="space-y-3 max-w-md mx-auto mb-24">
        <AnimatePresence>
          {coins.map((coin, index) => {
            const coinKey = coin.symbol.toUpperCase();
            const analysis = aiAnalysis[coinKey];
            const isAnalysisLoading = analysisLoading[coinKey];
            const isWatched = watchlist.has(coin.symbol);
            const priceMovement = getPriceMovement(coin);
            
            return (
              <motion.div
                key={coin.symbol}
                className="relative group"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.995 }}
              >
                <div className="relative glass glass-p border border-[#E6E6E6]/10 hover:border-[#00F0FF]/30 transition-all duration-300">
                  {/* Price Movement Indicator */}
                  {Math.abs(priceMovement) > 0.01 && (
                    <motion.div
                      className={`absolute top-0 left-0 w-1 h-full ${
                        priceMovement > 0 ? 'bg-[#36FF00]' : 'bg-[#FF4E00]'
                      }`}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  
                  {/* Main Content */}
                  <div className="relative p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {/* Rank Badge */}
                        <div className="relative hidden">
                          <div className="w-8 h-8 bg-[#0B0B0C] border border-[#E6E6E6]/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-[#00F0FF]">#{coin.rank}</span>
                          </div>
                        </div>
                        
                        {/* Coin Info */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#0B0B0C] rounded-lg border border-[#E6E6E6]/20 flex items-center justify-center overflow-hidden">
                            {coin.image ? (
                              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                            ) : (
                              <span className="text-sm font-bold text-[#E6E6E6]">
                                {coin.symbol?.charAt(0)}
                              </span>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h2 className="text-lg font-bold text-[#E6E6E6]">
                                {coin.symbol?.toUpperCase()}
                              </h2>
                              {analysis?.action === 'ACCUMULATE' && (
                                <motion.div
                                  className="w-2 h-2 bg-[#36FF00] rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </div>
                            <p className="text-sm text-[#E6E6E6]/60">{coin.name}</p>
                          </div>
                        </div>
                      </div>

                      {/* Watchlist Toggle */}
                      <motion.button
                        onClick={() => toggleWatchlist(coin.symbol)}
                        className="p-2 rounded-lg border border-[#E6E6E6]/10 hover:border-[#FFD500]/50 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bookmark 
                          className={`w-4 h-4 ${isWatched ? 'text-[#FFD500] fill-current' : 'text-[#E6E6E6]/40'}`}
                        />
                      </motion.button>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-[#E6E6E6] mb-1">
                          {formatPrice(priceHistory[`${coin.symbol}_live`] || parseFloat(coin.priceUsd))}
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          coin.changePercent24Hr >= 0 ? 'text-[#36FF00]' : 'text-[#FF4E00]'
                        }`}>
                          {coin.changePercent24Hr >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {formatChange(coin.changePercent24Hr)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Mini Chart Placeholder */}
                      <div className="w-20 h-12 bg-[#0B0B0C]/50 rounded-lg border border-[#E6E6E6]/10 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-[#E6E6E6]/30" />
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="border-t border-[#E6E6E6]/10 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#00F0FF]/30">
                            <Image src="/agent/agentlogo.png" alt="TRDN" width={24} height={24} />
                          </div>
                          <span className="text-sm font-medium text-[#00F0FF]">TRDN</span>
                        </div>
                        
                        {analysis && (
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getTimelineColor(analysis.timeline) }}
                            />
                            <span className="text-xs text-[#E6E6E6]/60">{analysis.timeline}</span>
                          </div>
                        )}
                      </div>
                      
                      {isAnalysisLoading ? (
                        <div className="flex items-center space-x-2 py-2">
                          <div className="w-4 h-1 bg-[#00F0FF]/20 rounded-full overflow-hidden">
                            <motion.div
                              className="w-full h-full bg-[#00F0FF] rounded-full"
                              animate={{ x: [-100, 100] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                          <span className="text-xs text-[#00F0FF]">Processing...</span>
                        </div>
                      ) : analysis ? (
                        <motion.div 
                          className="space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${getActionStyle(analysis.action)}`}>
                              {getActionIcon(analysis.action)}
                              <span className="text-sm font-medium">{analysis.action}</span>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#E6E6E6]">
                                {analysis.conviction}/10
                              </div>
                              <div className="text-xs text-[#E6E6E6]/60">Conviction</div>
                            </div>
                          </div>
                          
                          <p className="text-sm text-[#E6E6E6]/80 italic leading-relaxed">
                            "{analysis.thesis}"
                          </p>
                        </motion.div>
                      ) : (
                        <div className="text-sm text-[#E6E6E6]/50">
                          Awaiting analysis...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
