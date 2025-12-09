import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';

export default function MarketMoodMeter({ isDark = true }) {
  const moodData = {
    advancers: 1847,
    decliners: 1253,
    unchanged: 156,
    volatility: 18.5,
    volumeSurge: 23,
    fearGreed: 65,
    overallMood: 'Bullish'
  };

  const advanceDeclineRatio = moodData.advancers / (moodData.advancers + moodData.decliners);
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const getMoodColor = () => {
    if (moodData.fearGreed >= 70) return 'from-emerald-500 to-green-500';
    if (moodData.fearGreed >= 50) return 'from-amber-500 to-yellow-500';
    return 'from-red-500 to-orange-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Gauge className="w-5 h-5 text-amber-400" />
        Market Mood
      </h3>

      {/* Main Gauge */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke={isDark ? '#2a2e39' : '#e5e7eb'}
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="transparent"
              stroke="url(#moodGradient)"
              strokeWidth="12"
              strokeDasharray={`${moodData.fearGreed * 2.64} 264`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${textPrimary}`}>{moodData.fearGreed}</span>
            <span className={`text-sm font-medium ${
              moodData.fearGreed >= 70 ? 'text-emerald-400' : 
              moodData.fearGreed >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {moodData.overallMood}
            </span>
          </div>
        </div>
      </div>

      {/* Advance/Decline Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-emerald-400 text-sm flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {moodData.advancers.toLocaleString()} Advancers
          </span>
          <span className="text-red-400 text-sm flex items-center gap-1">
            {moodData.decliners.toLocaleString()} Decliners
            <TrendingDown className="w-4 h-4" />
          </span>
        </div>
        <div className="h-3 rounded-full bg-red-500/30 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${advanceDeclineRatio * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`${bgMetric} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className={`text-xs ${textSecondary}`}>VIX</span>
          </div>
          <p className={`text-lg font-bold ${textPrimary}`}>{moodData.volatility}</p>
        </div>
        <div className={`${bgMetric} rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span className={`text-xs ${textSecondary}`}>Vol Surge</span>
          </div>
          <p className={`text-lg font-bold text-emerald-400`}>+{moodData.volumeSurge}%</p>
        </div>
      </div>

      {/* Scale */}
      <div className="flex justify-between text-xs mt-4">
        <span className="text-red-400">Extreme Fear</span>
        <span className="text-amber-400">Neutral</span>
        <span className="text-emerald-400">Extreme Greed</span>
      </div>
    </motion.div>
  );
}