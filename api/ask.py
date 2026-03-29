from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-pro")

conversation_history = []

SYSTEM_CONTEXT = """You are Sentio, an expert AI trading assistant for StockLens platform. 
You help users with:
- Stock market analysis and sentiment
- Technical indicators and chart patterns
- Price predictions and trends
- Portfolio recommendations
- Market news interpretation

Always provide helpful, accurate information and remind users that this is for educational purposes.
Keep responses concise and actionable. Use bullet points when listing multiple items.
"""

@app.route('/api/ask', methods=['POST'])
def ask_sentio():
    """Main endpoint for chatbot queries"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Add context to user message
        enhanced_prompt = f"{SYSTEM_CONTEXT}\n\nUser Question: {user_message}\n\nProvide a helpful response:"
        
        # Add to conversation history
        conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        # Get response from Gemini
        response = model.generate_content(enhanced_prompt)
        bot_response = response.text
        
        # Add bot response to history
        conversation_history.append({
            "role": "assistant",
            "content": bot_response
        })
        
        # Keep only last 10 messages
        if len(conversation_history) > 10:
            conversation_history.pop(0)
            conversation_history.pop(0)
        
        return jsonify({
            "response": bot_response,
            "status": "success"
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            "error": str(e),
            "response": "I'm having trouble connecting right now. Please try again later."
        }), 500

@app.route('/api/clear', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({"status": "cleared"}), 200

def handler(request):
    """Vercel serverless handler"""
    with app.app_context():
        return app.wsgi_app(request.environ, lambda *args: None)
