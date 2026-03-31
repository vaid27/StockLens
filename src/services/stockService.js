import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL || 'https://web-production-dbfb6.up.railway.app';

/**
 * Fetch real-time stock data from Yahoo Finance via backend
 */
export const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/stock/${symbol}`);
    // Mark as real data if backend succeeds
    return {
      ...response.data,
      isDemo: false
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    // Return fallback data if API fails
    return {
      symbol: symbol,
      name: symbol,
      price: 100 + Math.random() * 500,
      changePercent: (Math.random() - 0.5) * 10,
      volume: 0,
      marketCap: 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      isDemo: true
    };
  }
};

/**
 * Fetch historical stock data
 */
export const fetchStockHistory = async (symbol, period = '1mo') => {
  try {
    const response = await axios.get(`${BACKEND_URL}/stock/${symbol}/history`, {
      params: { period }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    // Return fallback simulated data
    const data = [];
    let price = 100 + Math.random() * 500;
    
    // For 1D, generate 24 hourly data points
    if (period === '1d') {
      const now = new Date();
      for (let hour = 0; hour < 24; hour++) {
        const change = (Math.random() - 0.48) * (price * 0.01);
        price = Math.max(price + change, price * 0.8);
        
        const hourDate = new Date(now);
        hourDate.setHours(hour, 0, 0, 0);
        const hours = String(hour).padStart(2, '0');
        
        data.push({
          date: `${hours}:00`,
          price: Math.round(price * 100) / 100,
          open: price,
          high: price * 1.02,
          low: price * 0.98,
          volume: Math.floor(Math.random() * 10000000)
        });
      }
      return data;
    }
    
    // For other periods, generate daily data
    const days = period === '5d' ? 5 : period === '1mo' ? 30 : 90;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const change = (Math.random() - 0.48) * (price * 0.02);
      price = Math.max(price + change, price * 0.5);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        open: price,
        high: price * 1.02,
        low: price * 0.98,
        volume: Math.floor(Math.random() * 10000000)
      });
    }
    return data;
  }
};

/**
 * Check if backend is available
 */
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 2000 });
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
};
