import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Helper function to generate dynamic timestamps
const getRandomTime = (minMinutes, maxMinutes) => {
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes) + minMinutes);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const generateNewsWithTimestamps = () => ({
  'AAPL': [
    { title: 'Apple Reports Record Q4 Revenue Driven by iPhone Sales', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: 'https://www.google.com/search?q=Apple+Reports+Record+Revenue' },
    { title: 'Apple Vision Pro Pre-Orders Exceed Expectations', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Apple+Vision+Pro+news' },
    { title: 'Analysts Raise Apple Price Targets After Strong Earnings', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'CNBC', url: 'https://www.google.com/search?q=Apple+stock+analyst+ratings' },
    { title: 'Apple Expands AI Features Across Product Line', sentiment: 'neutral', time: getRandomTime(1440, 2880), source: 'TechCrunch', url: 'https://www.google.com/search?q=Apple+AI+features' },
  ],
  'GOOGL': [
    { title: 'Google Cloud Revenue Surges 28% Year-Over-Year', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: 'https://www.google.com/search?q=Google+Cloud+revenue+news' },
    { title: 'Alphabet Announces Major AI Breakthroughs with Gemini', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Google+Gemini+AI+news' },
    { title: 'Google Search Faces Antitrust Scrutiny in EU', sentiment: 'negative', time: getRandomTime(360, 1440), source: 'WSJ', url: 'https://www.google.com/search?q=Google+antitrust+EU' },
    { title: 'YouTube Ad Revenue Beats Expectations in Q4', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=YouTube+ad+revenue' },
  ],
  'MSFT': [
    { title: 'Microsoft Azure Growth Accelerates, Beats Estimates', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Bloomberg', url: 'https://www.google.com/search?q=Microsoft+Azure+growth' },
    { title: 'OpenAI Partnership Drives Microsoft AI Revenue', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Reuters', url: 'https://www.google.com/search?q=Microsoft+OpenAI+partnership' },
    { title: 'Microsoft 365 Copilot Adoption Exceeds Projections', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'TechCrunch', url: 'https://www.google.com/search?q=Microsoft+Copilot+news' },
    { title: 'Gaming Division Shows Strong Performance', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=Microsoft+gaming+news' },
  ],
  'AMZN': [
    { title: 'Amazon AWS Maintains Cloud Market Leadership', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: 'https://www.google.com/search?q=Amazon+AWS+news' },
    { title: 'Prime Day Sales Set New Company Record', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Amazon+Prime+Day+sales' },
    { title: 'Amazon Expands Same-Day Delivery to 100+ Cities', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'CNBC', url: 'https://www.google.com/search?q=Amazon+delivery+expansion' },
    { title: 'Labor Unions Push for Better Working Conditions', sentiment: 'negative', time: getRandomTime(1440, 2880), source: 'WSJ', url: 'https://www.google.com/search?q=Amazon+labor+unions' },
  ],
  'TSLA': [
    { title: 'Tesla Cybertruck Deliveries Begin, Strong Initial Demand', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Electrek', url: 'https://www.google.com/search?q=Tesla+Cybertruck+deliveries' },
    { title: 'Tesla Stock Faces Pressure Amid EV Competition', sentiment: 'negative', time: getRandomTime(180, 360), source: 'WSJ', url: 'https://www.google.com/search?q=Tesla+stock+competition' },
    { title: 'Musk Announces New Gigafactory Location', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'Reuters', url: 'https://www.google.com/search?q=Tesla+Gigafactory+news' },
    { title: 'Tesla Energy Storage Business Shows Strong Growth', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'Bloomberg', url: 'https://www.google.com/search?q=Tesla+energy+storage' },
  ],
  'META': [
    { title: 'Meta Reports Strong Q4 Earnings, Stock Surges', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: 'https://www.google.com/search?q=Meta+earnings+news' },
    { title: 'Reality Labs Division Losses Continue to Mount', sentiment: 'negative', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Meta+Reality+Labs+losses' },
    { title: 'Instagram Reels Gains Ground on TikTok', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'TechCrunch', url: 'https://www.google.com/search?q=Instagram+Reels+TikTok' },
    { title: 'Meta AI Assistant Reaches 500M Users', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=Meta+AI+assistant' },
  ],
  'NVDA': [
    { title: 'NVIDIA H100 Chips Sold Out Through 2025', sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: 'https://www.google.com/search?q=NVIDIA+H100+chips+news' },
    { title: 'AI Demand Drives Record GPU Sales', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=NVIDIA+GPU+sales' },
    { title: 'NVIDIA Announces Next-Gen Blackwell Architecture', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'TechCrunch', url: 'https://www.google.com/search?q=NVIDIA+Blackwell+architecture' },
    { title: 'Gaming Revenue Shows Signs of Recovery', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=NVIDIA+gaming+revenue' },
  ],
  'BTC-USD': [
    { title: 'Bitcoin ETF Sees Record Inflows This Week', sentiment: 'positive', time: getRandomTime(30, 180), source: 'CoinDesk', url: 'https://www.google.com/search?q=Bitcoin+ETF+news' },
    { title: 'Institutional Adoption of Bitcoin Continues to Grow', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Bitcoin+institutional+adoption' },
    { title: 'Bitcoin Halving Event Approaches, Analysts Bullish', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'Reuters', url: 'https://www.google.com/search?q=Bitcoin+halving+news' },
    { title: 'Crypto Market Volatility Expected Ahead of Fed Decision', sentiment: 'neutral', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=cryptocurrency+market+volatility' },
  ],
  'ETH-USD': [
    { title: 'Ethereum Upgrades Improve Network Efficiency', sentiment: 'positive', time: getRandomTime(30, 180), source: 'CoinDesk', url: 'https://www.google.com/search?q=Ethereum+upgrade+news' },
    { title: 'ETH Staking Rewards Attract Institutional Interest', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=Ethereum+staking+news' },
    { title: 'DeFi Activity on Ethereum Reaches New Highs', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'CoinTelegraph', url: 'https://www.google.com/search?q=Ethereum+DeFi+activity' },
    { title: 'Gas Fees Drop to Lowest Levels in Years', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'Reuters', url: 'https://www.google.com/search?q=Ethereum+gas+fees' },
  ],
  'SOL-USD': [
    { title: 'Solana Network Activity Surges, Transaction Speed Impresses', sentiment: 'positive', time: getRandomTime(30, 180), source: 'CoinDesk', url: 'https://www.google.com/search?q=Solana+network+activity' },
    { title: 'Major DeFi Protocols Launch on Solana', sentiment: 'positive', time: getRandomTime(180, 360), source: 'CoinTelegraph', url: 'https://www.google.com/search?q=Solana+DeFi+protocols' },
    { title: 'Solana Mobile Phone Sales Exceed Expectations', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'Bloomberg', url: 'https://www.google.com/search?q=Solana+mobile+phone' },
    { title: 'Network Outage Concerns Resurface Among Critics', sentiment: 'negative', time: getRandomTime(1440, 2880), source: 'Reuters', url: 'https://www.google.com/search?q=Solana+network+outage' },
  ],
  'XRP-USD': [
    { title: 'Ripple Wins Partial Victory in SEC Lawsuit', sentiment: 'positive', time: getRandomTime(30, 180), source: 'CoinDesk', url: 'https://www.google.com/search?q=Ripple+SEC+lawsuit+news' },
    { title: 'XRP Trading Volume Spikes on Legal News', sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: 'https://www.google.com/search?q=XRP+trading+volume' },
    { title: 'Banks Test XRP for Cross-Border Payments', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'Reuters', url: 'https://www.google.com/search?q=XRP+cross+border+payments' },
    { title: 'Regulatory Uncertainty Continues to Weigh on Price', sentiment: 'neutral', time: getRandomTime(1440, 2880), source: 'CNBC', url: 'https://www.google.com/search?q=XRP+regulatory+news' },
  ],
  'ADA-USD': [
    { title: 'Cardano Smart Contract Activity Reaches All-Time High', sentiment: 'positive', time: getRandomTime(30, 180), source: 'CoinDesk', url: 'https://www.google.com/search?q=Cardano+smart+contracts' },
    { title: 'Hydra Scaling Solution Shows Promising Results', sentiment: 'positive', time: getRandomTime(180, 360), source: 'CoinTelegraph', url: 'https://www.google.com/search?q=Cardano+Hydra+scaling' },
    { title: 'New DeFi Projects Choose Cardano Platform', sentiment: 'positive', time: getRandomTime(360, 1440), source: 'Bloomberg', url: 'https://www.google.com/search?q=Cardano+DeFi+projects' },
    { title: 'Cardano Foundation Announces African Expansion', sentiment: 'positive', time: getRandomTime(1440, 2880), source: 'Reuters', url: 'https://www.google.com/search?q=Cardano+Africa+expansion' },
  ],
});

export default function NewsFeed({ symbol, isDark = true }) {
  const [newsData, setNewsData] = useState(() => generateNewsWithTimestamps());
  
  // Update news timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNewsData(generateNewsWithTimestamps());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const news = newsData[symbol] || [
    { title: `${symbol} Shows Strong Market Performance`, sentiment: 'positive', time: getRandomTime(30, 180), source: 'Reuters', url: `https://www.google.com/search?q=${symbol}+stock+news` },
    { title: `Analysts Update ${symbol} Price Targets`, sentiment: 'positive', time: getRandomTime(180, 360), source: 'Bloomberg', url: `https://www.google.com/search?q=${symbol}+analyst+ratings` },
    { title: `${symbol} Trading Volume Increases Significantly`, sentiment: 'neutral', time: getRandomTime(360, 1440), source: 'CNBC', url: `https://www.google.com/search?q=${symbol}+trading+volume` },
    { title: `Market Watch: ${symbol} Technical Analysis`, sentiment: 'neutral', time: getRandomTime(1440, 2880), source: 'TechCrunch', url: `https://www.google.com/search?q=${symbol}+technical+analysis` },
  ];
  
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgHover = isDark ? 'hover:bg-[#1e222d]' : 'hover:bg-gray-50';

  const sentimentIcon = {
    positive: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    negative: <TrendingDown className="w-4 h-4 text-red-400" />,
    neutral: <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center"><div className="w-2 h-2 bg-amber-400 rounded-full" /></div>,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgCard} border ${borderColor} rounded-xl p-6`}
    >
      <h3 className={`${textPrimary} font-semibold text-lg mb-4 flex items-center gap-2`}>
        <Newspaper className="w-5 h-5 text-blue-400" />
        Latest News
      </h3>

      <div className="space-y-1">
        {news.map((item, index) => (
          <motion.a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`block p-3 rounded-xl ${bgHover} transition-all group cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {sentimentIcon[item.sentiment]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${textPrimary} text-sm font-medium group-hover:text-cyan-400 transition-colors line-clamp-2`}>
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs ${textSecondary} flex items-center gap-1`}>
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                  <span className={`text-xs ${textSecondary}`}>{item.source}</span>
                </div>
              </div>
              <ExternalLink className={`w-4 h-4 ${textSecondary} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          </motion.a>
        ))}
      </div>

      <a 
        href={`https://www.google.com/search?q=${symbol}+stock+news&tbm=nws`}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full mt-4 py-2 text-sm text-center ${textSecondary} hover:text-cyan-400 transition-colors`}
      >
        View All News →
      </a>
    </motion.div>
  );
}