import React from 'react';

const ranges = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'All'];

export default function TimeRangeSelector({ selected, onSelect, isDark = true }) {
  return (
    <div className={`flex items-center gap-0.5 p-1 rounded-xl ${isDark ? 'bg-[#1a1f2e]' : 'bg-gray-100'}`}>
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onSelect(range)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
            ${selected === range 
              ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' 
              : `${isDark ? 'text-gray-400 hover:text-white hover:bg-[#252d3d]' : 'text-gray-500 hover:text-gray-900 hover:bg-white'}`
            }
          `}
        >
          {range}
        </button>
      ))}
    </div>
  );
}