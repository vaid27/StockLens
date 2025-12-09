import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Brain, Cpu, Zap, BarChart3, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from "../../components/ui/progress";

const models = [
  { id: 'lstm', name: 'LSTM', color: '#8b5cf6', accuracy: 87.5, rmse: 2.34 },
  { id: 'gru', name: 'GRU', color: '#10b981', accuracy: 85.2, rmse: 2.67 },
  { id: 'bilstm', name: 'BiLSTM', color: '#3b82f6', accuracy: 89.1, rmse: 2.12 },
  { id: 'arima', name: 'ARIMA', color: '#f59e0b', accuracy: 78.4, rmse: 3.45 },
  { id: 'prophet', name: 'Prophet', color: '#ec4899', accuracy: 82.3, rmse: 2.89 },
];

const generateModelPredictions = (basePrice = 100, length = 50) => {
  const data = [];
  let actual = basePrice;
  const predictions = models.reduce((acc, m) => ({ ...acc, [m.id]: basePrice }), {});
  
  for (let i = 0; i < length; i++) {
    actual += (Math.random() - 0.48) * (actual * 0.015);
    
    models.forEach(m => {
      const lag = 0.3 + Math.random() * 0.3;
      const noise = (Math.random() - 0.5) * (actual * 0.01 * (1 - m.accuracy / 100));
      predictions[m.id] = predictions[m.id] * (1 - lag) + actual * lag + noise;
    });
    
    data.push({
      day: i + 1,
      actual,
      ...predictions
    });
  }
  
  return data;
};

export default function ModelComparison({ symbol, currentPrice = 100, isDark = true }) {
  const [selectedModels, setSelectedModels] = useState(['lstm', 'bilstm']);
  const [comparisonData] = useState(() => generateModelPredictions(currentPrice));
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-50';

  const toggleModel = (modelId) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(m => m !== modelId)
        : [...prev, modelId]
    );
  };

  const bestModel = models.reduce((best, m) => m.accuracy > best.accuracy ? m : best, models[0]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-6 flex items-center gap-2`}>
        <Cpu className="w-5 h-5 text-cyan-400" />
        Multi-Model Comparison
      </h3>

      {/* Model Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
              selectedModels.includes(model.id)
                ? `border-transparent`
                : `${borderColor} ${isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-50'}`
            }`}
            style={{
              backgroundColor: selectedModels.includes(model.id) ? `${model.color}20` : 'transparent',
              borderColor: selectedModels.includes(model.id) ? model.color : undefined
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: model.color }}
            />
            <span className={selectedModels.includes(model.id) ? 'text-white' : textSecondary}>
              {model.name}
            </span>
            {model.id === bestModel.id && (
              <span className="text-xs bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded">Best</span>
            )}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={comparisonData}>
            <XAxis dataKey="day" tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#1e222d' : '#fff', 
                border: `1px solid ${isDark ? '#2a2e39' : '#e5e7eb'}`,
                borderRadius: '12px'
              }}
            />
            <Line type="monotone" dataKey="actual" stroke="#6b7280" strokeWidth={2} dot={false} name="Actual" strokeDasharray="5 5" />
            {selectedModels.map(modelId => {
              const model = models.find(m => m.id === modelId);
              return (
                <Line 
                  key={modelId}
                  type="monotone" 
                  dataKey={modelId} 
                  stroke={model.color} 
                  strokeWidth={2} 
                  dot={false}
                  name={model.name}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {models.map((model) => (
          <div 
            key={model.id}
            className={`${bgMetric} rounded-xl p-3 ${
              selectedModels.includes(model.id) ? 'ring-1 ring-cyan-500/30' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
              <span className={`text-sm font-medium ${textPrimary}`}>{model.name}</span>
              {model.id === bestModel.id && <CheckCircle2 className="w-3 h-3 text-amber-400" />}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={textSecondary}>Accuracy</span>
                <span className={textPrimary}>{model.accuracy}%</span>
              </div>
              <Progress value={model.accuracy} className="h-1" />
            </div>
            <p className={`text-xs ${textSecondary} mt-2`}>
              RMSE: {model.rmse}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}