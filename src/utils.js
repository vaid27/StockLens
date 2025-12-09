// Utility function to create page URLs with query parameters
export const createPageUrl = (pageName, params = {}) => {
  const baseUrl = `/${pageName.toLowerCase()}`;
  const queryParams = new URLSearchParams(params).toString();
  return queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
};

// Format currency values
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Format percentage values
export const formatPercentage = (value) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format large numbers (K, M, B)
export const formatLargeNumber = (num) => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

// Generate random price movement
export const generatePriceMovement = (basePrice, volatility = 0.02) => {
  return basePrice + (Math.random() - 0.48) * (basePrice * volatility);
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Check if market is open (simplified - doesn't account for holidays)
export const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // Monday-Friday, 9:30 AM - 4:00 PM EST (simplified)
  return day >= 1 && day <= 5 && timeInMinutes >= 570 && timeInMinutes <= 960;
};

// Merge classNames utility
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
