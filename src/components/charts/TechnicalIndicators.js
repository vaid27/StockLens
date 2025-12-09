import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, BarChart2, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

// Generate indicator data
const generateRSI = (length = 50) => {
  const data = [];
  let rsi = 50;
  for (let i = 0; i < length; i++) {
    rsi = Math.max(0, Math.min(100, rsi + (Math.random() - 0.5) * 15));
    data.push({ day: i + 1, value: rsi });
  }
  return data;
};

const generateMACD = (length = 50) => {
  const data = [];
  let macd = 0;
  let signal = 0;
  for (let i = 0; i < length; i++) {
    macd += (Math.random() - 0.5) * 2;
    signal = signal * 0.9 + macd * 0.1;
    data.push({ 
      day: i + 1, 
      macd: macd, 
      signal: signal,
      histogram: macd - signal 
    });
  }
  return data;
};

const generateBollingerBands = (basePrice = 100, length = 50) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < length; i++) {
    price += (Math.random() - 0.48) * (price * 0.02);
    const volatility = price * 0.05;
    data.push({
      day: i + 1,
      price: price,
      upper: price + volatility * 2,
      middle: price,
      lower: price - volatility * 2
    });
  }
  return data;
};

const generateVolume = (length = 50) => {
  const data = [];
  for (let i = 0; i < length; i++) {
    const volume = 50 + Math.random() * 100;
    const isUp = Math.random() > 0.45;
    data.push({ day: i + 1, volume, isUp });
  }
  return data;
};

export default function TechnicalIndicators({ symbol, isDark = true }) {
  const [activeIndicator, setActiveIndicator] = useState('rsi');
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const gridColor = isDark ? '#2a2e39' : '#e5e7eb';

  const rsiData = generateRSI();
  const macdData = generateMACD();
  const bbData = generateBollingerBands(150);
  const volumeData = generateVolume();

  const latestRSI = rsiData[rsiData.length - 1].value;
  const rsiStatus = latestRSI > 70 ? 'Overbought' : latestRSI < 30 ? 'Oversold' : 'Neutral';
  const rsiColor = latestRSI > 70 ? 'text-red-400' : latestRSI < 30 ? 'text-emerald-400' : 'text-amber-400';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${textPrimary} font-semibold text-lg flex items-center gap-2`}>
          <Activity className="w-5 h-5 text-cyan-400" />
          Technical Indicators
        </h3>
        <Tabs value={activeIndicator} onValueChange={setActiveIndicator}>
          <TabsList className={`${isDark ? 'bg-[#1e222d]' : 'bg-gray-100'}`}>
            <TabsTrigger value="rsi" className="text-xs">RSI</TabsTrigger>
            <TabsTrigger value="macd" className="text-xs">MACD</TabsTrigger>
            <TabsTrigger value="bb" className="text-xs">Bollinger</TabsTrigger>
            <TabsTrigger value="volume" className="text-xs">Volume</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-48">
        {activeIndicator === 'rsi' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${textSecondary}`}>RSI(14)</span>
              <span className={`text-sm font-medium ${rsiColor}`}>
                {latestRSI.toFixed(1)} - {rsiStatus}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={rsiData}>
                <defs>
                  <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis domain={[0, 100]} ticks={[30, 50, 70]} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fill="url(#rsiGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeIndicator === 'macd' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={macdData}>
              <XAxis dataKey="day" hide />
              <YAxis tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke={gridColor} />
              <Bar dataKey="histogram" fill={(entry) => entry.histogram >= 0 ? '#10b981' : '#ef4444'}>
                {macdData.map((entry, index) => (
                  <Bar key={index} fill={entry.histogram >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeIndicator === 'bb' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bbData}>
              <defs>
                <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis domain={['auto', 'auto']} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="upper" stroke="#6366f1" strokeWidth={1} fill="url(#bbGradient)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="middle" stroke="#6366f1" strokeWidth={1} dot={false} strokeDasharray="3 3" />
              <Area type="monotone" dataKey="lower" stroke="#6366f1" strokeWidth={1} fill="transparent" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeIndicator === 'volume' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <XAxis dataKey="day" hide />
              <YAxis tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Bar dataKey="volume">
                {volumeData.map((entry, index) => (
                  <Bar key={index} fill={entry.isUp ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Indicator Legend */}
      <div className={`mt-4 pt-4 border-t ${borderColor} grid grid-cols-2 md:grid-cols-4 gap-2`}>
        {[
          { label: 'RSI', desc: 'Momentum', icon: TrendingUp },
          { label: 'MACD', desc: 'Trend', icon: Activity },
          { label: 'Bollinger', desc: 'Volatility', icon: Layers },
          { label: 'Volume', desc: 'Activity', icon: BarChart2 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveIndicator(item.label.toLowerCase().replace('bollinger', 'bb'))}
            className={`p-2 rounded-lg text-left transition-all ${
              activeIndicator === item.label.toLowerCase().replace('bollinger', 'bb')
                ? 'bg-cyan-500/10 border border-cyan-500/30'
                : `${isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-50'}`
            }`}
          >
            <p className={`text-xs ${textSecondary}`}>{item.desc}</p>
            <p className={`text-sm font-medium ${textPrimary}`}>{item.label}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}