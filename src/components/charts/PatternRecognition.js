import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scan, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Button } from "../../components/ui/button";

const patterns = [
  { name: 'Head & Shoulders', type: 'bearish', confidence: 87, price: 178.42, target: 165.20 },
  { name: 'Cup & Handle', type: 'bullish', confidence: 72, price: 178.42, target: 195.00 },
  { name: 'Double Bottom', type: 'bullish', confidence: 65, price: 168.50, target: 185.00 },
  { name: 'Ascending Triangle', type: 'bullish', confidence: 81, price: 175.00, target: 190.00 },
];

export default function PatternRecognition({ symbol = 'AAPL', isDark = true }) {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState(patterns);

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Shuffle patterns for demo
      setDetectedPatterns([...patterns].sort(() => Math.random() - 0.5));
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${textPrimary} font-semibold text-lg flex items-center gap-2`}>
          <Scan className="w-5 h-5 text-purple-400" />
          AI Pattern Recognition
        </h3>
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="bg-purple-500 hover:bg-purple-600 text-white"
          size="sm"
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Scanning...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Detect Patterns
            </>
          )}
        </Button>
      </div>

      {/* Pattern List */}
      <div className="space-y-3">
        {detectedPatterns.map((pattern, index) => (
          <motion.div
            key={pattern.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${bgMetric} rounded-xl p-4`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  pattern.type === 'bullish' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}>
                  {pattern.type === 'bullish' ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${textPrimary}`}>{pattern.name}</p>
                  <p className={`text-xs ${textSecondary} capitalize`}>{pattern.type} Pattern</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                pattern.confidence >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                pattern.confidence >= 60 ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {pattern.confidence}% Confidence
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className={`text-xs ${textSecondary}`}>Formation Price</p>
                <p className={`text-sm font-medium ${textPrimary}`}>${pattern.price}</p>
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Target Price</p>
                <p className={`text-sm font-medium ${pattern.type === 'bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${pattern.target}
                </p>
              </div>
              <div>
                <p className={`text-xs ${textSecondary}`}>Potential</p>
                <p className={`text-sm font-medium ${pattern.type === 'bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pattern.type === 'bullish' ? '+' : ''}{(((pattern.target - pattern.price) / pattern.price) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className={`mt-4 pt-4 border-t ${borderColor} flex items-center justify-center gap-6`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className={`text-xs ${textSecondary}`}>High Confidence (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className={`text-xs ${textSecondary}`}>Moderate (60-79%)</span>
        </div>
      </div>
    </motion.div>
  );
}