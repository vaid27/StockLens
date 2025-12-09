# Sentio AI Backend

Flask backend server for the Sentio AI chatbot powered by Google Gemini.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

3. Run the server:
```bash
python server.py
```

The server will start on `http://localhost:5000`

## Endpoints

- `GET /health` - Health check
- `POST /ask` - Send message to Sentio AI
  - Body: `{ "message": "your question" }`
- `POST /clear` - Clear conversation history

## Integration with Frontend

The React frontend will automatically connect to this backend when available.
If the backend is not running, it falls back to sample responses.
