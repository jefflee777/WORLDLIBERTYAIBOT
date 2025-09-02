'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Plus, Brain, Target, AlertTriangle, DollarSign, Calendar, BarChart3, Sparkles, ChevronDown, ChevronUp, Zap, Shield, Clock, Activity, Eye, Star, Filter, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function CoinAgent() {
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analysisLoading, setAnalysisLoading] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [TRDNPower, setTRDNPower] = useState(92);
  const [activeMode, setActiveMode] = useState('DEEP_SCAN');

  useEffect(() => {
    async function fetchCoins() {
      try {
        setLoading(true);
        setActiveMode('SCANNING');
        const response = await fetch('/api/coins');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch coin data');
        }

        setCoins(data);
        setError(null);
        setActiveMode('ANALYZING');
        
        // Staggered AI analysis
        data.forEach((coin, index) => {
          setTimeout(() => getComprehensiveAIAnalysis(coin), index * 1200);
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCoins();
  }, []);

  const getComprehensiveAIAnalysis = async (coin) => {
    const coinKey = coin.symbol.toUpperCase();
    
    setAnalysisLoading(prev => ({ ...prev, [coinKey]: true }));
    
    try {
      const systemPrompt = `You are TRDN, an elite AI trading analyst with quantum processing capabilities. Analyze ${coin.name} (${coin.symbol}) with precision:

      Market Data:
      - Price: $${coin.priceUsd}
      - 24h Change: ${coin.changePercent24Hr}%
      - Volume: $${coin.volumeUsd24Hr}
      - Rank: ${coin.rank}

      Provide analysis in EXACT format:
      VERDICT: [ACQUIRE/MONITOR/AVOID]
      CONFIDENCE: [95/100 format]
      THESIS: [One powerful insight - max 12 words]
      TARGET_RETURN: [Expected % in 30 days]
      RISK_GRADE: [A/B/C/D]
      STRATEGIC_ANALYSIS: [2-3 sentences with market dynamics]
      BULL_CASE: [2 strong advantages]
      BEAR_CASE: [2 key concerns]
      HORIZON: [7D/30D/90D] optimal timeframe
      TRDN_SCORE: [1-100 overall rating]
      
      Be sharp, data-driven, and actionable.`;

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
              content: `TRDN, analyze ${coin.name} at $${coin.priceUsd} with ${coin.changePercent24Hr}% movement` 
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
        
        const verdict = reply.match(/VERDICT:\s*(ACQUIRE|MONITOR|AVOID)/i)?.[1]?.toUpperCase() || 'MONITOR';
        const confidenceMatch = reply.match(/CONFIDENCE:\s*(\d+)\/100/i);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;
        const thesis = reply.match(/THESIS:\s*(.+)/i)?.[1]?.trim() || 'Market dynamics require deeper analysis';
        const targetReturn = reply.match(/TARGET_RETURN:\s*(.+)/i)?.[1]?.trim() || '+8-15%';
        const riskGrade = reply.match(/RISK_GRADE:\s*([A-D])/i)?.[1]?.toUpperCase() || 'B';
        const strategicAnalysis = reply.match(/STRATEGIC_ANALYSIS:\s*(.+?)(?=BULL_CASE:|$)/is)?.[1]?.trim() || 'Market conditions show mixed signals with moderate volatility expected.';
        const bullCase = reply.match(/BULL_CASE:\s*(.+?)(?=BEAR_CASE:|$)/is)?.[1]?.trim() || 'Strong fundamentals, Growing adoption';
        const bearCase = reply.match(/BEAR_CASE:\s*(.+?)(?=HORIZON:|$)/is)?.[1]?.trim() || 'Market volatility, Regulatory risks';
        const horizon = reply.match(/HORIZON:\s*(7D|30D|90D)/i)?.[1]?.toUpperCase() || '30D';
        const TRDNScoreMatch = reply.match(/TRDN_SCORE:\s*(\d+)/i);
        const TRDNScore = TRDNScoreMatch ? parseInt(TRDNScoreMatch[1]) : 70;
        
        setAiAnalysis(prev => ({
          ...prev,
          [coinKey]: {
            verdict,
            confidence,
            thesis,
            targetReturn,
            riskGrade,
            strategicAnalysis,
            bullCase: bullCase.split(/[,\n]/).map(p => p.trim()).filter(p => p).slice(0, 2),
            bearCase: bearCase.split(/[,\n]/).map(c => c.trim()).filter(c => c).slice(0, 2),
            horizon,
            TRDNScore,
            timestamp: Date.now()
          }
        }));

        setAnalysisCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("AI Analysis error:", error);
      setAiAnalysis(prev => ({
        ...prev,
        [coinKey]: {
          verdict: 'MONITOR',
          confidence: 50,
          thesis: 'Analysis temporarily unavailable',
          targetReturn: 'TBD',
          riskGrade: 'C',
          strategicAnalysis: 'Unable to process market data at this time.',
          bullCase: ['Market presence'],
          bearCase: ['Data unavailable'],
          horizon: '30D',
          TRDNScore: 50,
          timestamp: Date.now()
        }
      }));
    } finally {
      setAnalysisLoading(prev => ({ ...prev, [coinKey]: false }));
    }
  };

  const toggleCardExpansion = (coinKey) => {
    setExpandedCards(prev => ({
      ...prev,
      [coinKey]: !prev[coinKey]
    }));
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'ACQUIRE':
        return 'text-[#36FF00] bg-[#36FF00]/10 border-[#36FF00]/30';
      case 'AVOID':
        return 'text-[#FF4E00] bg-[#FF4E00]/10 border-[#FF4E00]/30';
      default:
        return 'text-[#FFD500] bg-[#FFD500]/10 border-[#FFD500]/30';
    }
  };

  const getRiskGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-[#36FF00] bg-[#36FF00]/10';
      case 'B': return 'text-[#FFD500] bg-[#FFD500]/10';
      case 'C': return 'text-[#FF4E00] bg-[#FF4E00]/10';
      case 'D': return 'text-[#FF007C] bg-[#FF007C]/10';
      default: return 'text-[#00F0FF] bg-[#00F0FF]/10';
    }
  };

  const getConfidenceBar = (confidence) => {
    const color = confidence >= 80 ? '#36FF00' : confidence >= 60 ? '#FFD500' : '#FF4E00';
    return (
      <div className="w-full bg-[#0B0B0C]/30 rounded-full h-2">
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    );
  };

  const filteredCoins = coins.filter(coin => {
    if (selectedFilter === 'ALL') return true;
    const analysis = aiAnalysis[coin.symbol.toUpperCase()];
    return analysis?.verdict === selectedFilter;
  });

  const formatPrice = (price) => {
    if (price >= 1000) return `$${(price/1000).toFixed(2)}K`;
    if (price >= 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatPercentage = (percent) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen text-[#E6E6E6]">
      {/* Enhanced Header */}
      <motion.div 
        className="glass glass-p-dark my-6 border border-[#00F0FF]/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="relative w-12 h-12 rounded-xl border border-[#00F0FF]/40 bg-[#0B0B0C] flex items-center justify-center"
              animate={{ 
                borderColor: activeMode === 'SCANNING' ? '#FF007C' : 
                            activeMode === 'ANALYZING' ? '#FFD500' : '#00F0FF'
              }}
            >
              <Brain className="w-6 h-6 text-[#00F0FF]" />
              {activeMode === 'SCANNING' && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-[#FF007C]"
                  animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-[#E6E6E6]">TRDN Intelligence</h1>
              <p className="text-sm text-[#00F0FF]">
                {activeMode === 'SCANNING' && 'Quantum market scanning...'}
                {activeMode === 'ANALYZING' && 'Deep neural analysis active...'}
                {activeMode === 'DEEP_SCAN' && 'Elite trading insights ready'}
              </p>
            </div>
          </div>
          
          <motion.button
            className="border border-[#00F0FF]/30 p-2 rounded-xl hover:bg-[#00F0FF]/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5 text-[#00F0FF]" />
          </motion.button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-[#E6E6E6]/60">Power</div>
            <div className="text-[#36FF00] font-bold">{TRDNPower}%</div>
          </div>
          <div>
            <div className="text-sm text-[#E6E6E6]/60">Analyzed</div>
            <div className="text-[#00F0FF] font-bold">{analysisCount}/{coins.length}</div>
          </div>
          <div>
            <div className="text-sm text-[#E6E6E6]/60">Acquire</div>
            <div className="text-[#36FF00] font-bold">
              {Object.values(aiAnalysis).filter(a => a.verdict === 'ACQUIRE').length}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#E6E6E6]/60">Avoid</div>
            <div className="text-[#FF4E00] font-bold">
              {Object.values(aiAnalysis).filter(a => a.verdict === 'AVOID').length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div 
        className="flex items-center justify-between px-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#00F0FF]" />
          <div className="flex space-x-2">
            {['ALL', 'ACQUIRE', 'MONITOR', 'AVOID'].map((filter) => (
              <motion.button
                key={filter}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40'
                    : 'text-[#E6E6E6]/60 hover:text-[#E6E6E6] border border-[#E6E6E6]/10'
                }`}
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <motion.div 
            className="w-16 h-16 border-4 border-[#00F0FF]/20 border-t-[#00F0FF] rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#00F0FF] text-sm font-medium">
            TRDN initializing quantum processors...
          </p>
        </div>
      )}

      <div className="space-y-4 max-w-md mx-auto mb-24">
        <AnimatePresence>
          {filteredCoins.map((coin, index) => {
            const coinKey = coin.symbol.toUpperCase();
            const analysis = aiAnalysis[coinKey];
            const isAnalysisLoading = analysisLoading[coinKey];
            const isExpanded = expandedCards[coinKey];
            
            return (
              <motion.div
                key={coin.symbol}
                className="relative group"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ y: -3 }}
              >
                <div className="relative glass glass-p border border-[#E6E6E6]/10 hover:border-[#00F0FF]/30 transition-all duration-300">
                  {/* Analysis Loading Indicator */}
                  {isAnalysisLoading && (
                    <motion.div
                      className="absolute top-0 left-0 h-1 bg-[#00F0FF] rounded-t-lg"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  
                  <div className="p-4">
                    {/* Enhanced Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-[#0B0B0C] rounded-xl border border-[#E6E6E6]/20 flex items-center justify-center overflow-hidden">
                            {coin.image ? (
                              <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <span className="text-lg font-bold text-[#E6E6E6]">
                                {coin.symbol?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0B0B0C] rounded-full border border-[#E6E6E6]/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#00F0FF]">#{coin.rank}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h2 className="text-lg font-bold text-[#E6E6E6]">
                              {coin.symbol?.toUpperCase()}
                            </h2>
                            {analysis?.TRDNScore >= 80 && (
                              <Star className="w-4 h-4 text-[#FFD500] fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-[#E6E6E6]/60">{coin.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-[#E6E6E6] mb-1">
                          {formatPrice(parseFloat(coin.priceUsd))}
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
                            {formatPercentage(coin.changePercent24Hr)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TRDN Analysis Preview */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#00F0FF]/40">
                            <Image src="/agent/agentlogo.png" alt="TRDN" width={24} height={24} />
                          </div>
                          <span className="text-sm font-bold text-[#00F0FF]">TRDN Analysis</span>
                        </div>
                        
                        <motion.button
                          onClick={() => toggleCardExpansion(coinKey)}
                          className="flex items-center space-x-1 text-xs text-[#E6E6E6]/60 hover:text-[#00F0FF]"
                          whileHover={{ scale: 1.05 }}
                        >
                          {isExpanded ? (
                            <>
                              <span>Collapse</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Expand</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </motion.button>
                      </div>
                      
                      {isAnalysisLoading ? (
                        <motion.div 
                          className="flex items-center space-x-2 py-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Activity className="w-4 h-4 text-[#00F0FF]" />
                          <span className="text-sm text-[#00F0FF]">Deep quantum analysis in progress...</span>
                        </motion.div>
                      ) : analysis ? (
                        <motion.div 
                          className="space-y-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${getVerdictStyle(analysis.verdict)}`}>
                              <Target className="w-4 h-4" />
                              <span className="text-sm font-bold">{analysis.verdict}</span>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-sm font-bold text-[#E6E6E6]">{analysis.TRDNScore}/100</div>
                              <div className="text-xs text-[#E6E6E6]/60">TRDN Score</div>
                            </div>
                          </div>
                          
                          <div className="glass glass-p-dark p-3 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Brain className="w-4 h-4 text-[#00F0FF] mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-[#E6E6E6]/90 italic">"{analysis.thesis}"</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#E6E6E6]/60">Confidence</span>
                              <span className="font-bold text-[#E6E6E6]">{analysis.confidence}%</span>
                            </div>
                            {getConfidenceBar(analysis.confidence)}
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-sm text-[#E6E6E6]/50 italic">
                          Awaiting TRDN analysis...
                        </div>
                      )}
                    </div>

                    {/* Expanded Analysis */}
                    <AnimatePresence>
                      {isExpanded && analysis && !isAnalysisLoading && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="border-t border-[#E6E6E6]/10 pt-4 space-y-4"
                        >
                          {/* Advanced Metrics */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-[#0B0B0C]/30 rounded-lg">
                              <DollarSign className="w-5 h-5 text-[#36FF00] mx-auto mb-1" />
                              <div className="text-xs text-[#E6E6E6]/60 mb-1">Target Return</div>
                              <div className="text-sm font-bold text-[#36FF00]">{analysis.targetReturn}</div>
                            </div>
                            <div className="text-center p-3 bg-[#0B0B0C]/30 rounded-lg">
                              <Shield className={`w-5 h-5 mx-auto mb-1 ${
                                analysis.riskGrade === 'A' ? 'text-[#36FF00]' :
                                analysis.riskGrade === 'B' ? 'text-[#FFD500]' :
                                analysis.riskGrade === 'C' ? 'text-[#FF4E00]' : 'text-[#FF007C]'
                              }`} />
                              <div className="text-xs text-[#E6E6E6]/60 mb-1">Risk Grade</div>
                              <div className={`text-sm font-bold px-2 py-1 rounded ${getRiskGradeColor(analysis.riskGrade)}`}>
                                {analysis.riskGrade}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-[#0B0B0C]/30 rounded-lg">
                              <Clock className="w-5 h-5 text-[#00F0FF] mx-auto mb-1" />
                              <div className="text-xs text-[#E6E6E6]/60 mb-1">Horizon</div>
                              <div className="text-sm font-bold text-[#00F0FF]">{analysis.horizon}</div>
                            </div>
                          </div>

                          {/* Strategic Analysis */}
                          <div className="glass glass-p-dark p-3 rounded-lg">
                            <h4 className="text-sm font-bold text-[#E6E6E6] mb-2 flex items-center">
                              <BarChart3 className="w-4 h-4 mr-2 text-[#00F0FF]" />
                              Strategic Analysis
                            </h4>
                            <p className="text-sm text-[#E6E6E6]/80 leading-relaxed">{analysis.strategicAnalysis}</p>
                          </div>

                          {/* Bull vs Bear Case */}
                          <div className="grid grid-cols-1 gap-3">
                            <div className="p-3 rounded-lg border border-[#36FF00]/20 bg-[#36FF00]/5">
                              <h4 className="text-sm font-bold text-[#36FF00] mb-2">🎯 Bull Case</h4>
                              <ul className="space-y-1">
                                {analysis.bullCase.map((point, idx) => (
                                  <li key={idx} className="text-xs text-[#E6E6E6]/80">• {point}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 rounded-lg border border-[#FF4E00]/20 bg-[#FF4E00]/5">
                              <h4 className="text-sm font-bold text-[#FF4E00] mb-2">⚠️ Bear Case</h4>
                              <ul className="space-y-1">
                                {analysis.bearCase.map((point, idx) => (
                                  <li key={idx} className="text-xs text-[#E6E6E6]/80">• {point}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
