import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Predictions from './pages/Predictions';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Sentiment from './pages/Sentiment';
import Settings from './pages/Settings';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
        <Route path="/analysis" element={<Layout currentPageName="Analysis"><Analysis /></Layout>} />
        <Route path="/predictions" element={<Layout currentPageName="Predictions"><Predictions /></Layout>} />
        <Route path="/watchlist" element={<Layout currentPageName="Watchlist"><Watchlist /></Layout>} />
        <Route path="/portfolio" element={<Layout currentPageName="Portfolio"><Portfolio /></Layout>} />
        <Route path="/sentiment" element={<Layout currentPageName="Sentiment"><Sentiment /></Layout>} />
        <Route path="/settings" element={<Layout currentPageName="Settings"><Settings /></Layout>} />
        <Route path="/about" element={<Layout currentPageName="About"><About /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
