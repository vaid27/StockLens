import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import StockCarousel from '../components/stocks/StockCarousel';
import KPICard from '../components/stocks/KPICard';
import TimeRangeSelector from '../components/stocks/TimeRangeSelector';
import PriceChart from '../components/charts/PriceChart';
import StockSearchInput from '../components/stocks/StockSearchInput';
import FundamentalsPanel from '../components/stocks/FundamentalsPanel';
import AnalystRatings from '../components/stocks/AnalystRatings';
import NewsFeed from '../components/stocks/NewsFeed';
import TechnicalIndicators from '../components/charts/TechnicalIndicators';
import MarketHeatmap from '../components/market/MarketHeatmap';
import AutoRefreshToggle from '../components/stocks/AutoRefreshToggle';
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { fetchStockData, fetchStockHistory, checkBackendHealth } from '../services/stockService';

const SAMPLE_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.42, changePercent: 1.24 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, changePercent: -0.56 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, changePercent: 0.89 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, changePercent: 2.15 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, changePercent: -1.32 },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, changePercent: 1.67 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, changePercent: 3.42 },
];

const CRYPTO_STOCKS = [
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 67542.18, changePercent: -0.89 },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3456.72, changePercent: 1.45 },
  { symbol: 'SOL-USD', name: 'Solana', price: 172.34, changePercent: 4.21 },
  { symbol: 'XRP-USD', name: 'Ripple', price: 0.62, changePercent: -2.15 },
  { symbol: 'ADA-USD', name: 'Cardano', price: 0.58, changePercent: 0.78 },
];

const generateChartData = (days, startPrice) => {
  const data = [];
  let price = startPrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const prevPrice = price;
    const change = (Math.random() - 0.48) * (price * 0.02);
    price = Math.max(price + change, price * 0.5);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price,
      prevPrice: prevPrice
    });
  }
  return data;
};

