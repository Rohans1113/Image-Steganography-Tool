from PIL import Image

def merge_pixels(pixel1, pixel2):
    """
    Takes the top 4 bits of pixel1 (cover) and the top 4 bits of pixel2 (secret).
    Example for Red channel:
    Cover Red:  11010110 -> Keep top 4: 11010000 (bitwise AND 240 / 0xF0)
    Secret Red: 10111001 -> Keep top 4 and shift right: 00001011
    Merged:     11011011
    """
    r1, g1, b1 = pixel1
    r2, g2, b2 = pixel2
    
    r = (r1 & 0xF0) | (r2 >> 4)
    g = (g1 & 0xF0) | (g2 >> 4)
    b = (b1 & 0xF0) | (b2 >> 4)
    
    return (r, g, b)

def unmerge_pixel(pixel):
    """
    Extracts the bottom 4 bits of the merged pixel and shifts them left 
    to reconstruct the secret image.
    Merged:     11011011 -> Keep bottom 4 and shift left: 10110000
    """
    r, g, b = pixel
    
    r = (r & 0x0F) << 4
    g = (g & 0x0F) << 4
    b = (b & 0x0F) << 4
    
    return (r, g, b)

def encode_image_in_image(cover_file, secret_file):
    cover_img = Image.open(cover_file).convert('RGB')
    secret_img = Image.open(secret_file).convert('RGB')
    
    # Resize the secret image to exactly match the cover image dimensions
    secret_img = secret_img.resize(cover_img.size)
    
    cover_pixels = list(cover_img.getdata())
    secret_pixels = list(secret_img.getdata())
    
    new_pixels = [merge_pixels(cover_pixels[i], secret_pixels[i]) for i in range(len(cover_pixels))]
    
    encoded_img = Image.new(cover_img.mode, cover_img.size)
    encoded_img.putdata(new_pixels)
    
    return encoded_img

def decode_image_from_image(stego_file):
    stego_img = Image.open(stego_file).convert('RGB')
    stego_pixels = list(stego_img.getdata())
    
    extracted_pixels = [unmerge_pixel(pixel) for pixel in stego_pixels]
    
    secret_img = Image.new(stego_img.mode, stego_img.size)
    secret_img.putdata(extracted_pixels)
    
    return secret_img