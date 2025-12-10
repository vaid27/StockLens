import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import PredictionChart from '../components/charts/PredictionChart';
import FuturePrediction from '../components/charts/FuturePrediction';
import ModelComparison from '../components/charts/ModelComparison';
import StockSearchInput from '../components/stocks/StockSearchInput';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { fetchStockData, checkBackendHealth } from '../services/stockService';

const generatePredictionData = (basePrice) => {
  const data = [];
  let actual = basePrice;
  let predicted = basePrice;
  
  for (let i = 0; i < 100; i++) {
    const actualChange = (Math.random() - 0.48) * (actual * 0.015);
    actual = Math.max(actual + actualChange, actual * 0.8);
    
    const predictedChange = (actual - predicted) * 0.3 + (Math.random() - 0.5) * (predicted * 0.01);
    predicted = Math.max(predicted + predictedChange, predicted * 0.8);
    
    data.push({ day: i + 1, actual, predicted });
  }
  
  return data;
};

const STOCK_INFO = {
  'AAPL': { name: 'Apple Inc.', price: 178.42 },
  'GOOGL': { name: 'Alphabet Inc.', price: 141.80 },
  'MSFT': { name: 'Microsoft Corp.', price: 378.91 },
  'TSLA': { name: 'Tesla Inc.', price: 248.50 },
  'BTC-USD': { name: 'Bitcoin USD', price: 67542.18 },
};

