import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

export default function PredictionChart({ data, isLoading, isDark = true }) {
  const bgCard = isDark ? '#131722' : '#ffffff';
  const borderColor = isDark ? '#2a2e39' : '#e5e7eb';
  const textColor = isDark ? '#6b7280' : '#9ca3af';

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-64 rounded-xl border flex items-center justify-center"
        style={{ backgroundColor: bgCard, borderColor }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Running prediction model...</span>
        </div>
      </motion.div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div 
        className="h-64 rounded-xl border flex items-center justify-center"
        style={{ backgroundColor: bgCard, borderColor }}
      >
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>No prediction data</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-gray-200'} border rounded-xl px-4 py-3 shadow-xl`}
        >
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mb-2`}>Day {payload[0]?.payload.day}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
              {p.name}: ${p.value?.toFixed(2)}
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 11 }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: textColor, fontSize: 11 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) => <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{value}</span>}
          />
          <Line type="monotone" dataKey="actual" name="Actual Price" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#a855f7" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}