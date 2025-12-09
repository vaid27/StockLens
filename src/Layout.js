import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  TrendingUp, Search, Sun, Moon, Bell, User, Menu, X, Command
} from 'lucide-react';
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import AIChatbot from './components/ai/AIChatbot';

const navItems = [
  { name: 'Home', label: 'Markets' },
  { name: 'Analysis', label: 'Analysis' },
  { name: 'Predictions', label: 'Predictions' },
  { name: 'Watchlist', label: 'Watchlist' },
  { name: 'Portfolio', label: 'Portfolio' },
  { name: 'Sentiment', label: 'Sentiment' },
  { name: 'Settings', label: 'Settings' },
  { name: 'About', label: 'About' },
];

const tickerData = [
  { symbol: 'NIFTY 50', price: '22,175.75', change: '+0.45%', up: true },
  { symbol: 'SENSEX', price: '73,158.24', change: '+0.38%', up: true },
  { symbol: 'NASDAQ', price: '17,857.02', change: '-0.12%', up: false },
  { symbol: 'S&P 500', price: '5,234.18', change: '+0.28%', up: true },
  { symbol: 'DOW', price: '38,972.41', change: '+0.21%', up: true },
  { symbol: 'BTC', price: '$67,542', change: '-0.89%', up: false },
  { symbol: 'ETH', price: '$3,456', change: '+1.45%', up: true },
  { symbol: 'GOLD', price: '$2,342', change: '+0.32%', up: true },
  { symbol: 'CRUDE', price: '$78.45', change: '-0.67%', up: false },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === 'Escape') setCommandOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bgPrimary = isDark ? '#0a0d12' : '#f8fafc';
  const bgSecondary = isDark ? '#0f1419' : '#ffffff';
  const bgTertiary = isDark ? '#1a1f2e' : '#f1f5f9';
  const borderColor = isDark ? '#1e2530' : '#e2e8f0';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#64748b' : '#64748b';
  const textMuted = isDark ? '#475569' : '#94a3b8';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgPrimary }}>
      <style>{`
        :root {
          --bg-primary: ${bgPrimary};
          --bg-secondary: ${bgSecondary};
          --bg-tertiary: ${bgTertiary};
          --border: ${borderColor};
          --text-primary: ${textPrimary};
          --text-secondary: ${textSecondary};
        }
        
        * { scrollbar-width: thin; scrollbar-color: ${borderColor} transparent; }
        *::-webkit-scrollbar { width: 5px; height: 5px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: ${borderColor}; border-radius: 10px; }

        .ticker-wrapper {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        
        .ticker-scroll {
          animation: ticker 40s linear infinite;
        }
        
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .glass-card {
          background: ${isDark ? 'rgba(15, 20, 25, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        }

        .nav-item {
          transition: all 0.2s ease;
        }
        
        .nav-item:hover {
          color: ${isDark ? '#14b8a6' : '#0d9488'};
        }
        
        .nav-item.active {
          color: #14b8a6;
          font-weight: 600;
        }

        .page-enter {
          animation: fadeSlideIn 0.3s ease-out;
        }
        
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Command Palette */}
      <AnimatePresence>
        {commandOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
            onClick={() => setCommandOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
              style={{ backgroundColor: bgSecondary, border: `1px solid ${borderColor}` }}
            >
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <Search className="w-4 h-4" style={{ color: textMuted }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stocks, navigate..."
                  autoFocus
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: textPrimary }}
                />
                <kbd className="px-2 py-0.5 text-[10px] rounded" style={{ backgroundColor: bgTertiary, color: textMuted }}>ESC</kbd>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    onClick={() => setCommandOpen(false)}
                    className="flex items-center px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ color: textPrimary }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = bgTertiary}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticker Tape */}
      <div className="ticker-wrapper overflow-hidden" style={{ backgroundColor: isDark ? '#060810' : '#f1f5f9', borderBottom: `1px solid ${borderColor}` }}>
        <div className="flex ticker-scroll whitespace-nowrap py-1.5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              {tickerData.map((item, idx) => (
                <React.Fragment key={`${i}-${idx}`}>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-[11px] font-medium" style={{ color: textMuted }}>{item.symbol}</span>
                    <span className="text-[11px] font-semibold" style={{ color: textPrimary }}>{item.price}</span>
                    <span className={`text-[11px] font-medium ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>
                      {item.change}
                    </span>
                  </div>
                  <span style={{ color: borderColor }}>•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: `${bgSecondary}ee`, borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base hidden sm:block" style={{ color: textPrimary }}>StockLens</span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.name)}
                  className={`nav-item px-3.5 py-1.5 rounded-lg text-[13px] font-medium ${currentPageName === item.name ? 'active' : ''}`}
                  style={{ color: currentPageName === item.name ? '#14b8a6' : textSecondary }}
                >
                  {item.label}
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-item px-3.5 py-1.5 rounded-lg text-[13px] font-medium" style={{ color: textSecondary }}>
                    More
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-xl" style={{ backgroundColor: bgSecondary, border: `1px solid ${borderColor}` }}>
                  {navItems.slice(6).map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link to={createPageUrl(item.name)} className="text-[13px]">{item.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] transition-colors"
                style={{ backgroundColor: bgTertiary, color: textSecondary }}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded ml-1" style={{ backgroundColor: bgSecondary }}>⌘K</kbd>
              </button>

              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-500 text-[10px] font-semibold">LIVE</span>
              </div>

              <button className="relative p-2 rounded-lg transition-colors" style={{ color: textSecondary }}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg transition-colors" style={{ color: textSecondary }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button className="p-1.5 rounded-lg" style={{ backgroundColor: bgTertiary }}>
                <User className="w-4 h-4" style={{ color: textSecondary }} />
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2" style={{ color: textSecondary }}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
              style={{ borderTop: `1px solid ${borderColor}` }}
            >
              <nav className="p-3 space-y-0.5">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.name)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${currentPageName === item.name ? 'text-teal-500' : ''}`}
                    style={{ 
                      color: currentPageName === item.name ? '#14b8a6' : textPrimary,
                      backgroundColor: currentPageName === item.name ? (isDark ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.1)') : 'transparent'
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="page-enter pb-8">
        {React.cloneElement(children, { isDark })}
      </main>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 py-1.5 px-4 flex items-center justify-between text-[10px]" style={{ backgroundColor: `${bgSecondary}f0`, borderTop: `1px solid ${borderColor}` }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span style={{ color: textMuted }}>US Market Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span style={{ color: textMuted }}>India Closed</span>
          </div>
        </div>
        <span style={{ color: textMuted }}>⌘K to search</span>
      </div>

      {/* Sentio AI Chatbot - Available on all pages */}
      <AIChatbot isDark={isDark} />
    </div>
  );
}