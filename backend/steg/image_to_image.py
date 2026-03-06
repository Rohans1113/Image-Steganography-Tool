from PIL import Image

def merge_images(cover_path, secret_path, output_path):
    cover = Image.open(cover_path).convert("RGB")
    secret = Image.open(secret_path).convert("RGB")
    secret = secret.resize(cover.size) # Resize to fit
    
    encoded = Image.new("RGB", cover.size)
    width, height = cover.size
    
    for x in range(width):
        for y in range(height):
            c = cover.getpixel((x, y))
            s = secret.getpixel((x, y))
            # Take top 4 bits of cover, put top 4 bits of secret into bottom 4 bits
            new_pixel = (
                (c[0] & 0xF0) | (s[0] >> 4),
                (c[1] & 0xF0) | (s[1] >> 4),
                (c[2] & 0xF0) | (s[2] >> 4)
            )
            encoded.putpixel((x, y), new_pixel)
    encoded.save(output_path)

def unmerge_images(encoded_path, output_path):
    img = Image.open(encoded_path).convert("RGB")
    decoded = Image.new("RGB", img.size)
    width, height = img.size
    
    for x in range(width):
        for y in range(height):
            p = img.getpixel((x, y))
            # Extract bottom 4 bits and move them to top
            new_pixel = (
                (p[0] & 0x0F) << 4,
                (p[1] & 0x0F) << 4,
                (p[2] & 0x0F) << 4
            )
            decoded.putpixel((x, y), new_pixel)
    decoded.save(output_path)