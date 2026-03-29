// v1.0.0 - Build update
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Layout from './Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Predictions from './pages/Predictions';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import Sentiment from './pages/Sentiment';
import Settings from './pages/Settings';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes (redirect to home if already logged in) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* Protected Routes (require authentication) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Home"><Home /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analysis" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Analysis"><Analysis /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/predictions" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Predictions"><Predictions /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/watchlist" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Watchlist"><Watchlist /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portfolio" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Portfolio"><Portfolio /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sentiment" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Sentiment"><Sentiment /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="Settings"><Settings /></Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <Layout currentPageName="About"><About /></Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
