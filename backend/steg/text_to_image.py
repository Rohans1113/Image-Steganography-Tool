from PIL import Image

def encode_image(image_path, secret_message, output_path):
    img = Image.open(image_path)
    encoded_img = img.copy()
    width, height = img.size
    
    secret_message += "#####" # Terminator
    binary_message = ''.join(format(ord(char), '08b') for char in secret_message)
    data_len = len(binary_message)
    data_index = 0
    
    for y in range(height):
        for x in range(width):
            if data_index < data_len:
                pixel = list(img.getpixel((x, y)))
                for c in range(3): # R, G, B
                    if data_index < data_len:
                        pixel[c] = pixel[c] & ~1 | int(binary_message[data_index])
                        data_index += 1
                encoded_img.putpixel((x, y), tuple(pixel))
            else:
                encoded_img.save(output_path)
                return

def decode_image(image_path):
    img = Image.open(image_path)
    binary_data = ""
    width, height = img.size
    
    for y in range(height):
        for x in range(width):
            pixel = list(img.getpixel((x, y)))
            for c in range(3):
                binary_data += str(pixel[c] & 1)
                
    all_bytes = [binary_data[i: i+8] for i in range(0, len(binary_data), 8)]
    decoded_message = ""
    for byte in all_bytes:
        try:
            decoded_message += chr(int(byte, 2))
            if decoded_message.endswith("#####"):
                return decoded_message[:-5]
        except: pass
    return "Error: No hidden message found."