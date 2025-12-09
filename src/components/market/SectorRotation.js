import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, TrendingUp, TrendingDown } from 'lucide-react';

const sectors = [
  { name: 'Technology', change: 2.45, inflow: 1250, color: '#3b82f6' },
  { name: 'Healthcare', change: 1.23, inflow: 890, color: '#10b981' },
  { name: 'Finance', change: -0.45, inflow: -320, color: '#f59e0b' },
  { name: 'Energy', change: -1.87, inflow: -780, color: '#ef4444' },
  { name: 'Consumer', change: 0.78, inflow: 450, color: '#8b5cf6' },
  { name: 'Industrial', change: 0.34, inflow: 210, color: '#06b6d4' },
  { name: 'Materials', change: -0.23, inflow: -120, color: '#ec4899' },
  { name: 'Real Estate', change: 1.56, inflow: 560, color: '#84cc16' },
];

export default function SectorRotation({ isDark = true }) {
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const sortedSectors = [...sectors].sort((a, b) => b.inflow - a.inflow);
  const maxInflow = Math.max(...sectors.map(s => Math.abs(s.inflow)));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Repeat className="w-5 h-5 text-purple-400" />
        Sector Rotation
      </h3>

      {/* Flow Visualization */}
      <div className="space-y-3 mb-6">
        {sortedSectors.map((sector, i) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`${bgMetric} rounded-lg p-3`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                <span className={`text-sm font-medium ${textPrimary}`}>{sector.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sector.change >= 0 ? '+' : ''}{sector.change}%
                </span>
                <span className={`text-xs ${sector.inflow >= 0 ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
                  {sector.inflow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  ${Math.abs(sector.inflow)}M
                </span>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-[#2a2e39] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Math.abs(sector.inflow) / maxInflow) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                className={`h-full rounded-full ${sector.inflow >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ marginLeft: sector.inflow < 0 ? 'auto' : 0 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${borderColor}`}>
        <div className="text-center">
          <p className={`text-xs ${textSecondary} mb-1`}>Net Inflow</p>
          <p className="text-emerald-400 font-bold">
            +$2.14B
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${textSecondary} mb-1`}>Rotation Score</p>
          <p className="text-amber-400 font-bold">
            Risk-On
          </p>
        </div>
      </div>
    </motion.div>
  );
}