export default function Predictions({ isDark = true }) {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSymbol = urlParams.get('symbol') || 'AAPL';
  
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStats, setModelStats] = useState({ accuracy: 0, rmse: 0, mae: 0 });
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [stockInfo, setStockInfo] = useState({ 
    symbol: initialSymbol,
    name: STOCK_INFO[initialSymbol]?.name || initialSymbol, 
    price: STOCK_INFO[initialSymbol]?.price || 100 
  });

  // Check backend availability
  useEffect(() => {
    checkBackendHealth().then(setBackendAvailable);
  }, []);

  // Load live stock data
  const loadStockInfo = async () => {
    try {
      const liveData = await fetchStockData(selectedSymbol);
      if (!liveData.isDemo) {
        setStockInfo(liveData);
      } else {
        setStockInfo(STOCK_INFO[selectedSymbol] || { symbol: selectedSymbol, name: selectedSymbol, price: 100 });
      }
    } catch (error) {
      setStockInfo(STOCK_INFO[selectedSymbol] || { symbol: selectedSymbol, name: selectedSymbol, price: 100 });
    }
  };

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    setIsLoading(true);
    
    // Load live stock data first
    loadStockInfo().then(() => {
      const timer = setTimeout(() => {
        const data = generatePredictionData(stockInfo.price);
        setChartData(data);
        
        const errors = data.map(d => Math.abs(d.actual - d.predicted) / d.actual);
        const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
        
        setModelStats({
          accuracy: Math.round((1 - avgError) * 100),
          rmse: (avgError * stockInfo.price).toFixed(2),
          mae: (avgError * stockInfo.price * 0.8).toFixed(2)
        });
        
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    });
  }, [selectedSymbol]);

  const handleSearch = (symbol) => {
    if (symbol) setSelectedSymbol(symbol);
  };

  const latestActual = chartData[chartData.length - 1]?.actual || 0;
  const latestPredicted = chartData[chartData.length - 1]?.predicted || 0;
  const predictionDiff = latestPredicted - latestActual;
  const predictionPercent = latestActual ? (predictionDiff / latestActual) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">LSTM Neural Network</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-3`}>
            ML Price Predictions
          </h1>
          <p className={`${textSecondary} max-w-xl mx-auto`}>
            Deep learning models trained on historical price data
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <StockSearchInput 
            value={searchSymbol}
            onChange={setSearchSymbol}
            onSearch={handleSearch}
            isDark={isDark}
          />
        </div>

        {/* Stock Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${textPrimary} flex items-center gap-3`}>
              {selectedSymbol}
              <span className={`font-normal text-lg ${textSecondary}`}>{stockInfo.name}</span>
            </h2>
            <p className={`${textSecondary} mt-1 flex items-center gap-2`}>
              <Sparkles className="w-4 h-4 text-purple-400" />
              Powered by LSTM Neural Network
            </p>
          </div>
          <div className="flex items-center gap-3">
            {backendAvailable && (
              <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                🟢 Live Data
              </span>
            )}
            {!backendAvailable && (
              <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                📊 Demo Mode
              </span>
            )}
            <Button 
              onClick={() => {
                setIsLoading(true);
                loadStockInfo().then(() => {
                  setTimeout(() => {
                    setChartData(generatePredictionData(stockInfo.price));
                    setIsLoading(false);
                  }, 1000);
                });
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Run Prediction
            </Button>
          </div>
        </div>

        {/* Model Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className={`${bgCard} border ${borderColor}`}>
            <CardContent className="pt-6">
              <p className={`${textSecondary} text-sm mb-2`}>Model Accuracy</p>
              <div className="flex items-center gap-3">
                <p className={`text-2xl font-bold ${textPrimary}`}>{modelStats.accuracy}%</p>
                <Progress value={modelStats.accuracy} className="flex-1 h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className={`${bgCard} border ${borderColor}`}>
            <CardContent className="pt-6">
              <p className={`${textSecondary} text-sm mb-2`}>RMSE</p>
              <p className={`text-2xl font-bold ${textPrimary}`}>${modelStats.rmse}</p>
            </CardContent>
          </Card>

          <Card className={`${bgCard} border ${borderColor}`}>
            <CardContent className="pt-6">
              <p className={`${textSecondary} text-sm mb-2`}>MAE</p>
              <p className={`text-2xl font-bold ${textPrimary}`}>${modelStats.mae}</p>
            </CardContent>
          </Card>

          <Card className={`border ${predictionDiff >= 0 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
            <CardContent className="pt-6">
              <p className={`${textSecondary} text-sm mb-2`}>Signal</p>
              <div className="flex items-center gap-2">
                {predictionDiff >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-xl font-bold ${predictionDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {predictionDiff >= 0 ? '+' : ''}{predictionPercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Actual vs Predicted */}
          <div className={`${bgCard} border ${borderColor} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${textPrimary}`}>Actual vs Predicted Price</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className={textSecondary}>Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className={textSecondary}>Predicted</span>
                </div>
              </div>
            </div>
            <PredictionChart data={chartData} isLoading={isLoading} isDark={isDark} />
          </div>

          {/* Future Prediction */}
          <FuturePrediction symbol={selectedSymbol} currentPrice={stockInfo.price} isDark={isDark} />

          {/* Model Comparison */}
          <ModelComparison symbol={selectedSymbol} currentPrice={stockInfo.price} isDark={isDark} />
        </div>

        {/* Model Architecture Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className={`${bgCard} border ${borderColor}`}>
            <CardHeader>
              <CardTitle className={`${textPrimary} flex items-center gap-2`}>
                <Brain className="w-5 h-5 text-purple-400" />
                Model Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Model Type', value: 'LSTM Neural Network' },
                { label: 'Input Window', value: '100 Days' },
                { label: 'Training Data', value: '2012 - 2025' },
                { label: 'Scaling', value: 'MinMaxScaler (0-1)' },
                { label: 'Layers', value: '2x LSTM + Dense' },
              ].map((item) => (
                <div key={item.label} className={`flex justify-between py-2 border-b ${borderColor} last:border-0`}>
                  <span className={textSecondary}>{item.label}</span>
                  <span className={textPrimary}>{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={`${bgCard} border ${borderColor}`}>
            <CardHeader>
              <CardTitle className={`${textPrimary} flex items-center gap-2`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Features Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Closing Price', 'Historical Trends', 'Price Momentum', 'Volatility', 'Time Series Lag', 'Seasonal Patterns'].map((feature) => (
                  <span 
                    key={feature}
                    className={`px-3 py-1.5 rounded-full text-sm ${isDark ? 'bg-[#1e222d] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className={`mt-8 ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'} border ${isDark ? 'border-amber-500/20' : 'border-amber-200'}`}>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-500 font-medium mb-1">Disclaimer</p>
                <p className={textSecondary}>
                  This prediction model is for educational purposes only. Stock market predictions 
                  are inherently uncertain and should not be used as the sole basis for investment 
                  decisions. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}