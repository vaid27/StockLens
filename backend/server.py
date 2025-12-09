from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using gemini-pro as it's stable and available in your quota
model = genai.GenerativeModel("gemini-pro")

# Conversation history
conversation_history = []

# Stock market context for better responses
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

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Sentio AI"}), 200

@app.route('/ask', methods=['POST'])
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
        
        # Keep only last 10 messages to manage context
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

@app.route('/clear', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({"status": "cleared"}), 200

if __name__ == '__main__':
    print("🚀 Starting Sentio AI Backend Server...")
    print("📡 Backend running on http://localhost:5000")
    print("🤖 Gemini AI Model: gemini-pro")
    app.run(debug=False, port=5000, use_reloader=False)
