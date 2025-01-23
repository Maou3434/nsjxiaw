from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/messages', methods=['POST'])
def process_messages():
    data = request.json
    # Process the data as needed (e.g., filter, store, analyze)
    # For this example, let's just return the same data
    processed_data = [{"sender": msg["sender"], "message": msg["message"]} for msg in data]
    
    return jsonify(processed_data)

if __name__ == '__main__':
    app.run(port=5000)
