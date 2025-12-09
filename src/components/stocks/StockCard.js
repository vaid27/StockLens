import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StockCard({ symbol, name, price, changePercent, onClick, isActive, onAddToWatchlist, isInWatchlist, isDark = true }) {
  const isPositive = changePercent >= 0;
  
  const bgCard = isDark ? 'bg-[#0f1419]' : 'bg-white';
  const borderCard = isDark ? 'border-[#1e2530]' : 'border-gray-200';
  const bgActive = isDark ? 'bg-[#1a1f2e]' : 'bg-gray-50';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-500' : 'text-gray-500';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex-shrink-0 w-48 p-4 rounded-2xl border transition-all duration-200 text-left
        shadow-lg hover:shadow-xl
        ${isActive 
          ? `${bgActive} border-teal-500/40 shadow-teal-500/10` 
          : `${bgCard} ${borderCard} hover:border-teal-500/20`
        }
      `}
    >
      {onAddToWatchlist && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddToWatchlist(symbol); }}
          className={`absolute top-3 right-3 p-1 rounded-md transition-all ${
            isInWatchlist ? 'text-amber-400' : `${isDark ? 'text-gray-600 hover:text-amber-400' : 'text-gray-400 hover:text-amber-500'}`
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
      )}

      <div className="flex items-center gap-2.5 mb-3">
        <div className={`
          w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold
          ${isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}
        `}>
          {symbol.slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${textPrimary} font-semibold text-sm truncate`}>{symbol}</p>
          <p className={`text-[10px] truncate ${textSecondary}`}>{name}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`${textPrimary} font-bold text-base`}>
          ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
          isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{changePercent?.toFixed(2)}%
        </span>
      </div>

      {/* Mini Sparkline */}
      <div className="mt-2.5 h-6 flex items-end gap-px">
        {Array.from({ length: 16 }).map((_, i) => {
          const height = 20 + Math.random() * 80;
          return (
            <div 
              key={i}
              className={`flex-1 rounded-sm ${isPositive ? 'bg-emerald-500/25' : 'bg-red-500/25'}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </motion.button>
  );
}