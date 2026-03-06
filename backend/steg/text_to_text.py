def encode_text(cover_text, secret_message):
    if not cover_text: return "Cover text required"
    binary_message = ''.join(format(ord(char), '08b') for char in secret_message)
    
    # Use Zero-Width Space (u200B) for 0, Zero-Width Non-Joiner (u200C) for 1
    hidden_payload = ""
    for bit in binary_message:
        hidden_payload += '\u200B' if bit == '0' else '\u200C'
            
    # Insert payload after first character
    return cover_text[:1] + hidden_payload + cover_text[1:]

def decode_text(encoded_text):
    binary_message = ""
    for char in encoded_text:
        if char == '\u200B': binary_message += '0'
        elif char == '\u200C': binary_message += '1'
            
    if not binary_message: return "No hidden message found."
        
    all_bytes = [binary_message[i: i+8] for i in range(0, len(binary_message), 8)]
    decoded_message = ""
    for byte in all_bytes:
        decoded_message += chr(int(byte, 2))
    return decoded_message