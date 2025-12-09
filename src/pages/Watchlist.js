import React, { useState, useEffect } from 'react';
import { Star, Trash2, Bell, BellOff, TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

const allStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.42, changePercent: 1.24 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, changePercent: -0.56 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, changePercent: 0.89 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, changePercent: 2.15 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, changePercent: -1.32 },
  { symbol: 'META', name: 'Meta Platforms', price: 505.75, changePercent: 1.67 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, changePercent: 3.42 },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 67542.18, changePercent: -0.89 },
  { symbol: 'ETH-USD', name: 'Ethereum', price: 3456.72, changePercent: 1.45 },
  { symbol: 'SOL-USD', name: 'Solana', price: 172.34, changePercent: 4.21 },
];

export default function Watchlist({ isDark = true }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : ['AAPL', 'TSLA', 'BTC-USD'];
  });
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('alerts');
    return saved ? JSON.parse(saved) : {};
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  const watchlistStocks = allStocks.filter(s => watchlist.includes(s.symbol));
  const availableStocks = allStocks.filter(s => 
    !watchlist.includes(s.symbol) && 
    (s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const removeFromWatchlist = (symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  const addToWatchlist = (symbol) => {
    setWatchlist(prev => [...prev, symbol]);
    setIsAddDialogOpen(false);
  };

  const toggleAlert = (symbol) => {
    setAlerts(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgHover = isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-50';

  const totalValue = watchlistStocks.reduce((sum, s) => sum + s.price, 0);
  const avgChange = watchlistStocks.reduce((sum, s) => sum + s.changePercent, 0) / (watchlistStocks.length || 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary} flex items-center gap-3`}>
              <Star className="w-8 h-8 text-amber-400 fill-current" />
              My Watchlist
            </h1>
            <p className={`${textSecondary} mt-1`}>
              Track your favorite stocks and get alerts
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className={`${bgCard} ${borderColor} border`}>
              <DialogHeader>
                <DialogTitle className={textPrimary}>Add to Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
                  <Input
                    placeholder="Search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : ''} ${textPrimary}`}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {availableStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => addToWatchlist(stock.symbol)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${bgHover} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                          stock.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className={`font-medium ${textPrimary}`}>{stock.symbol}</p>
                          <p className={`text-xs ${textSecondary}`}>{stock.name}</p>
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-cyan-400" />
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className={`${bgCard} border ${borderColor} rounded-xl p-4`}>
            <p className={`text-xs ${textSecondary} mb-1`}>Watching</p>
            <p className={`text-2xl font-bold ${textPrimary}`}>{watchlist.length}</p>
          </div>
          <div className={`${bgCard} border ${borderColor} rounded-xl p-4`}>
            <p className={`text-xs ${textSecondary} mb-1`}>Avg Change</p>
            <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </p>
          </div>
          <div className={`${bgCard} border ${borderColor} rounded-xl p-4 col-span-2 md:col-span-1`}>
            <p className={`text-xs ${textSecondary} mb-1`}>Alerts Active</p>
            <p className={`text-2xl font-bold text-amber-400`}>
              {Object.values(alerts).filter(Boolean).length}
            </p>
          </div>
        </div>

        {/* Watchlist Items */}
        {watchlistStocks.length === 0 ? (
          <div className={`${bgCard} border ${borderColor} rounded-xl p-12 text-center`}>
            <Star className={`w-12 h-12 mx-auto mb-4 ${textSecondary}`} />
            <h3 className={`${textPrimary} font-semibold text-lg mb-2`}>No stocks in watchlist</h3>
            <p className={`${textSecondary} mb-4`}>Add stocks to track their performance</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Stock
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {watchlistStocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`${bgCard} border ${borderColor} rounded-xl p-4 ${bgHover} transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <Link 
                      to={createPageUrl('Home') + `?symbol=${stock.symbol}`}
                      className="flex items-center gap-4 flex-1"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        stock.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className={`font-semibold ${textPrimary}`}>{stock.symbol}</p>
                        <p className={`text-sm ${textSecondary}`}>{stock.name}</p>
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={`font-bold ${textPrimary}`}>
                          ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <p className={`text-sm flex items-center justify-end gap-1 ${
                          stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleAlert(stock.symbol)}
                          className={alerts[stock.symbol] ? 'text-amber-400' : textSecondary}
                        >
                          {alerts[stock.symbol] ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFromWatchlist(stock.symbol)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}