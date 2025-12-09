import React from 'react';
import { TrendingUp, Brain, BarChart3, Shield, Zap, Users, Github, Twitter, Linkedin, Mail, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "../components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const features = [
  { icon: TrendingUp, title: 'Real-Time Data', desc: 'Live market data with customizable refresh rates', color: 'text-emerald-400' },
  { icon: Brain, title: 'ML Predictions', desc: 'LSTM neural networks for price forecasting', color: 'text-purple-400' },
  { icon: BarChart3, title: 'Technical Analysis', desc: 'RSI, MACD, Bollinger Bands & more', color: 'text-blue-400' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data stays on your device', color: 'text-cyan-400' },
  { icon: Zap, title: 'Sentiment Analysis', desc: 'Social media & news sentiment tracking', color: 'text-amber-400' },
  { icon: Users, title: 'Multi-Model', desc: 'Compare LSTM, GRU, ARIMA, Prophet models', color: 'text-pink-400' },
];

const techStack = [
  'React', 'TensorFlow/Keras', 'LSTM Neural Networks', 'Recharts', 'Tailwind CSS', 'Framer Motion'
];

export default function About({ isDark = true }) {
  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgGradient = isDark 
    ? 'bg-gradient-to-br from-[#131722] via-[#1e222d] to-[#131722]' 
    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-xl shadow-cyan-500/20 mb-6">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold ${textPrimary} mb-4`}>
          StockLens
        </h1>
        <p className={`text-xl ${textSecondary} max-w-2xl mx-auto mb-8`}>
          Professional-grade stock market analysis platform powered by machine learning
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={createPageUrl('Home')}>
            <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </Link>
          <Button variant="outline" className={`${borderColor} ${textPrimary}`}>
            <Github className="w-4 h-4 mr-2" />
            View Source
          </Button>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className={`${bgCard} border ${borderColor} rounded-xl p-6 hover:border-cyan-500/30 transition-all group`}
          >
            <feature.icon className={`w-10 h-10 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
            <h3 className={`${textPrimary} font-semibold text-lg mb-2`}>{feature.title}</h3>
            <p className={textSecondary}>{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tech Stack */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${bgCard} border ${borderColor} rounded-xl p-8 mb-16`}
      >
        <h2 className={`${textPrimary} font-bold text-2xl mb-6 text-center`}>Built With Modern Tech</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span 
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-[#1e222d] text-gray-300' : 'bg-gray-100 text-gray-700'}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* What You Get */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${bgGradient} border ${borderColor} rounded-xl p-8 mb-16`}
      >
        <h2 className={`${textPrimary} font-bold text-2xl mb-6`}>What's Included</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Real-time market dashboard',
            'Interactive candlestick & area charts',
            'MA50/MA200 technical analysis',
            'RSI, MACD, Bollinger Bands',
            'LSTM price predictions',
            'Multi-model comparison',
            'Future price forecasting',
            'Confidence intervals',
            'Social sentiment analysis',
            'Fear & Greed index',
            'News feed integration',
            'Analyst ratings',
            'Watchlist with alerts',
            'Market heatmap',
            'Auto-refresh toggle',
            'Dark/Light theme',
            'Fully responsive design',
            'Local data persistence',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className={textSecondary}>{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`${isDark ? 'bg-amber-500/5' : 'bg-amber-50'} border ${isDark ? 'border-amber-500/20' : 'border-amber-200'} rounded-xl p-6 mb-16`}
      >
        <h3 className="text-amber-500 font-semibold mb-2">⚠️ Disclaimer</h3>
        <p className={textSecondary}>
          This platform is for educational and informational purposes only. 
          The predictions and analysis provided should not be considered as financial advice. 
          Always do your own research and consult with a qualified financial advisor before making investment decisions.
          Past performance does not guarantee future results.
        </p>
      </motion.div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="flex justify-center gap-4 mb-6">
          <Button size="icon" variant="ghost" className={textSecondary}>
            <Github className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" className={textSecondary}>
            <Twitter className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" className={textSecondary}>
            <Linkedin className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="ghost" className={textSecondary}>
            <Mail className="w-5 h-5" />
          </Button>
        </div>
        <p className={textSecondary}>
          © 2025 StockLens. Built with ❤️ for traders and investors.
        </p>
      </motion.div>
    </div>
  );
}