export default function Home({ isDark = true }) {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeRange, setTimeRange] = useState('1M');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [currentStock, setCurrentStock] = useState({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.42,
    changePercent: 1.24
  });
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : ['AAPL', 'TSLA', 'BTC-USD'];
  });

  // Check backend availability on mount
  useEffect(() => {
    checkBackendHealth().then(setBackendAvailable);
  }, []);

  // Load stock data from Yahoo Finance
  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const stockData = await fetchStockData(selectedSymbol);
      setCurrentStock(stockData);
      
      // Load historical data
      const periodMap = { '1D': '1d', '1W': '5d', '1M': '1mo', '3M': '3mo', '1Y': '1y', '5Y': '5y', 'All': '5y' };
      const period = periodMap[timeRange] || '1mo';
      const history = await fetchStockHistory(selectedSymbol, period);
      
      // Transform data for chart
      const transformedData = history.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: item.price,
        prevPrice: item.open
      }));
      
      setChartData(transformedData);
    } catch (error) {
      console.error('Error loading stock data:', error);
      // Fallback to sample data
      const fallbackStock = [...SAMPLE_STOCKS, ...CRYPTO_STOCKS].find(s => s.symbol === selectedSymbol) || {
        symbol: selectedSymbol,
        name: selectedSymbol,
        price: 100 + Math.random() * 500,
        changePercent: (Math.random() - 0.5) * 10
      };
      setCurrentStock(fallbackStock);
      const daysMap = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '1Y': 365, '5Y': 1825, 'All': 3650 };
      const days = daysMap[timeRange] || 30;
      setChartData(generateChartData(days, fallbackStock.price));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadStockData();
  }, [selectedSymbol, timeRange]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearch = (symbol) => {
    if (!symbol) return;
    
    // Allow any stock symbol to be searched
    setSelectedSymbol(symbol.toUpperCase());
    setSearchSymbol(''); // Clear search after search
  };

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const latestPrice = chartData[chartData.length - 1]?.price || currentStock.price;
  const firstPrice = chartData[0]?.price || currentStock.price;
  const priceChange = latestPrice - firstPrice;
  const percentChange = ((priceChange / firstPrice) * 100);

  const bgCard = isDark ? 'bg-[#0f1419]/80' : 'bg-white/90';
  const borderColor = isDark ? 'border-[#1e2530]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6 pb-16">
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <StockSearchInput 
          value={searchSymbol}
          onChange={setSearchSymbol}
          onSearch={handleSearch}
          isDark={isDark}
        />
      </div>

      {/* Stock Carousels */}
      <div className="space-y-6 mb-8">
        <StockCarousel 
          title="Popular Stocks"
          stocks={SAMPLE_STOCKS}
          selectedSymbol={selectedSymbol}
          onSelectStock={setSelectedSymbol}
          onAddToWatchlist={toggleWatchlist}
          watchlist={watchlist}
          isDark={isDark}
        />
        <StockCarousel 
          title="Cryptocurrency"
          stocks={CRYPTO_STOCKS}
          selectedSymbol={selectedSymbol}
          onSelectStock={setSelectedSymbol}
          onAddToWatchlist={toggleWatchlist}
          watchlist={watchlist}
          isDark={isDark}
        />
      </div>

      {/* Stock Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className={`text-2xl font-bold ${textPrimary}`}>{currentStock.symbol}</h2>
            <span className={textSecondary}>{currentStock.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-bold ${textPrimary}`}>
              {currentStock.price < 1 
                ? `$${latestPrice.toFixed(4)}` 
                : currentStock.price > 1000 
                  ? latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : `$${latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              }
            </span>
            <span className={`flex items-center gap-1 text-lg font-medium px-3 py-1 rounded-lg ${
              percentChange >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
            }`}>
              {percentChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {!backendAvailable && (
            <span className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
              📊 Demo Mode (Start backend for real data)
            </span>
          )}
          <AutoRefreshToggle onRefresh={loadStockData} isDark={isDark} />
          <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} isDark={isDark} />
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className={`${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-100'} p-1 rounded-xl`}>
          <TabsTrigger value="overview" className="rounded-lg text-sm">Overview</TabsTrigger>
          <TabsTrigger value="technical" className="rounded-lg text-sm">Technical</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg text-sm">AI Analysis</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PriceChart data={chartData} isLoading={isLoading} isDark={isDark} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard 
                label="Today's Price" 
                value={currentStock.price < 1 ? `$${latestPrice.toFixed(4)}` : currentStock.price > 1000 ? latestPrice.toFixed(2) : `$${latestPrice.toFixed(2)}`} 
                icon={DollarSign} 
                isDark={isDark} 
              />
              <KPICard 
                label="52-Week High" 
                value={currentStock.price < 1 ? `$${(latestPrice * 1.25).toFixed(4)}` : currentStock.price > 1000 ? (latestPrice * 1.25).toFixed(2) : `$${(latestPrice * 1.25).toFixed(2)}`} 
                icon={TrendingUp} 
                trend="up" 
                isDark={isDark} 
              />
              <KPICard 
                label="52-Week Low" 
                value={currentStock.price < 1 ? `$${(latestPrice * 0.75).toFixed(4)}` : currentStock.price > 1000 ? (latestPrice * 0.75).toFixed(2) : `$${(latestPrice * 0.75).toFixed(2)}`} 
                icon={TrendingDown} 
                trend="down" 
                isDark={isDark} 
              />
              <KPICard label="Volume" value={`${(Math.random() * 100).toFixed(1)}M`} icon={BarChart2} isDark={isDark} />
            </div>

            <MarketHeatmap isDark={isDark} onSelectStock={setSelectedSymbol} />
          </div>

          <div className="space-y-6">
            <FundamentalsPanel symbol={selectedSymbol} isDark={isDark} />
            <AnalystRatings symbol={selectedSymbol} currentPrice={latestPrice} isDark={isDark} />
            <NewsFeed symbol={selectedSymbol} isDark={isDark} />
          </div>
        </div>
      )}

      {/* Technical Tab */}
      {activeTab === 'technical' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <TechnicalIndicators symbol={selectedSymbol} isDark={isDark} />
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`${textPrimary} font-semibold mb-4`}>Technical Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'RSI (14)', value: '58.4', status: 'Neutral' },
                { label: 'MACD', value: 'Bullish', status: 'Buy Signal' },
                { label: 'Moving Avg', value: 'Above MA50', status: 'Bullish' },
              ].map((item) => (
                <div key={item.label} className={`flex justify-between p-3 rounded-xl ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-50'}`}>
                  <span className={textSecondary}>{item.label}</span>
                  <div className="text-right">
                    <span className={`${textPrimary} font-medium`}>{item.value}</span>
                    <span className="text-emerald-500 text-xs block">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Tab */}
      {activeTab === 'ai' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`${textPrimary} font-semibold mb-4 flex items-center gap-2`}>
              <Sparkles className="w-5 h-5 text-purple-400" />
              AI Predictions
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <p className={textSecondary}>7-Day Forecast</p>
                <p className="text-2xl font-bold text-emerald-500">+5.2%</p>
                <p className="text-xs text-emerald-400">Target: $187.50</p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-50'}`}>
                <p className={textSecondary}>30-Day Forecast</p>
                <p className={`text-2xl font-bold ${textPrimary}`}>+12.8%</p>
                <p className={`text-xs ${textSecondary}`}>Target: $201.25</p>
              </div>
            </div>
          </div>
          
          <div className={`${bgCard} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`${textPrimary} font-semibold mb-4`}>Model Confidence</h3>
            <div className="space-y-3">
              {[
                { model: 'LSTM', accuracy: 87 },
                { model: 'Transformer', accuracy: 91 },
                { model: 'Ensemble', accuracy: 89 },
              ].map((m) => (
                <div key={m.model}>
                  <div className="flex justify-between mb-1">
                    <span className={textSecondary}>{m.model}</span>
                    <span className={textPrimary}>{m.accuracy}%</span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-200'}`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${m.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className={`mt-8 ${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 text-center shadow-lg`}>
        <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>Ready for ML Predictions?</h3>
        <p className={`${textSecondary} text-sm mb-4`}>Get AI-powered price predictions and analysis</p>
        <div className="flex justify-center gap-3">
          <Link to={createPageUrl('Predictions') + `?symbol=${selectedSymbol}`}>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl px-6">
              <Sparkles className="w-4 h-4 mr-2" />
              View Predictions
            </Button>
          </Link>
          <Link to={createPageUrl('Analysis') + `?symbol=${selectedSymbol}`}>
            <Button variant="outline" className={`border-${borderColor} ${textPrimary} rounded-xl px-6`}>
              Technical Analysis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}