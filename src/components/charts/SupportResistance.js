import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

const generatePriceData = (basePrice = 178, days = 60) => {
  const data = [];
  let price = basePrice;
  
  for (let i = 0; i < days; i++) {
    price += (Math.random() - 0.48) * 3;
    price = Math.max(basePrice * 0.85, Math.min(basePrice * 1.15, price));
    data.push({
      day: i + 1,
      price,
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  return data;
};

export default function SupportResistance({ symbol = 'AAPL', currentPrice = 178.42, isDark = true }) {
  const priceData = generatePriceData(currentPrice);
  
  // Calculate support and resistance levels
  const prices = priceData.map(d => d.price);
  const resistance1 = Math.max(...prices) * 0.98;
  const resistance2 = Math.max(...prices);
  const support1 = Math.min(...prices) * 1.02;
  const support2 = Math.min(...prices);
  const pivotPoint = (Math.max(...prices) + Math.min(...prices) + currentPrice) / 3;

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const levels = [
    { name: 'R2', price: resistance2, type: 'resistance', color: '#ef4444' },
    { name: 'R1', price: resistance1, type: 'resistance', color: '#f97316' },
    { name: 'Pivot', price: pivotPoint, type: 'pivot', color: '#8b5cf6' },
    { name: 'S1', price: support1, type: 'support', color: '#22c55e' },
    { name: 'S2', price: support2, type: 'support', color: '#10b981' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Target className="w-5 h-5 text-cyan-400" />
        AI Support & Resistance
      </h3>

      {/* Chart with levels */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="srGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1e222d' : '#fff', 
                border: `1px solid ${isDark ? '#2a2e39' : '#e5e7eb'}`,
                borderRadius: '12px'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
            />
            {levels.map((level) => (
              <ReferenceLine 
                key={level.name}
                y={level.price} 
                stroke={level.color} 
                strokeDasharray={level.type === 'pivot' ? '0' : '5 5'}
                strokeWidth={2}
                label={{ 
                  value: level.name, 
                  position: 'right', 
                  fill: level.color, 
                  fontSize: 10,
                  fontWeight: 'bold'
                }}
              />
            ))}
            <Area
              type="monotone"
              dataKey="price"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#srGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Levels Table */}
      <div className="grid grid-cols-5 gap-2">
        {levels.map((level) => (
          <div 
            key={level.name}
            className={`${bgMetric} rounded-lg p-3 text-center`}
          >
            <p className="text-xs font-bold mb-1" style={{ color: level.color }}>
              {level.name}
            </p>
            <p className={`text-sm font-medium ${textPrimary}`}>
              ${level.price.toFixed(2)}
            </p>
            <p className={`text-xs ${textSecondary}`}>
              {((level.price - currentPrice) / currentPrice * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>

      {/* Current Position */}
      <div className={`mt-4 pt-4 border-t ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className={textSecondary}>Current:</span>
          <span className={`font-bold ${textPrimary}`}>${currentPrice.toFixed(2)}</span>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
          currentPrice > pivotPoint 
            ? 'bg-emerald-500/10 text-emerald-400' 
            : 'bg-red-500/10 text-red-400'
        }`}>
          {currentPrice > pivotPoint ? 'Above Pivot - Bullish' : 'Below Pivot - Bearish'}
        </div>
      </div>
    </motion.div>
  );
}