import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({ children }) => {
  return <>{children}</>;
};

export const TooltipTrigger = ({ asChild, children }) => {
  if (asChild && React.isValidElement(children)) {
    return children;
  }
  return <span>{children}</span>;
};

export const TooltipContent = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`z-50 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};
