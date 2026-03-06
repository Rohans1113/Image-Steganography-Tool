from PIL import Image

def encode_gif(gif_path, secret_message, output_path):
    img = Image.open(gif_path)
    frames = []
    
    secret_message += "#####"
    binary_message = ''.join(format(ord(char), '08b') for char in secret_message)
    data_index = 0
    data_len = len(binary_message)

    try:
        while True:
            frames.append(img.copy().convert("RGBA"))
            img.seek(img.tell() + 1)
    except EOFError: pass

    for frame in frames:
        pixels = frame.load()
        width, height = frame.size
        for y in range(height):
            for x in range(width):
                if data_index < data_len:
                    r, g, b, a = pixels[x, y]
                    # Hide in Blue channel
                    pixels[x, y] = (r, g, (b & ~1) | int(binary_message[data_index]), a)
                    data_index += 1
                else: break
        if data_index >= data_len: break

    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0)

def decode_gif(gif_path):
    img = Image.open(gif_path)
    binary_data = ""
    try:
        while True:
            frame = img.convert("RGBA")
            pixels = frame.load()
            width, height = frame.size
            for y in range(height):
                for x in range(width):
                    r, g, b, a = pixels[x, y]
                    binary_data += str(b & 1)
            img.seek(img.tell() + 1)
    except EOFError: pass

    all_bytes = [binary_data[i: i+8] for i in range(0, len(binary_data), 8)]
    decoded_message = ""
    for byte in all_bytes:
        try:
            decoded_message += chr(int(byte, 2))
            if decoded_message.endswith("#####"): return decoded_message[:-5]
        except: pass
    return "Error: No hidden message found."