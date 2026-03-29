from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

# Pre-loaded realistic stock prices (updated for March 29, 2026)
REALISTIC_PRICES = {
    'AAPL': {'name': 'Apple Inc.', 'price': 450.27, 'changePercent': -1.75, 'volume': 52300000},
    'GOOGL': {'name': 'Alphabet Inc.', 'price': 198.54, 'changePercent': 0.65, 'volume': 22100000},
    'MSFT': {'name': 'Microsoft Corp.', 'price': 529.12, 'changePercent': 2.18, 'volume': 18900000},
    'AMZN': {'name': 'Amazon.com Inc.', 'price': 242.89, 'changePercent': 1.92, 'volume': 65400000},
    'TSLA': {'name': 'Tesla Inc.', 'price': 312.41, 'changePercent': -3.45, 'volume': 145200000},
    'META': {'name': 'Meta Platforms', 'price': 634.78, 'changePercent': 2.34, 'volume': 14600000},
    'NVDA': {'name': 'NVIDIA Corp.', 'price': 1042.56, 'changePercent': 4.12, 'volume': 31200000},
    'SOL': {'name': 'Solana', 'price': 172.34, 'changePercent': 4.21, 'volume': 28500000},
    'BTC-USD': {'name': 'Bitcoin', 'price': 67542.18, 'changePercent': -0.89, 'volume': 0},
    'ETH-USD': {'name': 'Ethereum', 'price': 3456.72, 'changePercent': 1.45, 'volume': 0},
}

stock_cache = {}
CACHE_DURATION = 300

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    """Fetch stock data"""
    try:
        symbol_upper = symbol.upper()
        
        # Check cache
        if symbol_upper in stock_cache:
            cached_data, timestamp = stock_cache[symbol_upper]
            if time.time() - timestamp < CACHE_DURATION:
                cached_data['fromCache'] = True
                return jsonify(cached_data), 200
        
        # Return realistic prices
        if symbol_upper in REALISTIC_PRICES:
            data = REALISTIC_PRICES[symbol_upper].copy()
            data['symbol'] = symbol_upper
            data['isDemo'] = True
            data['timestamp'] = datetime.now().isoformat()
            stock_cache[symbol_upper] = (data, time.time())
            return jsonify(data), 200
        
        return jsonify({"error": "Symbol not found", "symbol": symbol_upper}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "StockLens API"}), 200

def handler(request):
    """Vercel serverless handler"""
    with app.app_context():
        return app.wsgi_app(request.environ, lambda *args: None)
