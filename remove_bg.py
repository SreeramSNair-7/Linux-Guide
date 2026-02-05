from PIL import Image

# Open the image
img = Image.open('public/image.png')

# Convert to RGBA if not already
img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create new image data with transparent white background
new_data = []
for item in data:
    # If pixel is white or very close to white, make it transparent
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((item[0], item[1], item[2], 0))  # Transparent
    else:
        new_data.append(item)

# Update image
img.putdata(new_data)

# Save as PNG
img.save('public/image.png', 'PNG')
print('✓ Logo background removed - transparent PNG created')
