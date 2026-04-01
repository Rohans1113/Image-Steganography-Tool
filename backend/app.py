import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# Import all your StegoVault logic modules
from steg.text_to_text import encode_text, decode_text
from steg.text_to_image import encode_text_in_image, decode_text_from_image
from steg.image_to_image import encode_image_in_image, decode_image_from_image
from steg.text_to_gif import encode_text_in_gif, decode_text_from_gif

app = Flask(__name__)
CORS(app) 

# ==========================================
# 1. TEXT IN TEXT
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
# 2. TEXT IN IMAGE (PNG/LSB)
# ==========================================
@app.route('/api/encode-image', methods=['POST'])
def api_encode_image():
    if 'cover_image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['cover_image']
    secret = request.form.get('secret_message', '')
    
    encoded_img, status = encode_text_in_image(file, secret)
    if not encoded_img:
        return jsonify({"error": status}), 400
        
    img_io = io.BytesIO()
    encoded_img.save(img_io, 'PNG') 
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='stego_image.png')

@app.route('/api/decode-image', methods=['POST'])
def api_decode_image():
    if 'stego_image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    file = request.files['stego_image']
    result = decode_text_from_image(file)
    return jsonify({"decoded_message": result})

# ==========================================
# 3. IMAGE IN IMAGE (MSB Merge)
# ==========================================
@app.route('/api/encode-img2img', methods=['POST'])
def api_encode_img2img():
    if 'cover_image' not in request.files or 'secret_image' not in request.files:
        return jsonify({"error": "Both cover and secret images are required"}), 400
        
    cover_file = request.files['cover_image']
    secret_file = request.files['secret_image']
    
    try:
        encoded_img = encode_image_in_image(cover_file, secret_file)
        img_io = io.BytesIO()
        encoded_img.save(img_io, 'PNG')
        img_io.seek(0)
        return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='stego_vault_merged.png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/decode-img2img', methods=['POST'])
def api_decode_img2img():
    if 'stego_image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
        
    file = request.files['stego_image']
    try:
        extracted_img = decode_image_from_image(file)
        img_io = io.BytesIO()
        extracted_img.save(img_io, 'PNG')
        img_io.seek(0)
        return send_file(img_io, mimetype='image/png', as_attachment=True, download_name='stego_vault_extracted.png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# 4. TEXT IN GIF (EOF Injection)
# ==========================================
@app.route('/api/encode-gif', methods=['POST'])
def api_encode_gif():
    if 'cover_gif' not in request.files:
        return jsonify({"error": "No GIF uploaded"}), 400
        
    file = request.files['cover_gif']
    secret = request.form.get('secret_message', '')
    
    encoded_bytes = encode_text_in_gif(file, secret)
    
    img_io = io.BytesIO(encoded_bytes)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/gif', as_attachment=True, download_name='stego_vault.gif')

@app.route('/api/decode-gif', methods=['POST'])
def api_decode_gif():
    if 'stego_gif' not in request.files:
        return jsonify({"error": "No GIF uploaded"}), 400
        
    file = request.files['stego_gif']
    result = decode_text_from_gif(file)
    return jsonify({"decoded_message": result})

# ==========================================
# SERVER EXECUTION 
# ==========================================
if __name__ == '__main__':
    # Changed from 5000 to 5050 to bypass Apple AirPlay
    app.run(port=5050, debug=True)