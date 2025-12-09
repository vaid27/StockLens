import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const intervals = [
  { label: 'Off', value: 0 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
];

export default function AutoRefreshToggle({ onRefresh, isDark = true }) {
  const [selectedInterval, setSelectedInterval] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (selectedInterval === 0) {
      setCountdown(0);
      return;
    }

    setCountdown(selectedInterval);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleRefresh();
          return selectedInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedInterval]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const bgCard = isDark ? 'bg-[#1e222d]' : 'bg-gray-100';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="flex items-center gap-3">
      <motion.button
        onClick={handleRefresh}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-lg ${bgCard} ${textSecondary} hover:text-cyan-400 transition-colors`}
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </motion.button>
      
      <div className={`flex items-center gap-1 p-1 rounded-lg ${bgCard}`}>
        {intervals.map((interval) => (
          <button
            key={interval.value}
            onClick={() => setSelectedInterval(interval.value)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-all
              ${selectedInterval === interval.value 
                ? 'bg-cyan-500 text-white' 
                : `${textSecondary} hover:text-white`
              }
            `}
          >
            {interval.label}
          </button>
        ))}
      </div>

      {selectedInterval > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-[#2a2e39] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: '100%' }}
              animate={{ width: `${(countdown / selectedInterval) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className={`text-xs ${textSecondary}`}>{countdown}s</span>
        </div>
      )}
    </div>
  );
}