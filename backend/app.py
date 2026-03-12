import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# Import your steganography logic modules
from steg.text_to_text import encode_text, decode_text
from steg.text_to_image import encode_text_in_image, decode_text_from_image

app = Flask(__name__)
CORS(app) 

# ==========================================
# TEXT IN TEXT ENDPOINTS
# ==========================================

@app.route('/api/encode', methods=['POST'])
def api_encode():
    data = request.json
    cover = data.get('cover_text', '')
    secret = data.get('secret_message', '')
    
    result = encode_text(cover, secret)
    return jsonify({"encoded_text": result})

@app.route('/api/decode', methods=['POST'])
def api_decode():
    data = request.json
    encoded = data.get('encoded_text', '')
    
    result = decode_text(encoded)
    return jsonify({"decoded_message": result})


# ==========================================
# TEXT IN IMAGE ENDPOINTS
# ==========================================

@app.route('/api/encode-image', methods=['POST'])
def api_encode_image():
    # Check if an image file was actually included in the request
    if 'cover_image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    file = request.files['cover_image']
    # Note: Because we use FormData for files, we use request.form.get instead of request.json
    secret = request.form.get('secret_message', '')
    
    encoded_img, status = encode_text_in_image(file, secret)
    
    if not encoded_img:
        return jsonify({"error": status}), 400
        
    # Save the modified image to a memory buffer
    img_io = io.BytesIO()
    
    # CRITICAL: We MUST save as PNG. JPEG compression destroys the hidden LSB data!
    encoded_img.save(img_io, 'PNG') 
    img_io.seek(0)
    
    # Send the image file directly back to the React frontend
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='stego_image.png')

@app.route('/api/decode-image', methods=['POST'])
def api_decode_image():
    # Check if a stego image was uploaded for decoding
    if 'stego_image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    file = request.files['stego_image']
    result = decode_text_from_image(file)
    
    return jsonify({"decoded_message": result})

if __name__ == '__main__':
    app.run(port=5000, debug=True)