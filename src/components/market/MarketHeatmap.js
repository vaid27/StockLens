import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';

const marketData = [
  { symbol: 'AAPL', name: 'Apple', change: 2.34, marketCap: 'Large' },
  { symbol: 'MSFT', name: 'Microsoft', change: 1.12, marketCap: 'Large' },
  { symbol: 'GOOGL', name: 'Alphabet', change: -0.87, marketCap: 'Large' },
  { symbol: 'AMZN', name: 'Amazon', change: 3.21, marketCap: 'Large' },
  { symbol: 'NVDA', name: 'NVIDIA', change: 4.56, marketCap: 'Large' },
  { symbol: 'META', name: 'Meta', change: -1.23, marketCap: 'Large' },
  { symbol: 'TSLA', name: 'Tesla', change: -2.45, marketCap: 'Large' },
  { symbol: 'BRK.B', name: 'Berkshire', change: 0.34, marketCap: 'Large' },
  { symbol: 'JPM', name: 'JPMorgan', change: 1.67, marketCap: 'Mid' },
  { symbol: 'V', name: 'Visa', change: 0.89, marketCap: 'Mid' },
  { symbol: 'JNJ', name: 'J&J', change: -0.45, marketCap: 'Mid' },
  { symbol: 'WMT', name: 'Walmart', change: 1.23, marketCap: 'Mid' },
  { symbol: 'PG', name: 'P&G', change: 0.56, marketCap: 'Mid' },
  { symbol: 'MA', name: 'Mastercard', change: 2.01, marketCap: 'Mid' },
  { symbol: 'HD', name: 'Home Depot', change: -0.78, marketCap: 'Mid' },
  { symbol: 'DIS', name: 'Disney', change: -1.89, marketCap: 'Mid' },
  { symbol: 'PYPL', name: 'PayPal', change: 3.45, marketCap: 'Small' },
  { symbol: 'NFLX', name: 'Netflix', change: 2.78, marketCap: 'Small' },
  { symbol: 'AMD', name: 'AMD', change: 5.12, marketCap: 'Small' },
  { symbol: 'CRM', name: 'Salesforce', change: -0.34, marketCap: 'Small' },
];

const getColor = (change) => {
  if (change > 3) return 'bg-emerald-500';
  if (change > 1) return 'bg-emerald-500/70';
  if (change > 0) return 'bg-emerald-500/40';
  if (change > -1) return 'bg-red-500/40';
  if (change > -3) return 'bg-red-500/70';
  return 'bg-red-500';
};

const getSize = (marketCap) => {
  if (marketCap === 'Large') return 'col-span-2 row-span-2';
  if (marketCap === 'Mid') return 'col-span-1 row-span-2';
  return 'col-span-1 row-span-1';
};

export default function MarketHeatmap({ isDark = true, onSelectStock }) {
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Grid3X3 className="w-5 h-5 text-cyan-400" />
        Market Heatmap
      </h3>

      <div className="grid grid-cols-6 gap-1 auto-rows-fr" style={{ gridAutoRows: '50px' }}>
        {marketData.map((stock, index) => (
          <motion.button
            key={stock.symbol}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => onSelectStock?.(stock.symbol)}
            className={`
              ${getSize(stock.marketCap)} ${getColor(stock.change)}
              rounded-lg p-2 flex flex-col items-center justify-center
              hover:opacity-80 transition-all hover:scale-[1.02]
              text-white
            `}
          >
            <span className="font-bold text-sm">{stock.symbol}</span>
            <span className="text-xs opacity-90">
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </span>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>&lt;-3%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-red-500/40" />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>-3% to 0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-emerald-500/40" />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>0% to 3%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>&gt;3%</span>
        </div>
      </div>
    </motion.div>
  );
}