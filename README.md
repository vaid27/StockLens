# StockLens 📈

Advanced Stock Market Analysis & Prediction Platform with AI Assistant

## Features

- 📊 Real-time market data visualization
- 🤖 **Sentio AI Chatbot** - Powered by Google Gemini 2.0
- 🧠 ML-based price predictions (LSTM, GRU, BiLSTM, ARIMA, Prophet)
- 📈 Technical analysis with indicators (RSI, MACD, Moving Averages)
- 💼 Portfolio management and tracking
- 📰 Market sentiment analysis
- 🎯 Watchlist with custom alerts
- 🌓 Dark/Light theme support

## 🚀 Quick Start

### Frontend + AI Backend (Recommended)

1. **Start the AI Backend** (Terminal 1):
```bash
cd backend
pip install -r requirements.txt
python server.py
```

2. **Start the Frontend** (Terminal 2):
```bash
npm install
npm start
```

Your app will open at **http://localhost:3000** with full AI capabilities! 🎉

### Frontend Only (No AI Backend)

```bash
npm install
npm start
```

The chatbot will use fallback responses if backend isn't running.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project folder

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
STOCKLENS/
├── Components/          # Reusable UI components
│   ├── ai/             # AI chatbot
│   ├── charts/         # Chart components
│   ├── market/         # Market-specific components
│   ├── portfolio/      # Portfolio components
│   └── stocks/         # Stock-related components
├── Pages/              # Page components
├── Entities/           # Data models
├── src/                # React app source
├── public/             # Static files
└── Layout.js           # Main layout wrapper
```

## Technologies Used

- **React** - UI library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Disclaimer

This application is for educational and demonstration purposes only. Do not use for actual trading decisions. Always consult with a financial advisor before making investment decisions.

## License

MIT
