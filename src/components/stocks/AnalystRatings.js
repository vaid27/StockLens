import React from 'react';
import { ThumbsUp, ThumbsDown, Minus, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "../../components/ui/progress";

const ratingsData = {
  'AAPL': { buy: 28, hold: 8, sell: 2, targetPrice: 195.50, consensus: 'Strong Buy' },
  'GOOGL': { buy: 32, hold: 5, sell: 1, targetPrice: 165.00, consensus: 'Strong Buy' },
  'MSFT': { buy: 35, hold: 4, sell: 0, targetPrice: 425.00, consensus: 'Strong Buy' },
  'TSLA': { buy: 12, hold: 18, sell: 8, targetPrice: 275.00, consensus: 'Hold' },
  'BTC-USD': { buy: 15, hold: 10, sell: 5, targetPrice: 85000, consensus: 'Buy' },
};

export default function AnalystRatings({ symbol, currentPrice, isDark = true }) {
  const data = ratingsData[symbol] || ratingsData['AAPL'];
  const total = data.buy + data.hold + data.sell;
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const upside = ((data.targetPrice - (currentPrice || 100)) / (currentPrice || 100)) * 100;

  const consensusColor = {
    'Strong Buy': 'text-emerald-400 bg-emerald-400/10',
    'Buy': 'text-green-400 bg-green-400/10',
    'Hold': 'text-amber-400 bg-amber-400/10',
    'Sell': 'text-red-400 bg-red-400/10',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Users className="w-5 h-5 text-purple-400" />
        Analyst Ratings
      </h3>

      {/* Consensus Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`px-4 py-2 rounded-xl ${consensusColor[data.consensus] || consensusColor['Hold']}`}>
          <span className="font-semibold">{data.consensus}</span>
        </div>
        <div className={`text-right`}>
          <p className={`text-xs ${textSecondary}`}>{total} Analysts</p>
        </div>
      </div>

      {/* Rating Bars */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="flex items-center gap-2 text-sm text-emerald-400">
              <ThumbsUp className="w-4 h-4" /> Buy
            </span>
            <span className={`text-sm ${textPrimary}`}>{data.buy}</span>
          </div>
          <Progress value={(data.buy / total) * 100} className="h-2 bg-[#2a2e39]" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="flex items-center gap-2 text-sm text-amber-400">
              <Minus className="w-4 h-4" /> Hold
            </span>
            <span className={`text-sm ${textPrimary}`}>{data.hold}</span>
          </div>
          <Progress value={(data.hold / total) * 100} className="h-2 bg-[#2a2e39]" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="flex items-center gap-2 text-sm text-red-400">
              <ThumbsDown className="w-4 h-4" /> Sell
            </span>
            <span className={`text-sm ${textPrimary}`}>{data.sell}</span>
          </div>
          <Progress value={(data.sell / total) * 100} className="h-2 bg-[#2a2e39]" />
        </div>
      </div>

      {/* Target Price */}
      <div className={`${bgMetric} rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs ${textSecondary} flex items-center gap-1`}>
              <Target className="w-3 h-3" /> Price Target
            </p>
            <p className={`${textPrimary} font-bold text-xl mt-1`}>
              ${data.targetPrice?.toLocaleString()}
            </p>
          </div>
          <div className={`px-3 py-2 rounded-lg ${upside >= 0 ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
            <p className="text-xs">Upside</p>
            <p className="font-bold">{upside >= 0 ? '+' : ''}{upside.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}