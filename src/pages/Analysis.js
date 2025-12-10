import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Info, LineChart as LineChartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import MovingAveragesChart from '../components/charts/MovingAveragesChart';
import TechnicalIndicators from '../components/charts/TechnicalIndicators';
import TimeRangeSelector from '../components/stocks/TimeRangeSelector';
import StockSearchInput from '../components/stocks/StockSearchInput';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { fetchStockData, checkBackendHealth } from '../services/stockService';

const generateMAData = (days, startPrice) => {
  const data = [];
  let price = startPrice;
  const now = new Date();
  const prices = [];
  
  for (let i = days + 200; i >= 0; i--) {
    const change = (Math.random() - 0.48) * (price * 0.02);
    price = Math.max(price + change, price * 0.5);
    prices.push(price);
  }
  
  for (let i = 200; i < prices.length; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (prices.length - 1 - i));
    
    const ma50 = prices.slice(i - 50, i).reduce((a, b) => a + b, 0) / 50;
    const ma200 = prices.slice(i - 200, i).reduce((a, b) => a + b, 0) / 200;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: prices[i],
      ma50,
      ma200
    });
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

export default function Analysis({ isDark = true }) {
  const urlParams = new URLSearchParams(window.location.search);
  const initialSymbol = urlParams.get('symbol') || 'AAPL';
  
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [timeRange, setTimeRange] = useState('1Y');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        return liveData.price;
      } else {
        const fallback = STOCK_INFO[selectedSymbol] || { symbol: selectedSymbol, name: selectedSymbol, price: 100 };
        setStockInfo(fallback);
        return fallback.price;
      }
    } catch (error) {
      const fallback = STOCK_INFO[selectedSymbol] || { symbol: selectedSymbol, name: selectedSymbol, price: 100 };
      setStockInfo(fallback);
      return fallback.price;
    }
  };

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  useEffect(() => {
    setIsLoading(true);
    loadStockInfo().then((currentPrice) => {
      const timer = setTimeout(() => {
        const daysMap = { '1D': 30, '1W': 50, '1M': 90, '3M': 180, '1Y': 365, '5Y': 1000, 'All': 2000 };
        const days = daysMap[timeRange] || 365;
        setChartData(generateMAData(days, currentPrice));
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    });
  }, [selectedSymbol, timeRange]);

  const handleSearch = (symbol) => {
    if (symbol) setSelectedSymbol(symbol);
  };

  const latestData = chartData[chartData.length - 1];
  const ma50AboveMA200 = latestData?.ma50 > latestData?.ma200;
  const priceAboveMA50 = latestData?.price > latestData?.ma50;
  const priceAboveMA200 = latestData?.price > latestData?.ma200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-4">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Technical Analysis</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-bold ${textPrimary} mb-3`}>
            Moving Averages & Indicators
          </h1>
          <p className={`${textSecondary} max-w-xl mx-auto`}>
            Visualize price trends with MA50, MA200, and technical indicators
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
            {latestData && (
              <p className={`${textSecondary} mt-1`}>
                Current: <span className={`${textPrimary} font-medium`}>${latestData.price.toFixed(2)}</span>
              </p>
            )}
          </div>
          <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} isDark={isDark} />
        </div>

        {/* Moving Averages Chart */}
        <div className={`${bgCard} border ${borderColor} rounded-xl p-6 mb-6`}>
          <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
            <LineChartIcon className="w-5 h-5 text-cyan-400" />
            Price with Moving Averages
          </h3>
          <MovingAveragesChart data={chartData} isLoading={isLoading} isDark={isDark} />
        </div>

        {/* MA Legend & Signals */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className={`${bgCard} border ${borderColor}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary} flex items-center gap-2`}>
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                Closing Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${textPrimary}`}>
                ${latestData?.price.toFixed(2) || '—'}
              </p>
            </CardContent>
          </Card>

          <Card className={`${bgCard} border ${borderColor}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary} flex items-center gap-2`}>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                MA50 (50-Day)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3" /></TooltipTrigger>
                    <TooltipContent><p>Short-term trend indicator</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${textPrimary}`}>
                ${latestData?.ma50.toFixed(2) || '—'}
              </p>
            </CardContent>
          </Card>

          <Card className={`${bgCard} border ${borderColor}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary} flex items-center gap-2`}>
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                MA200 (200-Day)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3" /></TooltipTrigger>
                    <TooltipContent><p>Long-term trend indicator</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-xl font-bold ${textPrimary}`}>
                ${latestData?.ma200.toFixed(2) || '—'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Signal Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className={`border ${ma50AboveMA200 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                {ma50AboveMA200 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${ma50AboveMA200 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ma50AboveMA200 ? 'Golden Cross' : 'Death Cross'}
                </span>
              </div>
              <p className={textSecondary}>
                MA50 is {ma50AboveMA200 ? 'above' : 'below'} MA200
              </p>
            </CardContent>
          </Card>

          <Card className={`border ${priceAboveMA50 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                {priceAboveMA50 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${priceAboveMA50 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Short-term: {priceAboveMA50 ? 'Bullish' : 'Bearish'}
                </span>
              </div>
              <p className={textSecondary}>
                Price {priceAboveMA50 ? 'above' : 'below'} MA50
              </p>
            </CardContent>
          </Card>

          <Card className={`border ${priceAboveMA200 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                {priceAboveMA200 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${priceAboveMA200 ? 'text-emerald-400' : 'text-red-400'}`}>
                  Long-term: {priceAboveMA200 ? 'Bullish' : 'Bearish'}
                </span>
              </div>
              <p className={textSecondary}>
                Price {priceAboveMA200 ? 'above' : 'below'} MA200
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technical Indicators */}
        <TechnicalIndicators symbol={selectedSymbol} isDark={isDark} />
      </motion.div>
    </div>
  );
}