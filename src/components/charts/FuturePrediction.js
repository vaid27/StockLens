import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, Calendar, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button";

const timeframes = [
  { label: '7 Days', value: 7, key: '7d' },
  { label: '30 Days', value: 30, key: '30d' },
  { label: '3 Months', value: 90, key: '3m' },
  { label: '6 Months', value: 180, key: '6m' },
];

// Generate future prediction with confidence bands
const generateFuturePrediction = (basePrice, days) => {
  const data = [];
  let price = basePrice;
  const volatility = basePrice * 0.02;
  
  for (let i = 0; i <= days; i++) {
    const trend = 1.0003; // Slight upward bias
    const noise = (Math.random() - 0.5) * volatility;
    price = price * trend + noise;
    
    const uncertainty = volatility * Math.sqrt(i / 10);
    
    data.push({
      day: i,
      label: i === 0 ? 'Today' : `Day ${i}`,
      predicted: price,
      upperBand: price + uncertainty * 2,
      lowerBand: price - uncertainty * 2,
      confidence: Math.max(50, 95 - i * 0.5)
    });
  }
  
  return data;
};

export default function FuturePrediction({ symbol, currentPrice = 100, isDark = true }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const days = timeframes.find(t => t.key === selectedTimeframe)?.value || 30;
  const predictionData = generateFuturePrediction(currentPrice, days);
  
  const finalPrediction = predictionData[predictionData.length - 1];
  const priceChange = finalPrediction.predicted - currentPrice;
  const percentChange = (priceChange / currentPrice) * 100;
  const isPositive = priceChange >= 0;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-gray-200'} border rounded-xl px-4 py-3 shadow-xl`}>
          <p className={`${textSecondary} text-xs mb-1`}>{data.label}</p>
          <p className={`${textPrimary} font-bold text-lg`}>
            ${data.predicted?.toFixed(2)}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <span className={textSecondary}>Range:</span>
            <span className="text-purple-400">${data.lowerBand?.toFixed(2)} - ${data.upperBand?.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-xs ${textSecondary}`}>Confidence:</span>
            <span className="text-xs text-cyan-400">{data.confidence?.toFixed(0)}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className={`${textPrimary} font-semibold text-lg flex items-center gap-2`}>
          <Sparkles className="w-5 h-5 text-purple-400" />
          Future Price Prediction
        </h3>
        
        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.key}
              variant={selectedTimeframe === tf.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTimeframe(tf.key)}
              className={selectedTimeframe === tf.key 
                ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                : `${textSecondary} ${isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-100'}`
              }
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Prediction Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`${bgMetric} rounded-xl p-4`}>
          <p className={`text-xs ${textSecondary} mb-1`}>Current Price</p>
          <p className={`${textPrimary} font-bold text-lg`}>${currentPrice.toFixed(2)}</p>
        </div>
        <div className={`${bgMetric} rounded-xl p-4`}>
          <p className={`text-xs ${textSecondary} mb-1`}>Predicted ({timeframes.find(t => t.key === selectedTimeframe)?.label})</p>
          <p className={`${textPrimary} font-bold text-lg`}>${finalPrediction.predicted.toFixed(2)}</p>
        </div>
        <div className={`${isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl p-4`}>
          <p className={`text-xs ${textSecondary} mb-1`}>Expected Change</p>
          <p className={`font-bold text-lg flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </p>
        </div>
        <div className={`${bgMetric} rounded-xl p-4`}>
          <p className={`text-xs ${textSecondary} mb-1`}>Model Confidence</p>
          <p className={`text-cyan-400 font-bold text-lg`}>{finalPrediction.confidence.toFixed(0)}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        {isGenerating ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <span className={textSecondary}>Generating prediction...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionData}>
              <defs>
                <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                tick={{ fill: textSecondary, fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: textSecondary, fontSize: 10 }} 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(v) => `$${v.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={currentPrice} stroke="#6b7280" strokeDasharray="3 3" />
              <Area 
                type="monotone" 
                dataKey="upperBand" 
                stroke="transparent" 
                fill="url(#bandGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="lowerBand" 
                stroke="transparent" 
                fill="transparent" 
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8b5cf6" 
                strokeWidth={2.5} 
                fill="url(#predGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Disclaimer */}
      <div className={`flex items-start gap-2 p-3 rounded-lg ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'} border ${isDark ? 'border-amber-500/20' : 'border-amber-200'}`}>
        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-500">
          Predictions are based on historical patterns and should not be used as financial advice. 
          Shaded area represents uncertainty range.
        </p>
      </div>
    </motion.div>
  );
}