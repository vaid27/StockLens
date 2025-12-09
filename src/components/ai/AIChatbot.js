import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const sampleResponses = {
  'sentiment': 'Based on our analysis, TSLA has a **65% bullish sentiment** today. Social media mentions are up 23% with mostly positive reactions to recent delivery numbers.',
  'outlook': 'AAPL shows a **strong long-term outlook**. Our ML models predict a 12% upside over the next 6 months based on revenue growth, service expansion, and AI integration.',
  'buy': 'For your risk profile, consider: **MSFT** (stable growth), **NVDA** (AI momentum), or **V** (defensive play). Always diversify and consult a financial advisor.',
  'default': "I can help you with:\n- Stock sentiment analysis\n- Price predictions\n- Technical analysis\n- Portfolio suggestions\n\nTry asking about a specific stock!"
};

export default function AIChatbot({ isDark = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sentio, your AI trading assistant powered by Gemini. Ask me about stock sentiment, predictions, or analysis!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if backend is available
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(`${BACKEND_URL}/health`, { timeout: 2000 });
        setBackendAvailable(true);
      } catch (error) {
        setBackendAvailable(false);
        console.log('Backend not available, using fallback responses');
      }
    };
    checkBackend();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Try to use Sentio AI backend first
    if (backendAvailable) {
      try {
        const response = await axios.post(`${BACKEND_URL}/ask`, { 
          message: userMessage 
        }, {
          timeout: 10000
        });
        
        const botResponse = response.data.response || sampleResponses.default;
        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
        setIsTyping(false);
        return;
      } catch (error) {
        console.error('Error connecting to Sentio AI:', error);
        setBackendAvailable(false);
      }
    }

    // Fallback to sample responses
    setTimeout(() => {
      let response = sampleResponses.default;
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('sentiment') || lowerInput.includes('tsla')) {
        response = sampleResponses.sentiment;
      } else if (lowerInput.includes('outlook') || lowerInput.includes('aapl') || lowerInput.includes('long')) {
        response = sampleResponses.outlook;
      } else if (lowerInput.includes('buy') || lowerInput.includes('invest') || lowerInput.includes('recommend')) {
        response = sampleResponses.buy;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const bgCard = isDark ? 'bg-[#131722]' : 'bg-white';
  const borderColor = isDark ? 'border-[#2a2e39]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const bgMetric = isDark ? 'bg-[#1e222d]' : 'bg-gray-100';

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-20 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] ${bgCard} border ${borderColor} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">AI Assistant</p>
                  <p className="text-white/70 text-xs">Always here to help</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-cyan-500' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-cyan-500 text-white'
                      : `${bgMetric} ${textPrimary}`
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className={`${bgMetric} rounded-2xl px-4 py-2 flex items-center gap-1`}>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className={`text-sm ${textSecondary}`}>Thinking...</span>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`border-t ${borderColor} p-4`}>
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about stocks..."
                  className={`flex-1 ${isDark ? 'bg-[#1e222d] border-[#2a2e39]' : ''} ${textPrimary}`}
                />
                <Button onClick={handleSend} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['AAPL outlook', 'TSLA sentiment', 'What to buy?'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className={`px-3 py-1 rounded-full text-xs ${bgMetric} ${textSecondary} hover:text-cyan-400 transition-colors`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}