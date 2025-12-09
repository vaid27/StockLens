import React, { useState } from 'react';
import { Zap, Twitter, MessageCircle, TrendingUp, TrendingDown, Gauge, Newspaper, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import StockSearchInput from '../components/stocks/StockSearchInput';

const sentimentData = {
  'AAPL': { positive: 65, neutral: 25, negative: 10, fearGreed: 72, trend: 'Bullish', mentions: 12450 },
  'GOOGL': { positive: 55, neutral: 30, negative: 15, fearGreed: 58, trend: 'Neutral', mentions: 8920 },
  'MSFT': { positive: 70, neutral: 20, negative: 10, fearGreed: 75, trend: 'Bullish', mentions: 9870 },
  'TSLA': { positive: 45, neutral: 20, negative: 35, fearGreed: 42, trend: 'Bearish', mentions: 25600 },
  'BTC-USD': { positive: 60, neutral: 25, negative: 15, fearGreed: 65, trend: 'Bullish', mentions: 45200 },
};

const sampleTweets = [
  { text: '$AAPL Looking strong after earnings! 🚀 #stocks #investing', sentiment: 'positive', source: 'Twitter', time: '2m ago' },
  { text: 'Apple Vision Pro sales exceed expectations, bullish on $AAPL', sentiment: 'positive', source: 'Twitter', time: '15m ago' },
  { text: 'Not sure about $AAPL valuation at these levels...', sentiment: 'negative', source: 'Reddit', time: '32m ago' },
  { text: 'Warren Buffett still holding $AAPL, that tells you something', sentiment: 'positive', source: 'Twitter', time: '1h ago' },
  { text: 'Services revenue is the real growth engine for Apple', sentiment: 'neutral', source: 'Reddit', time: '2h ago' },
];

const generateSentimentHistory = (days = 30) => {
  const data = [];
  let positive = 50;
  let negative = 25;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    positive = Math.max(20, Math.min(80, positive + (Math.random() - 0.5) * 10));
    negative = Math.max(5, Math.min(40, negative + (Math.random() - 0.5) * 8));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      positive: Math.round(positive),
      negative: Math.round(negative),
      neutral: Math.round(100 - positive - negative)
    });
  }
  return data;
};

export default function Sentiment({ isDark = true }) {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [searchSymbol, setSearchSymbol] = useState('');
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const data = sentimentData[selectedSymbol] || sentimentData['AAPL'];
  const pieData = [
    { name: 'Positive', value: data.positive, color: '#10b981' },
    { name: 'Neutral', value: data.neutral, color: '#6b7280' },
    { name: 'Negative', value: data.negative, color: '#ef4444' },
  ];
  const historyData = generateSentimentHistory();

  const handleSearch = (symbol) => {
    if (symbol) setSelectedSymbol(symbol);
  };

  const getFearGreedLabel = (value) => {
    if (value >= 75) return { label: 'Extreme Greed', color: 'text-emerald-400' };
    if (value >= 55) return { label: 'Greed', color: 'text-green-400' };
    if (value >= 45) return { label: 'Neutral', color: 'text-amber-400' };
    if (value >= 25) return { label: 'Fear', color: 'text-orange-400' };
    return { label: 'Extreme Fear', color: 'text-red-400' };
  };

  const fearGreedInfo = getFearGreedLabel(data.fearGreed);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Social Sentiment Analysis</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-3`}>
            Market Sentiment
          </h1>
          <p className={`${textSecondary} max-w-xl mx-auto`}>
            Real-time sentiment from Twitter, Reddit, and news sources
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <StockSearchInput 
            value={searchSymbol}
            onChange={setSearchSymbol}
            onSearch={handleSearch}
            isDark={isDark}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Sentiment Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sentiment Breakdown */}
            <div className={`${bgCard} border ${borderColor} rounded-xl p-6`}>
              <h3 className={`${textPrimary} font-semibold text-lg mb-6 flex items-center gap-2`}>
                <Gauge className="w-5 h-5 text-cyan-400" />
                Sentiment Analysis for {selectedSymbol}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 -mt-4">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className={`text-sm ${textSecondary}`}>{item.name}: {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className={`${bgMetric} rounded-xl p-4`}>
                    <p className={`text-xs ${textSecondary} mb-1`}>Overall Trend</p>
                    <p className={`text-xl font-bold flex items-center gap-2 ${
                      data.trend === 'Bullish' ? 'text-emerald-400' : 
                      data.trend === 'Bearish' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      {data.trend === 'Bullish' ? <ArrowUpRight className="w-5 h-5" /> : 
                       data.trend === 'Bearish' ? <ArrowDownRight className="w-5 h-5" /> : null}
                      {data.trend}
                    </p>
                  </div>
                  <div className={`${bgMetric} rounded-xl p-4`}>
                    <p className={`text-xs ${textSecondary} mb-1`}>Social Mentions (24h)</p>
                    <p className={`text-xl font-bold ${textPrimary}`}>
                      {data.mentions.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${bgMetric} rounded-xl p-4`}>
                    <p className={`text-xs ${textSecondary} mb-1`}>Positive Sentiment</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xl font-bold text-emerald-400`}>{data.positive}%</p>
                      <div className="flex-1 h-2 bg-[#2a2e39] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${data.positive}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment History */}
            <div className={`${bgCard} border ${borderColor} rounded-xl p-6`}>
              <h3 className={`${textPrimary} font-semibold text-lg mb-4`}>Sentiment Trend (30 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1e222d' : '#fff', 
                        border: `1px solid ${isDark ? '#2a2e39' : '#e5e7eb'}`,
                        borderRadius: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="positive" stroke="#10b981" fill="url(#posGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="negative" stroke="#ef4444" fill="url(#negGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Fear & Greed Index */}
            <div className={`${bgCard} border ${borderColor} rounded-xl p-6`}>
              <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
                <Gauge className="w-5 h-5 text-amber-400" />
                Fear & Greed Index
              </h3>
              
              <div className="relative h-40 flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke={isDark ? '#2a2e39' : '#e5e7eb'}
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="url(#fearGreedGradient)"
                      strokeWidth="10"
                      strokeDasharray={`${data.fearGreed * 2.83} 283`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="fearGreedGradient">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${textPrimary}`}>{data.fearGreed}</span>
                    <span className={`text-xs ${fearGreedInfo.color}`}>{fearGreedInfo.label}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-xs mt-4">
                <span className="text-red-400">Extreme Fear</span>
                <span className="text-emerald-400">Extreme Greed</span>
              </div>
            </div>

            {/* Social Feed */}
            <div className={`${bgCard} border ${borderColor} rounded-xl p-6`}>
              <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
                <MessageCircle className="w-5 h-5 text-blue-400" />
                Social Feed
              </h3>

              <div className="space-y-3">
                {sampleTweets.map((tweet, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${bgMetric} rounded-lg p-3`}
                  >
                    <p className={`text-sm ${textPrimary} mb-2`}>{tweet.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tweet.source === 'Twitter' ? (
                          <Twitter className="w-3 h-3 text-blue-400" />
                        ) : (
                          <MessageCircle className="w-3 h-3 text-orange-400" />
                        )}
                        <span className={`text-xs ${textSecondary}`}>{tweet.time}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        tweet.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                        tweet.sentiment === 'negative' ? 'bg-red-500/10 text-red-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        {tweet.sentiment}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}