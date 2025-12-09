import React from 'react';
import { motion } from 'framer-motion';

export default function KPICard({ label, value, subValue, icon: Icon, trend, isDark = true }) {
  const bgCard = isDark ? 'bg-[#0f1419]/80' : 'bg-white/90';
  const borderColor = isDark ? 'border-[#1e2530]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ duration: 0.2 }}
      className={`
        ${bgCard} backdrop-blur-xl border ${borderColor} 
        rounded-[18px] p-4 
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
        cursor-default
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`${textSecondary} text-xs font-medium`}>{label}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-100'} flex items-center justify-center`}>
            <Icon className="w-3.5 h-3.5 text-teal-500" />
          </div>
        )}
      </div>
      <p className={`text-xl font-bold ${textPrimary} mb-0.5`}>{value}</p>
      {subValue && (
        <p className={`text-xs font-medium ${
          trend === 'up' ? 'text-emerald-500' : 
          trend === 'down' ? 'text-red-500' : 
          textSecondary
        }`}>
          {subValue}
        </p>
      )}
    </motion.div>
  );
}