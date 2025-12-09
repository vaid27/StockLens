import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion } from 'framer-motion';

export default function StockSearchInput({ value, onChange, onSearch, isDark = true }) {
  const [isFocused, setIsFocused] = useState(false);

  const bgInput = isDark ? 'bg-[#1e222d]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div 
        animate={{ 
          boxShadow: isFocused ? '0 0 0 2px rgba(20, 184, 166, 0.2)' : '0 0 0 0px transparent'
        }}
        className={`
          flex items-center gap-2 ${bgInput} rounded-xl border transition-all duration-200
          ${isFocused ? 'border-cyan-500' : borderColor}
        `}
      >
        <div className="pl-4">
          <Search className={`w-5 h-5 ${textSecondary}`} />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter stock symbol (e.g., AAPL, BTC-USD)"
          className={`bg-transparent border-0 ${textPrimary} placeholder:${textSecondary} focus-visible:ring-0 focus-visible:ring-offset-0 py-6`}
        />
        {value && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onChange('')}
            className={`${textSecondary} hover:text-white mr-2`}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button 
          type="submit"
          className="mr-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-cyan-500/20"
        >
          Search
        </Button>
      </motion.div>
    </form>
  );
}