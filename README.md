<div align="center">

# 📈 StockLens

### AI-Powered Stock Market Analysis & Prediction Platform

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*Transform your trading decisions with cutting-edge AI and real-time market intelligence*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

---

</div>

## ✨ Features

### 🤖 **Sentio AI Assistant**
- Powered by **Google Gemini Pro** - Your intelligent trading companion
- Real-time market insights and analysis
- Natural language stock queries
- Persistent conversation memory

### 📊 **Advanced Analytics**
- **Machine Learning Predictions** - LSTM, GRU, BiLSTM, ARIMA, Prophet models
- **Technical Indicators** - RSI, MACD, Bollinger Bands, Moving Averages
- **Pattern Recognition** - Head & Shoulders, Double Tops/Bottoms
- **Support/Resistance Levels** - Automated key price detection

### 💼 **Portfolio Management**
- Real-time portfolio tracking
- Profit/Loss visualization
- Asset allocation insights
- Performance analytics

### 🎯 **Smart Features**
- Custom watchlists with alerts
- Market sentiment analysis
- IPO dashboard
- Sector rotation tracking
- Market heatmap
- Live order book
- Auto-refresh market data

### 🎨 **Modern UI/UX**
- Dark/Light theme toggle
- Smooth animations with Framer Motion
- Responsive design for all devices
- Interactive charts and visualizations

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** (v14 or higher)
- **Python** (3.11+)
- **Google Gemini API Key** ([Get it here](https://makersuite.google.com/app/apikey))

### ⚡ Installation

1. **Clone the repository**
```bash
git clone https://github.com/vaid27/StockLens.git
cd StockLens
```

2. **Set up the Backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure API Key**
Create a `.env` file in the `backend` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Install Frontend Dependencies**
```bash
cd ..
npm install
```

### 🎬 Running the Application

#### Option 1: One-Click Start (Windows)
Double-click `START-STOCKLENS.bat` or use the desktop shortcut!

#### Option 2: Manual Start

**Terminal 1 - Backend Server:**
```bash
cd backend
python server.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

🎉 **Your app will open at http://localhost:3000**

> **Note:** The chatbot works with fallback responses if the backend isn't running, but full AI features require both servers.

---

## 📁 Project Structure

```
STOCKLENS/
├── 🎨 src/
│   ├── components/          # Modular UI components
│   │   ├── ai/             # 🤖 Sentio AI Chatbot
│   │   ├── charts/         # 📊 Visualization components
│   │   ├── market/         # 💹 Market analysis tools
│   │   ├── portfolio/      # 💼 Portfolio management
│   │   ├── stocks/         # 📈 Stock components
│   │   └── ui/             # 🎯 Reusable UI elements
│   ├── pages/              # Application pages
│   ├── entities/           # Data models
│   ├── App.js              # Main app component
│   └── Layout.js           # Layout wrapper
├── 🐍 backend/
│   ├── server.py           # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── 🌐 public/              # Static assets
└── 📝 START-STOCKLENS.bat # Quick start script
```

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)

- **React 18.2.0** - Modern UI library with hooks
- **React Router 6.20.0** - Declarative routing
- **Tailwind CSS** - Utility-first styling
- **Recharts 2.10.3** - Data visualization
- **Framer Motion 10.16.16** - Smooth animations
- **Lucide React** - Beautiful icons
- **Axios 1.6.2** - HTTP client

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white)

- **Flask 3.0.0** - Lightweight web framework
- **Google Generative AI** - Gemini Pro integration
- **Flask-CORS** - Cross-origin support
- **python-dotenv** - Environment management

---

## 🎯 Demo

### AI Chatbot in Action
The Sentio AI assistant provides intelligent market insights, answers trading questions, and helps analyze stocks using natural language.

### Key Pages
- **📊 Home** - Market overview with real-time data
- **🔍 Analysis** - Deep technical analysis tools
- **🔮 Predictions** - ML-powered price forecasting
- **💼 Portfolio** - Track your investments
- **⭐ Watchlist** - Monitor favorite stocks
- **📰 Sentiment** - Market mood analysis
- **⚙️ Settings** - Customize your experience

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | 🚀 Runs app in development mode |
| `npm build` | 📦 Builds for production |
| `npm test` | 🧪 Runs test suite |
| `python backend/server.py` | 🐍 Starts Flask backend |

---

## ⚠️ Disclaimer

This application is for **educational and informational purposes only**. It should not be used as the sole basis for investment decisions. Stock market investments carry risk, and past performance does not guarantee future results. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.

---

## 📄 License

MIT License - feel free to use this project for learning and development!

---

## 👨‍💻 Author

**Vaibhav Swarnim**
- GitHub: [@vaid27](https://github.com/vaid27)
- Project: [StockLens](https://github.com/vaid27/StockLens)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn something new!

---

<div align="center">

**Built with ❤️ using React, Python, and Google Gemini AI**

[⬆ Back to Top](#-stocklens)

</div>
