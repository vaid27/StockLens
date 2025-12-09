import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Plus, Trash2, Edit2, 
  PieChart as PieChartIcon, BarChart3, AlertTriangle, Sparkles,
  ArrowUpRight, ArrowDownRight, Search, Calendar, DollarSign
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line 
} from 'recharts';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

// Sample portfolio data
const initialHoldings = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgPrice: 145.00, currentPrice: 178.42, type: 'stock', sector: 'Technology' },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 25, avgPrice: 320.00, currentPrice: 378.91, type: 'stock', sector: 'Technology' },
  { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, avgPrice: 125.00, currentPrice: 141.80, type: 'stock', sector: 'Technology' },
  { id: 4, symbol: 'BTC-USD', name: 'Bitcoin', shares: 0.5, avgPrice: 42000, currentPrice: 67542, type: 'crypto', sector: 'Crypto' },
  { id: 5, symbol: 'VOO', name: 'Vanguard S&P 500', shares: 20, avgPrice: 380, currentPrice: 478.50, type: 'etf', sector: 'ETF' },
];

const COLORS = ['#14b8a6', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#10b981'];

const allStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'VOO', name: 'Vanguard S&P 500' },
  { symbol: 'QQQ', name: 'Invesco QQQ' },
];

const generatePerformanceData = (days = 30) => {
  const data = [];
  let value = 45000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value += (Math.random() - 0.45) * 800;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(value, 40000)
    });
  }
  return data;
};

