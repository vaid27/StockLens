import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const fundamentalData = {
  'AAPL': {
    marketCap: '2.89T',
    peRatio: 29.45,
    pbRatio: 47.2,
    eps: 6.05,
    dividendYield: 0.51,
    revenue: '383.29B',
    profit: '96.99B',
    high52w: 198.23,
    low52w: 124.17
  },
  'GOOGL': {
    marketCap: '1.78T',
    peRatio: 24.12,
    pbRatio: 6.1,
    eps: 5.80,
    dividendYield: 0,
    revenue: '307.39B',
    profit: '73.79B',
    high52w: 155.50,
    low52w: 102.21
  },
  'MSFT': {
    marketCap: '2.81T',
    peRatio: 35.67,
    pbRatio: 12.8,
    eps: 10.69,
    dividendYield: 0.74,
    revenue: '211.92B',
    profit: '72.36B',
    high52w: 420.82,
    low52w: 309.45
  },
  'TSLA': {
    marketCap: '789B',
    peRatio: 72.34,
    pbRatio: 15.2,
    eps: 3.12,
    dividendYield: 0,
    revenue: '96.77B',
    profit: '12.58B',
    high52w: 299.29,
    low52w: 138.80
  },
  'BTC-USD': {
    marketCap: '1.32T',
    peRatio: null,
    pbRatio: null,
    eps: null,
    dividendYield: 0,
    revenue: null,
    profit: null,
    high52w: 73750,
    low52w: 38500
  }
};

export default function FundamentalsPanel({ symbol, isDark = true }) {
  const data = fundamentalData[symbol] || fundamentalData['AAPL'];
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const metrics = [
    { label: 'Market Cap', value: data.marketCap, icon: DollarSign, color: 'text-cyan-400' },
    { label: 'P/E Ratio', value: data.peRatio?.toFixed(2) || 'N/A', icon: PieChart, color: 'text-purple-400' },
    { label: 'P/B Ratio', value: data.pbRatio?.toFixed(2) || 'N/A', icon: BarChart3, color: 'text-amber-400' },
    { label: 'EPS', value: data.eps ? `$${data.eps.toFixed(2)}` : 'N/A', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Dividend Yield', value: `${data.dividendYield}%`, icon: Percent, color: 'text-blue-400' },
    { label: 'Revenue', value: data.revenue || 'N/A', icon: DollarSign, color: 'text-pink-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        Fundamentals
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`${bgMetric} rounded-xl p-4 hover:scale-105 transition-transform cursor-default`}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className={`text-xs ${textSecondary}`}>{metric.label}</span>
            </div>
            <p className={`${textPrimary} font-bold text-lg`}>{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 52 Week Range */}
      <div className={`mt-4 ${bgMetric} rounded-xl p-4`}>
        <p className={`text-xs ${textSecondary} mb-2`}>52 Week Range</p>
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-sm font-medium">${data.low52w?.toLocaleString()}</span>
          <div className="flex-1 h-2 bg-gradient-to-r from-red-500/30 via-amber-500/30 to-emerald-500/30 rounded-full relative">
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg"
              style={{ left: '60%' }}
            />
          </div>
          <span className="text-emerald-400 text-sm font-medium">${data.high52w?.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}