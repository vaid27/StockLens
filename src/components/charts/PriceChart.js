import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

export default function PriceChart({ data, isLoading, isDark = true, showConfidenceBands = false }) {
  const bgCard = isDark ? '#0f1419' : '#ffffff';
  const borderColor = isDark ? '#1e2530' : '#e5e7eb';
  const textColor = isDark ? '#64748b' : '#9ca3af';

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-72 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: bgCard, border: `1px solid ${borderColor}` }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-teal-500/30" />
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          </div>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading chart...</span>
        </div>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="h-72 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ backgroundColor: bgCard, border: `1px solid ${borderColor}` }}
      >
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>No data available</span>
      </div>
    );
  }

  const isPositive = data[data.length - 1]?.price >= data[0]?.price;
  const gradientColor = isPositive ? '#10b981' : '#ef4444';
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const avgPrice = data.reduce((sum, d) => sum + d.price, 0) / data.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentPrice = payload[0].value;
      const prevPrice = payload[0].payload.prevPrice || currentPrice;
      const change = currentPrice - prevPrice;
      const changePercent = (change / prevPrice) * 100;

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl px-4 py-3 shadow-xl"
          style={{ 
            backgroundColor: isDark ? '#1a1f2e' : '#ffffff',
            border: `1px solid ${isDark ? '#2a3441' : '#e5e7eb'}`
          }}
        >
          <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {payload[0].payload.date}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-72 rounded-2xl p-4 shadow-lg"
      style={{ backgroundColor: bgCard, border: `1px solid ${borderColor}` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.35}/>
              <stop offset="50%" stopColor={gradientColor} stopOpacity={0.12}/>
              <stop offset="100%" stopColor={gradientColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 10 }}
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 10 }}
            dx={-10}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={avgPrice} 
            stroke={isDark ? '#2a3441' : '#d1d5db'} 
            strokeDasharray="4 4" 
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}