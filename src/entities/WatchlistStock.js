export default {
  name: "WatchlistStock",
  type: "object",
  properties: {
    symbol: {
      type: "string",
      description: "Stock ticker symbol",
    },
    name: {
      type: "string",
      description: "Company name",
    },
    price: {
      type: "number",
      description: "Current price",
    },
    change_percent: {
      type: "number",
      description: "Percentage change",
    },
    currency: {
      type: "string",
      default: "USD",
    },
  },
  required: ["symbol", "name"],
};
