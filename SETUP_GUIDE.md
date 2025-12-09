# 🚀 StockLens with Sentio AI - Complete Setup Guide

## Quick Start (Both Frontend + Backend)

### Option 1: Start Everything Together

1. **Install Frontend Dependencies**
```bash
npm install
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure API Key**
   - The `.env` file in `/backend` should already have your Gemini API key
   - If not, copy from SENTIO AI folder or add: `GEMINI_API_KEY=your_key_here`

4. **Start Backend Server** (Terminal 1)
```bash
cd backend
python server.py
```
Backend will run on http://localhost:5000

5. **Start Frontend** (Terminal 2)
```bash
npm start
```
Frontend will run on http://localhost:3000

---

## Option 2: Frontend Only (Fallback Mode)

If you don't want to run the backend, just start:
```bash
npm start
```

The chatbot will work with pre-programmed responses instead of Gemini AI.

---

## 🤖 Sentio AI Features

When backend is running:
- ✅ Real-time AI responses powered by Google Gemini 2.0
- ✅ Context-aware stock market analysis
- ✅ Portfolio recommendations
- ✅ Technical analysis explanations
- ✅ Sentiment analysis insights
- ✅ Conversation memory

When backend is offline:
- ⚡ Instant fallback responses
- 📚 Pre-programmed stock knowledge
- 🎯 Basic query handling

---

## 📁 Project Structure

```
STOCKLENS/
├── src/                          # React frontend
│   ├── components/
│   │   └── ai/
│   │       └── AIChatbot.js     # Chatbot component
│   ├── pages/                    # All page components
│   └── App.js
├── backend/                      # Python backend
│   ├── server.py                # Flask API server
│   ├── requirements.txt         # Python dependencies
│   └── .env                     # API keys (DO NOT COMMIT)
└── package.json                  # Node dependencies
```

---

## 🔧 Troubleshooting

### Backend Issues

**"Module not found"**
```bash
cd backend
pip install -r requirements.txt
```

**"API Key not configured"**
- Check `backend/.env` has `GEMINI_API_KEY=your_key`
- Get key from: https://makersuite.google.com/app/apikey

**Port 5000 already in use**
- Change port in `backend/server.py`: `app.run(debug=True, port=5001)`
- Update frontend: Create `.env` in root with `REACT_APP_BACKEND_URL=http://localhost:5001`

### Frontend Issues

**"Cannot connect to backend"**
- Chatbot works with fallback responses
- Check if backend is running: http://localhost:5000/health
- Look for green "Backend connected" indicator in chatbot

---

## 🎨 Using the Chatbot

1. Click the purple chat icon (bottom-right corner)
2. Ask questions like:
   - "What's the sentiment for TSLA?"
   - "Should I buy AAPL?"
   - "Explain RSI indicator"
   - "Analyze my portfolio"
3. Get AI-powered responses instantly!

---

## 🔐 Security Notes

- Never commit `.env` files
- Keep your Gemini API key private
- Backend includes CORS for local development only
- For production, add proper authentication

---

## 📊 API Endpoints

**Health Check**
```
GET http://localhost:5000/health
```

**Send Message**
```
POST http://localhost:5000/ask
Body: { "message": "your question" }
```

**Clear History**
```
POST http://localhost:5000/clear
```

---

## 🎯 Next Steps

1. ✅ Backend is integrated and ready
2. ✅ Chatbot appears on all pages
3. ✅ Gemini AI connected
4. 🚀 Start both servers and enjoy!

---

**Made with ❤️ for StockLens**
