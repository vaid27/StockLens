import React, { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownContext = createContext();

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ asChild, children }) => {
  const { setOpen } = useContext(DropdownContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => setOpen(prev => !prev),
    });
  }
  
  return (
    <button onClick={() => setOpen(prev => !prev)}>
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ align = 'end', className = '', children }) => {
  const { open, setOpen } = useContext(DropdownContext);
  
  const alignmentClass = align === 'end' ? 'right-0' : 'left-0';
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-2xl ${alignmentClass} ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const DropdownMenuItem = ({ className = '', onClick, children, ...props }) => {
  const { setOpen } = useContext(DropdownContext);
  
  const handleClick = (e) => {
    onClick?.(e);
    setOpen(false);
  };
  
  return (
    <button
      className={`relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-slate-200 outline-none transition-colors hover:bg-slate-800 focus:bg-slate-800 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const DropdownMenuLabel = ({ className = '', ...props }) => (
  <div
    className={`px-3 py-2 text-sm font-semibold text-slate-400 ${className}`}
    {...props}
  />
);

export const DropdownMenuSeparator = ({ className = '', ...props }) => (
  <div
    className={`-mx-1 my-1 h-px bg-slate-700 ${className}`}
    {...props}
  />
);
