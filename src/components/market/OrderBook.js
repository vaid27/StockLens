import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Layers } from 'lucide-react';

const generateOrderBook = (midPrice) => {
  const bids = [];
  const asks = [];
  
  for (let i = 0; i < 20; i++) {
    const bidPrice = midPrice * (1 - (i + 1) * 0.001);
    const askPrice = midPrice * (1 + (i + 1) * 0.001);
    const bidSize = Math.floor(100 + Math.random() * 5000);
    const askSize = Math.floor(100 + Math.random() * 5000);
    
    bids.push({ price: bidPrice, size: bidSize, total: bids.reduce((s, b) => s + b.size, 0) + bidSize });
    asks.push({ price: askPrice, size: askSize, total: asks.reduce((s, a) => s + a.size, 0) + askSize });
  }
  
  return { bids, asks };
};

export default function OrderBook({ symbol, currentPrice = 178.42, isDark = true }) {
  const [orderBook, setOrderBook] = useState(() => generateOrderBook(currentPrice));
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook(currentPrice));
      setLastUpdate(new Date());
    }, 2000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  const maxBidTotal = Math.max(...orderBook.bids.map(b => b.total));
  const maxAskTotal = Math.max(...orderBook.asks.map(a => a.total));
  const spread = orderBook.asks[0]?.price - orderBook.bids[0]?.price;
  const spreadPercent = (spread / currentPrice) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl overflow-hidden`}
    >
      <div className={`px-4 py-3 border-b ${borderColor} flex items-center justify-between`}>
        <h3 className={`${textPrimary} font-semibold flex items-center gap-2`}>
          <Layers className="w-5 h-5 text-cyan-400" />
          Order Book
        </h3>
        <div className={`text-xs ${textSecondary}`}>
          Spread: ${spread?.toFixed(4)} ({spreadPercent?.toFixed(3)}%)
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Bids */}
        <div className={`border-r ${borderColor}`}>
          <div className={`grid grid-cols-3 px-3 py-2 text-xs ${textSecondary} border-b ${borderColor}`}>
            <span>Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {orderBook.bids.map((bid, i) => (
              <div key={i} className="relative grid grid-cols-3 px-3 py-1.5 text-xs">
                <div 
                  className="absolute inset-y-0 right-0 bg-emerald-500/10"
                  style={{ width: `${(bid.total / maxBidTotal) * 100}%` }}
                />
                <span className="relative text-emerald-400 font-mono">${bid.price.toFixed(2)}</span>
                <span className={`relative text-right ${textPrimary} font-mono`}>{bid.size.toLocaleString()}</span>
                <span className={`relative text-right ${textSecondary} font-mono`}>{bid.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div>
          <div className={`grid grid-cols-3 px-3 py-2 text-xs ${textSecondary} border-b ${borderColor}`}>
            <span>Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {orderBook.asks.map((ask, i) => (
              <div key={i} className="relative grid grid-cols-3 px-3 py-1.5 text-xs">
                <div 
                  className="absolute inset-y-0 left-0 bg-red-500/10"
                  style={{ width: `${(ask.total / maxAskTotal) * 100}%` }}
                />
                <span className="relative text-red-400 font-mono">${ask.price.toFixed(2)}</span>
                <span className={`relative text-right ${textPrimary} font-mono`}>{ask.size.toLocaleString()}</span>
                <span className={`relative text-right ${textSecondary} font-mono`}>{ask.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`px-3 py-2 border-t ${borderColor} text-xs ${textSecondary} text-center`}>
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </motion.div>
  );
}