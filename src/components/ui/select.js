import React from 'react';

export const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger = React.forwardRef(({ className = '', children, value, onValueChange, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`flex h-10 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
));
SelectTrigger.displayName = 'SelectTrigger';

export const SelectValue = ({ placeholder }) => {
  return <span className="text-slate-400">{placeholder}</span>;
};

export const SelectContent = ({ children }) => {
  return <div className="hidden">{children}</div>;
};

export const SelectItem = ({ children, value }) => {
  return <div value={value}>{children}</div>;
};
