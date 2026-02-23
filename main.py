from PIL import Image

def encode_image(image_path, secret_message, output_path):
    """Hides a secret message inside an image using LSB."""
    
    # Open the image and prepare a copy for modification
    img = Image.open(image_path)
    encoded_img = img.copy()
    width, height = img.size
    
    # Append a delimiter to the message so the decoder knows when to stop
    # We will use "#####" as our stopping sequence
    secret_message += "#####" 
    
    # Convert the entire text message into a continuous string of 1s and 0s
    binary_message = ''.join(format(ord(char), '08b') for char in secret_message)
    data_len = len(binary_message)
    
    data_index = 0
    
    # Loop through every pixel in the image
    for y in range(height):
        for x in range(width):
            # Extract the RGB values (e.g., [255, 120, 10])
            pixel = list(img.getpixel((x, y)))
            
            # Loop through the Red, Green, and Blue channels
            for c in range(3):
                if data_index < data_len:
                    # Bitwise operation to clear the LSB and insert the message bit
                    pixel[c] = pixel[c] & ~1 | int(binary_message[data_index])
                    data_index += 1
                    
            # Update the pixel in the new image
            encoded_img.putpixel((x, y), tuple(pixel))
            
            # Stop once all bits of the message are hidden
            if data_index >= data_len:
                # MUST save as PNG to avoid lossy compression destroying the data
                encoded_img.save(output_path)
                print(f"Success: Message hidden and saved to {output_path}")
                return

def decode_image(image_path):
    """Extracts a hidden message from an image."""
    
    img = Image.open(image_path)
    width, height = img.size
    
    binary_data = ""
    
    # Extract the LSB from every color channel of every pixel
    for y in range(height):
        for x in range(width):
            pixel = list(img.getpixel((x, y)))
            
            for c in range(3):
                # Extract the last bit (LSB) and add it to our data string
                binary_data += str(pixel[c] & 1)
    
    # Split the massive binary string into 8-bit chunks
    all_bytes = [binary_data[i: i+8] for i in range(0, len(binary_data), 8)]
    decoded_message = ""
    
    # Convert each 8-bit chunk back into a character
    for byte in all_bytes:
        decoded_message += chr(int(byte, 2))
        
        # Check if the last 5 characters match our delimiter
        if decoded_message[-5:] == "#####":
            # Return the message without the delimiter
            return decoded_message[:-5]
            
    return "Error: No hidden message found or delimiter missing."

# --- Execution Example ---
if __name__ == "__main__":
    input_image = "test.jpg" 
    output_image = "encoded_image.png"
    message_to_hide = "Silence is the ultimate weapon."
    
    # 1. Encode the message
    encode_image(input_image, message_to_hide, output_image)
    
    # 2. Decode the message from the new image
    retrieved_message = decode_image(output_image)
    print(f"Retrieved Message: {retrieved_message}")