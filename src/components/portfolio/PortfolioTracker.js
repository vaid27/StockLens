import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Percent, Target } from 'lucide-react';

const portfolioHoldings = [
  { symbol: 'AAPL', name: 'Apple', shares: 50, avgCost: 145.00, currentPrice: 178.42, allocation: 35 },
  { symbol: 'MSFT', name: 'Microsoft', shares: 20, avgCost: 320.00, currentPrice: 378.91, allocation: 30 },
  { symbol: 'GOOGL', name: 'Alphabet', shares: 15, avgCost: 125.00, currentPrice: 141.80, allocation: 15 },
  { symbol: 'NVDA', name: 'NVIDIA', shares: 10, avgCost: 450.00, currentPrice: 875.28, allocation: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function PortfolioTracker({ isDark = true }) {
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  // Calculate portfolio metrics
  const holdings = portfolioHoldings.map(h => ({
    ...h,
    value: h.shares * h.currentPrice,
    cost: h.shares * h.avgCost,
    pnl: (h.currentPrice - h.avgCost) * h.shares,
    pnlPercent: ((h.currentPrice - h.avgCost) / h.avgCost) * 100
  }));

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.cost, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  const pieData = holdings.map(h => ({
    name: h.symbol,
    value: h.allocation
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-6 flex items-center gap-2`}>
        <Briefcase className="w-5 h-5 text-blue-400" />
        Portfolio Tracker
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`${bgMetric} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span className={`text-xs ${textSecondary}`}>Total Value</span>
          </div>
          <p className={`text-xl font-bold ${textPrimary}`}>
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${bgMetric} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className={`text-xs ${textSecondary}`}>Cost Basis</span>
          </div>
          <p className={`text-xl font-bold ${textPrimary}`}>
            ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${totalPnL >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            {totalPnL >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
            <span className={`text-xs ${textSecondary}`}>Total P&L</span>
          </div>
          <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${totalPnL >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-amber-400" />
            <span className={`text-xs ${textSecondary}`}>Return</span>
          </div>
          <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Allocation Pie Chart */}
        <div>
          <h4 className={`text-sm font-medium ${textSecondary} mb-4`}>Asset Allocation</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {holdings.map((h, i) => (
              <div key={h.symbol} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className={`text-xs ${textSecondary}`}>{h.symbol} ({h.allocation}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings List */}
        <div>
          <h4 className={`text-sm font-medium ${textSecondary} mb-4`}>Holdings</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {holdings.map((holding, i) => (
              <div key={holding.symbol} className={`${bgMetric} rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${COLORS[i]}20` }}>
                      <span className="text-xs font-bold" style={{ color: COLORS[i] }}>
                        {holding.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>{holding.symbol}</p>
                      <p className={`text-xs ${textSecondary}`}>{holding.shares} shares</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${textPrimary}`}>
                      ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs ${holding.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}