import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Calendar, TrendingUp, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const upcomingIPOs = [
  { 
    company: 'Stripe Inc.', 
    symbol: 'STRP', 
    industry: 'Fintech',
    expectedDate: '2024-Q2',
    priceRange: '$65-75',
    valuation: '$70B',
    status: 'upcoming'
  },
  { 
    company: 'SpaceX', 
    symbol: 'SPACEX', 
    industry: 'Aerospace',
    expectedDate: '2024-Q3',
    priceRange: 'TBD',
    valuation: '$180B',
    status: 'rumored'
  },
  { 
    company: 'Discord Inc.', 
    symbol: 'DISC', 
    industry: 'Social',
    expectedDate: '2024-Q2',
    priceRange: '$25-30',
    valuation: '$15B',
    status: 'filing'
  },
  { 
    company: 'Databricks', 
    symbol: 'DBR', 
    industry: 'Cloud/AI',
    expectedDate: '2024-Q2',
    priceRange: '$80-95',
    valuation: '$43B',
    status: 'upcoming'
  },
];

const recentIPOs = [
  { company: 'Reddit', symbol: 'RDDT', listingPrice: 34, currentPrice: 58.42, change: 71.8 },
  { company: 'Astera Labs', symbol: 'ALAB', listingPrice: 36, currentPrice: 72.15, change: 100.4 },
];

export default function IPODashboard({ isDark = true }) {
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const statusColors = {
    upcoming: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    filing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    rumored: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-6 flex items-center gap-2`}>
        <Rocket className="w-5 h-5 text-orange-400" />
        IPO Dashboard
      </h3>

      {/* Recent IPO Performance */}
      <div className="mb-6">
        <h4 className={`text-sm font-medium ${textSecondary} mb-3`}>Recent IPOs Performance</h4>
        <div className="grid grid-cols-2 gap-3">
          {recentIPOs.map((ipo) => (
            <div key={ipo.symbol} className={`${bgMetric} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${textPrimary}`}>{ipo.symbol}</span>
                <span className={`text-sm font-bold ${ipo.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  +{ipo.change.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={textSecondary}>IPO: ${ipo.listingPrice}</span>
                <span className={textPrimary}>${ipo.currentPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming IPOs */}
      <div>
        <h4 className={`text-sm font-medium ${textSecondary} mb-3`}>Upcoming IPOs</h4>
        <div className="space-y-3">
          {upcomingIPOs.map((ipo, index) => (
            <motion.div
              key={ipo.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${bgMetric} rounded-xl p-4`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${textPrimary}`}>{ipo.company}</p>
                    <Badge variant="outline" className={`text-xs ${statusColors[ipo.status]}`}>
                      {ipo.status}
                    </Badge>
                  </div>
                  <p className={`text-xs ${textSecondary}`}>{ipo.industry}</p>
                </div>
                <Button size="icon" variant="ghost" className={textSecondary}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className={`text-xs ${textSecondary}`}>Expected</p>
                  <p className={textPrimary}>{ipo.expectedDate}</p>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary}`}>Price Range</p>
                  <p className={textPrimary}>{ipo.priceRange}</p>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary}`}>Valuation</p>
                  <p className="text-cyan-400">{ipo.valuation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'} flex items-start gap-2`}>
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-500">
          IPO dates and pricing are estimates and subject to change. Not investment advice.
        </p>
      </div>
    </motion.div>
  );
}