export default function Portfolio({ isDark = true }) {
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem('portfolio_holdings');
    return saved ? JSON.parse(saved) : initialHoldings;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceRange, setPerformanceRange] = useState('1M');
  const [performanceData, setPerformanceData] = useState(() => generatePerformanceData(30));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchStock, setSearchStock] = useState('');
  const [newTrade, setNewTrade] = useState({
    symbol: '',
    type: 'buy',
    shares: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('portfolio_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    const daysMap = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'All': 730 };
    setPerformanceData(generatePerformanceData(daysMap[performanceRange]));
  }, [performanceRange]);

  // Calculate portfolio metrics
  const portfolioMetrics = holdings.reduce((acc, h) => {
    const value = h.shares * h.currentPrice;
    const cost = h.shares * h.avgPrice;
    const pnl = value - cost;
    return {
      totalValue: acc.totalValue + value,
      totalCost: acc.totalCost + cost,
      totalPnL: acc.totalPnL + pnl
    };
  }, { totalValue: 0, totalCost: 0, totalPnL: 0 });

  const totalReturn = (portfolioMetrics.totalPnL / portfolioMetrics.totalCost) * 100;
  const todayChange = portfolioMetrics.totalValue * 0.012; // Simulated
  const todayChangePercent = 1.2;

  // Allocation data
  const allocationData = holdings.map((h, i) => ({
    name: h.symbol,
    value: ((h.shares * h.currentPrice) / portfolioMetrics.totalValue * 100).toFixed(1),
    amount: h.shares * h.currentPrice,
    color: COLORS[i % COLORS.length]
  }));

  // Asset class breakdown
  const assetClassData = holdings.reduce((acc, h) => {
    const value = h.shares * h.currentPrice;
    const type = h.type.charAt(0).toUpperCase() + h.type.slice(1);
    const existing = acc.find(a => a.name === type);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: type, value });
    }
    return acc;
  }, []);

  // Sector exposure
  const sectorData = holdings.reduce((acc, h) => {
    const value = h.shares * h.currentPrice;
    const existing = acc.find(a => a.name === h.sector);
    if (existing) {
      existing.value += value;
    } else {
      acc.push({ name: h.sector, value });
    }
    return acc;
  }, []);

  const handleAddTrade = () => {
    if (!newTrade.symbol || !newTrade.shares || !newTrade.price) return;

    const stockInfo = allStocks.find(s => s.symbol === newTrade.symbol);
    const existing = holdings.find(h => h.symbol === newTrade.symbol);

    if (existing && newTrade.type === 'buy') {
      const totalShares = existing.shares + parseFloat(newTrade.shares);
      const totalCost = (existing.shares * existing.avgPrice) + (parseFloat(newTrade.shares) * parseFloat(newTrade.price));
      setHoldings(holdings.map(h => 
        h.symbol === newTrade.symbol 
          ? { ...h, shares: totalShares, avgPrice: totalCost / totalShares }
          : h
      ));
    } else if (newTrade.type === 'buy') {
      setHoldings([...holdings, {
        id: Date.now(),
        symbol: newTrade.symbol,
        name: stockInfo?.name || newTrade.symbol,
        shares: parseFloat(newTrade.shares),
        avgPrice: parseFloat(newTrade.price),
        currentPrice: parseFloat(newTrade.price) * (1 + Math.random() * 0.1),
        type: newTrade.symbol.includes('-') ? 'crypto' : 'stock',
        sector: 'Technology'
      }]);
    } else if (existing && newTrade.type === 'sell') {
      const newShares = existing.shares - parseFloat(newTrade.shares);
      if (newShares <= 0) {
        setHoldings(holdings.filter(h => h.symbol !== newTrade.symbol));
      } else {
        setHoldings(holdings.map(h => 
          h.symbol === newTrade.symbol ? { ...h, shares: newShares } : h
        ));
      }
    }

    setNewTrade({ symbol: '', type: 'buy', shares: '', price: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setIsAddDialogOpen(false);
  };

  const deleteHolding = (id) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  // Risk calculation
  const riskScore = Math.min(100, Math.max(0, 
    (holdings.filter(h => h.type === 'crypto').length / holdings.length) * 40 +
    (holdings.filter(h => h.sector === 'Technology').length / holdings.length) * 30 +
    30
  ));

  const getRiskLabel = (score) => {
    if (score >= 70) return { label: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (score >= 40) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { label: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  };

  const risk = getRiskLabel(riskScore);

  // Styles
  const bgCard = isDark ? 'bg-[#0f1419]/80' : 'bg-white/90';
  const borderColor = isDark ? 'border-[#1e2530]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgInput = isDark ? 'bg-[#1a1f2e]' : 'bg-gray-50';

  const filteredStocks = allStocks.filter(s => 
    s.symbol.toLowerCase().includes(searchStock.toLowerCase()) ||
    s.name.toLowerCase().includes(searchStock.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-6">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-2xl font-bold ${textPrimary} mb-1`}>Portfolio</h1>
        <p className={`text-sm ${textSecondary}`}>Track your investments and analyze performance</p>
        <div className={`mt-4 h-px bg-gradient-to-r from-teal-500/50 via-transparent to-transparent`} />
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-100'} p-1 rounded-xl`}>
          <TabsTrigger value="overview" className="rounded-lg text-sm">Overview</TabsTrigger>
          <TabsTrigger value="add" className="rounded-lg text-sm">Add Investment</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg text-sm">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Value Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className={`text-sm ${textSecondary} mb-1`}>Total Portfolio Value</p>
                <div className="flex items-baseline gap-3">
                  <h2 className={`text-4xl font-bold ${textPrimary}`}>
                    ${portfolioMetrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                  <span className={`flex items-center gap-1 text-lg font-semibold ${todayChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {todayChange >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    ${Math.abs(todayChange).toFixed(2)} ({todayChangePercent.toFixed(2)}%)
                  </span>
                </div>
                <p className={`text-sm mt-2 ${textSecondary}`}>
                  Today's change
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className={`text-xs ${textSecondary} mb-1`}>Total Invested</p>
                  <p className={`text-lg font-semibold ${textPrimary}`}>
                    ${portfolioMetrics.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary} mb-1`}>Total P&L</p>
                  <p className={`text-lg font-semibold ${portfolioMetrics.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {portfolioMetrics.totalPnL >= 0 ? '+' : ''}${portfolioMetrics.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary} mb-1`}>Total Return</p>
                  <p className={`text-lg font-semibold ${totalReturn >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm font-medium ${textSecondary}`}>Performance</p>
                <div className="flex gap-1">
                  {['1M', '3M', '6M', '1Y', 'All'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setPerformanceRange(range)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        performanceRange === range 
                          ? 'bg-teal-500 text-white' 
                          : `${isDark ? 'bg-[#1a1f2e] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1a1f2e' : '#fff', 
                        border: `1px solid ${isDark ? '#2a3441' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} fill="url(#perfGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Holdings Table */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`lg:col-span-2 ${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl overflow-hidden shadow-xl`}
            >
              <div className={`px-6 py-4 border-b ${borderColor} flex items-center justify-between`}>
                <h3 className={`font-semibold ${textPrimary}`}>Holdings</h3>
                <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`text-xs ${textSecondary} border-b ${borderColor}`}>
                      <th className="text-left px-6 py-3 font-medium">Asset</th>
                      <th className="text-right px-4 py-3 font-medium">Shares</th>
                      <th className="text-right px-4 py-3 font-medium">Avg Price</th>
                      <th className="text-right px-4 py-3 font-medium">Current</th>
                      <th className="text-right px-4 py-3 font-medium">P&L</th>
                      <th className="text-right px-4 py-3 font-medium">Allocation</th>
                      <th className="text-right px-6 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => {
                      const value = holding.shares * holding.currentPrice;
                      const cost = holding.shares * holding.avgPrice;
                      const pnl = value - cost;
                      const pnlPercent = (pnl / cost) * 100;
                      const allocation = (value / portfolioMetrics.totalValue) * 100;

                      return (
                        <motion.tr 
                          key={holding.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b ${borderColor} hover:${isDark ? 'bg-[#1a1f2e]/50' : 'bg-gray-50'} transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${COLORS[index % COLORS.length]}20`, color: COLORS[index % COLORS.length] }}>
                                {holding.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className={`font-medium text-sm ${textPrimary}`}>{holding.symbol}</p>
                                <p className={`text-xs ${textSecondary}`}>{holding.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className={`text-right px-4 py-4 text-sm ${textPrimary}`}>{holding.shares}</td>
                          <td className={`text-right px-4 py-4 text-sm ${textSecondary}`}>${holding.avgPrice.toFixed(2)}</td>
                          <td className={`text-right px-4 py-4 text-sm ${textPrimary}`}>${holding.currentPrice.toFixed(2)}</td>
                          <td className={`text-right px-4 py-4`}>
                            <span className={`text-sm font-medium ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                            </span>
                          </td>
                          <td className="text-right px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${allocation}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                              </div>
                              <span className={`text-xs ${textSecondary}`}>{allocation.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="text-right px-6 py-4">
                            <button onClick={() => deleteHolding(holding.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Allocation Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Allocation</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1a1f2e' : '#fff', 
                        border: `1px solid ${isDark ? '#2a3441' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {allocationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className={`text-xs ${textSecondary}`}>{item.name}</span>
                    </div>
                    <span className={`text-xs font-medium ${textPrimary}`}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Add Investment Tab */}
        <TabsContent value="add" className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-2xl mx-auto ${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-8 shadow-xl`}
          >
            <h3 className={`text-xl font-semibold ${textPrimary} mb-6`}>Add Investment</h3>
            
            <div className="space-y-6">
              {/* Stock Search */}
              <div>
                <Label className={`text-sm ${textSecondary} mb-2 block`}>Search Stock</Label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
                  <Input
                    value={searchStock}
                    onChange={(e) => setSearchStock(e.target.value)}
                    placeholder="Search by symbol or name..."
                    className={`pl-10 ${bgInput} border-${borderColor} ${textPrimary} rounded-xl`}
                  />
                </div>
                {searchStock && (
                  <div className={`mt-2 ${bgInput} border ${borderColor} rounded-xl max-h-40 overflow-y-auto`}>
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => { setNewTrade({ ...newTrade, symbol: stock.symbol }); setSearchStock(''); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:${isDark ? 'bg-[#252d3d]' : 'bg-gray-100'} transition-colors flex items-center justify-between`}
                      >
                        <span className={textPrimary}>{stock.symbol}</span>
                        <span className={textSecondary}>{stock.name}</span>
                      </button>
                    ))}
                  </div>
                )}
                {newTrade.symbol && (
                  <div className={`mt-2 px-3 py-2 ${isDark ? 'bg-teal-500/10' : 'bg-teal-50'} rounded-lg inline-flex items-center gap-2`}>
                    <span className="text-teal-500 text-sm font-medium">{newTrade.symbol}</span>
                    <button onClick={() => setNewTrade({ ...newTrade, symbol: '' })} className="text-teal-500 hover:text-teal-400">×</button>
                  </div>
                )}
              </div>

              {/* Buy/Sell Toggle */}
              <div>
                <Label className={`text-sm ${textSecondary} mb-2 block`}>Transaction Type</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewTrade({ ...newTrade, type: 'buy' })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      newTrade.type === 'buy' 
                        ? 'bg-emerald-500 text-white' 
                        : `${bgInput} ${textSecondary}`
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setNewTrade({ ...newTrade, type: 'sell' })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      newTrade.type === 'sell' 
                        ? 'bg-red-500 text-white' 
                        : `${bgInput} ${textSecondary}`
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`text-sm ${textSecondary} mb-2 block`}>Quantity</Label>
                  <Input
                    type="number"
                    value={newTrade.shares}
                    onChange={(e) => setNewTrade({ ...newTrade, shares: e.target.value })}
                    placeholder="0"
                    className={`${bgInput} border-${borderColor} ${textPrimary} rounded-xl`}
                  />
                </div>
                <div>
                  <Label className={`text-sm ${textSecondary} mb-2 block`}>Price per Share</Label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
                    <Input
                      type="number"
                      value={newTrade.price}
                      onChange={(e) => setNewTrade({ ...newTrade, price: e.target.value })}
                      placeholder="0.00"
                      className={`pl-10 ${bgInput} border-${borderColor} ${textPrimary} rounded-xl`}
                    />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <Label className={`text-sm ${textSecondary} mb-2 block`}>Date of Purchase</Label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
                  <Input
                    type="date"
                    value={newTrade.date}
                    onChange={(e) => setNewTrade({ ...newTrade, date: e.target.value })}
                    className={`pl-10 ${bgInput} border-${borderColor} ${textPrimary} rounded-xl`}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className={`text-sm ${textSecondary} mb-2 block`}>Notes (Optional)</Label>
                <textarea
                  value={newTrade.notes}
                  onChange={(e) => setNewTrade({ ...newTrade, notes: e.target.value })}
                  placeholder="Add any notes..."
                  rows={3}
                  className={`w-full px-4 py-3 ${bgInput} border ${borderColor} ${textPrimary} rounded-xl resize-none outline-none focus:ring-2 focus:ring-teal-500/50`}
                />
              </div>

              {/* Summary */}
              {newTrade.shares && newTrade.price && (
                <div className={`p-4 ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-50'} rounded-xl`}>
                  <p className={`text-sm ${textSecondary} mb-2`}>Transaction Summary</p>
                  <p className={`text-2xl font-bold ${textPrimary}`}>
                    ${(parseFloat(newTrade.shares) * parseFloat(newTrade.price)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button 
                onClick={handleAddTrade}
                disabled={!newTrade.symbol || !newTrade.shares || !newTrade.price}
                className="w-full py-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-medium text-base"
              >
                {newTrade.type === 'buy' ? 'Add Investment' : 'Record Sale'}
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Risk Score */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Risk Score
              </h3>
              <div className="flex items-center justify-center my-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke={isDark ? '#1e2530' : '#e5e7eb'} strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="42" fill="transparent"
                      stroke={riskScore >= 70 ? '#ef4444' : riskScore >= 40 ? '#f59e0b' : '#10b981'}
                      strokeWidth="10"
                      strokeDasharray={`${riskScore * 2.64} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${textPrimary}`}>{Math.round(riskScore)}</span>
                    <span className={`text-xs ${risk.color}`}>{risk.label}</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 ${risk.bg} rounded-xl`}>
                <p className={`text-xs ${risk.color}`}>
                  {riskScore >= 70 
                    ? 'High exposure to volatile assets. Consider diversifying.'
                    : riskScore >= 40 
                    ? 'Moderate risk level. Portfolio is reasonably balanced.'
                    : 'Conservative portfolio with low volatility exposure.'
                  }
                </p>
              </div>
            </motion.div>

            {/* P&L Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4`}>P&L Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${textSecondary}`}>Total P&L</span>
                  <span className={`font-semibold ${portfolioMetrics.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {portfolioMetrics.totalPnL >= 0 ? '+' : ''}${portfolioMetrics.totalPnL.toFixed(2)}
                  </span>
                </div>
                <div className={`h-px ${isDark ? 'bg-[#1e2530]' : 'bg-gray-200'}`} />
                <div>
                  <p className={`text-xs ${textSecondary} mb-2`}>Best Performer</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>
                        {holdings.reduce((best, h) => {
                          const pnl = (h.currentPrice - h.avgPrice) / h.avgPrice * 100;
                          return pnl > best.pnl ? { symbol: h.symbol, pnl } : best;
                        }, { symbol: '', pnl: -Infinity }).symbol}
                      </p>
                      <p className="text-xs text-emerald-500">
                        +{holdings.reduce((best, h) => {
                          const pnl = (h.currentPrice - h.avgPrice) / h.avgPrice * 100;
                          return pnl > best ? pnl : best;
                        }, -Infinity).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className={`text-xs ${textSecondary} mb-2`}>Worst Performer</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>
                        {holdings.reduce((worst, h) => {
                          const pnl = (h.currentPrice - h.avgPrice) / h.avgPrice * 100;
                          return pnl < worst.pnl ? { symbol: h.symbol, pnl } : worst;
                        }, { symbol: '', pnl: Infinity }).symbol}
                      </p>
                      <p className="text-xs text-red-500">
                        {holdings.reduce((worst, h) => {
                          const pnl = (h.currentPrice - h.avgPrice) / h.avgPrice * 100;
                          return pnl < worst ? pnl : worst;
                        }, Infinity).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Asset Class Breakdown */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4`}>Asset Class</h3>
              <div className="space-y-3">
                {assetClassData.map((item, i) => {
                  const percent = (item.value / portfolioMetrics.totalValue) * 100;
                  return (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span className={`text-sm ${textSecondary}`}>{item.name}</span>
                        <span className={`text-sm font-medium ${textPrimary}`}>{percent.toFixed(1)}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDark ? 'bg-[#1e2530]' : 'bg-gray-200'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sector Exposure & AI Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Sector Exposure */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Sector Exposure
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} layout="vertical">
                    <XAxis type="number" tick={{ fill: textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#1a1f2e' : '#fff', 
                        border: `1px solid ${isDark ? '#2a3441' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${bgCard} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 shadow-xl`}
            >
              <h3 className={`font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5 text-cyan-500" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {[
                  { text: `Your portfolio is ${holdings.filter(h => h.sector === 'Technology').length > holdings.length / 2 ? 'overweight' : 'balanced'} in Technology stocks.`, type: holdings.filter(h => h.sector === 'Technology').length > holdings.length / 2 ? 'warning' : 'success' },
                  { text: `Risk score is ${risk.label.toLowerCase()}. ${riskScore >= 50 ? 'Consider diversifying into stable assets.' : 'Well diversified portfolio.'}`, type: riskScore >= 50 ? 'warning' : 'success' },
                  { text: `Total return of ${totalReturn.toFixed(1)}% ${totalReturn >= 10 ? 'outperforms' : 'underperforms'} the market average.`, type: totalReturn >= 10 ? 'success' : 'info' },
                  { text: holdings.some(h => h.type === 'crypto') ? 'Crypto allocation adds volatility. Monitor closely.' : 'No crypto exposure detected.', type: holdings.some(h => h.type === 'crypto') ? 'warning' : 'info' },
                ].map((insight, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl text-sm ${
                      insight.type === 'warning' ? `${isDark ? 'bg-amber-500/10' : 'bg-amber-50'} text-amber-500` :
                      insight.type === 'success' ? `${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'} text-emerald-500` :
                      `${isDark ? 'bg-blue-500/10' : 'bg-blue-50'} text-blue-500`
                    }`}
                  >
                    {insight.text}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}