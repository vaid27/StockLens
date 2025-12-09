import React from 'react';

export const Badge = ({ className = '', variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-200',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    destructive: 'bg-red-500/20 text-red-400 border-red-500/30',
    outline: 'border border-slate-700 text-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
