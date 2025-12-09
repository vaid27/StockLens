import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../../components/ui/button";
import StockCard from './StockCard';

export default function StockCarousel({ 
  title, 
  stocks, 
  selectedSymbol, 
  onSelectStock, 
  onAddToWatchlist,
  watchlist = [],
  isDark = true 
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgButton = isDark ? 'bg-[#1e222d]' : 'bg-gray-100';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${textPrimary} text-lg font-semibold flex items-center gap-2`}>
          {title}
          <ChevronRight className={`w-4 h-4 ${textSecondary}`} />
        </h2>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => scroll('left')}
            className={`w-8 h-8 rounded-full ${bgButton} ${textSecondary} hover:text-white`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => scroll('right')}
            className={`w-8 h-8 rounded-full ${bgButton} ${textSecondary} hover:text-white`}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            name={stock.name}
            price={stock.price}
            changePercent={stock.changePercent}
            isActive={selectedSymbol === stock.symbol}
            onClick={() => onSelectStock(stock.symbol)}
            onAddToWatchlist={onAddToWatchlist}
            isInWatchlist={watchlist.includes(stock.symbol)}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}