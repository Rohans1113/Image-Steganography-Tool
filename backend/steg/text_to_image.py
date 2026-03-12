from PIL import Image
import io

# We need a clear stopping point for the decoder
DELIMITER = "====END===="

def encode_text_in_image(image_file, secret_text):
    # Open image and ensure it's in standard RGB format
    img = Image.open(image_file)
    img = img.convert('RGB')
    
    # Append delimiter and convert the whole string to binary
    full_text = secret_text + DELIMITER
    binary_msg = ''.join(format(ord(char), '08b') for char in full_text)
    
    pixels = list(img.getdata())
    
    # Ensure the image has enough pixels to hold the message
    # 1 pixel has 3 color channels (R,G,B), so it can hold 3 bits
    if len(binary_msg) > len(pixels) * 3:
        return None, "Error: Secret message is too long for this image size."
        
    new_pixels = []
    msg_idx = 0
    
    for pixel in pixels:
        r, g, b = pixel
        
        # Modify the LSB of each color channel if we still have message bits left
        # (val & ~1) clears the last bit, then | int(bit) inserts our secret bit
        if msg_idx < len(binary_msg):
            r = (r & ~1) | int(binary_msg[msg_idx])
            msg_idx += 1
        if msg_idx < len(binary_msg):
            g = (g & ~1) | int(binary_msg[msg_idx])
            msg_idx += 1
        if msg_idx < len(binary_msg):
            b = (b & ~1) | int(binary_msg[msg_idx])
            msg_idx += 1
            
        new_pixels.append((r, g, b))
        
    # Create the new stego-image
    encoded_img = Image.new(img.mode, img.size)
    encoded_img.putdata(new_pixels)
    
    return encoded_img, "Success"

def decode_text_from_image(image_file):
    img = Image.open(image_file)
    img = img.convert('RGB')
    pixels = list(img.getdata())
    
    binary_msg = ""
    for pixel in pixels:
        r, g, b = pixel
        # Extract the last bit from each color channel
        binary_msg += str(r & 1)
        binary_msg += str(g & 1)
        binary_msg += str(b & 1)
        
    # Group the bits back into 8-bit characters
    all_bytes = [binary_msg[i: i+8] for i in range(0, len(binary_msg), 8)]
    decoded_text = ""
    
    for byte in all_bytes:
        if len(byte) == 8:
            decoded_text += chr(int(byte, 2))
            # Stop decoding once we hit our secret delimiter
            if decoded_text.endswith(DELIMITER):
                return decoded_text[:-len(DELIMITER)]
                
    return "No hidden message found."