import React from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const sampleNews = {
  'AAPL': [
    { title: 'Apple Reports Record Q4 Revenue Driven by iPhone Sales', sentiment: 'positive', time: '2h ago', source: 'Reuters' },
    { title: 'Apple Vision Pro Pre-Orders Exceed Expectations', sentiment: 'positive', time: '5h ago', source: 'Bloomberg' },
    { title: 'Analysts Raise Apple Price Targets After Strong Earnings', sentiment: 'positive', time: '1d ago', source: 'CNBC' },
    { title: 'Apple Expands AI Features Across Product Line', sentiment: 'neutral', time: '2d ago', source: 'TechCrunch' },
  ],
  'TSLA': [
    { title: 'Tesla Cybertruck Deliveries Begin, Strong Initial Demand', sentiment: 'positive', time: '3h ago', source: 'Electrek' },
    { title: 'Tesla Stock Faces Pressure Amid EV Competition', sentiment: 'negative', time: '8h ago', source: 'WSJ' },
    { title: 'Musk Announces New Gigafactory Location', sentiment: 'positive', time: '1d ago', source: 'Reuters' },
    { title: 'Tesla Energy Storage Business Shows Strong Growth', sentiment: 'positive', time: '2d ago', source: 'Bloomberg' },
  ],
  'BTC-USD': [
    { title: 'Bitcoin ETF Sees Record Inflows This Week', sentiment: 'positive', time: '1h ago', source: 'CoinDesk' },
    { title: 'Institutional Adoption of Bitcoin Continues to Grow', sentiment: 'positive', time: '4h ago', source: 'Bloomberg' },
    { title: 'Bitcoin Halving Event Approaches, Analysts Bullish', sentiment: 'positive', time: '1d ago', source: 'Reuters' },
    { title: 'Crypto Market Volatility Expected Ahead of Fed Decision', sentiment: 'neutral', time: '2d ago', source: 'CNBC' },
  ],
};

export default function NewsFeed({ symbol, isDark = true }) {
  const news = sampleNews[symbol] || sampleNews['AAPL'];
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgHover = isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-50';

  const sentimentIcon = {
    positive: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    negative: <TrendingDown className="w-4 h-4 text-red-400" />,
    neutral: <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center"><div className="w-2 h-2 bg-amber-400 rounded-full" /></div>,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Newspaper className="w-5 h-5 text-blue-400" />
        Latest News
      </h3>

      <div className="space-y-1">
        {news.map((item, index) => (
          <motion.a
            key={index}
            href="#"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`block p-3 rounded-xl ${bgHover} transition-all group`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {sentimentIcon[item.sentiment]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${textPrimary} text-sm font-medium group-hover:text-cyan-400 transition-colors line-clamp-2`}>
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs ${textSecondary} flex items-center gap-1`}>
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>{item.source}</span>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </motion.a>
        ))}
      </div>

      <button className={`w-full mt-4 py-2 text-sm ${textSecondary} hover:text-cyan-400 transition-colors`}>
        View All News →
      </button>
    </motion.div>
  );
}