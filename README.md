# StegoVault: Secure Digital Steganography Suite

## Overview
StegoVault is a comprehensive, full-stack application designed to conceal and extract sensitive payloads within various digital media formats. By manipulating the fundamental structure of files—ranging from binary pixel data to zero-width Unicode characters—the system ensures that hidden data remains undetected by human perception and standard analytical tools. This project serves as a practical implementation of advanced steganographic techniques, demonstrating the intersection of cryptography, data encoding, and digital media processing.

## Key Features and Capabilities
The suite comprises four distinct modules, each utilizing specialized algorithms for data concealment:

*   **Text-in-Image (Least Significant Bit Steganography):** Embeds text payloads directly into the RGB channels of lossless image files (PNG/BMP) by modifying the Least Significant Bits (LSB). This ensures the visual integrity of the cover image while securely storing binary data.
*   **Image-in-Image (Most Significant Bit Merging):** Conceals an entire photograph within another cover image. This is achieved by compressing the color depth of the secret image and merging it into the lower-order bits of the cover image, creating a composite file that appears unaltered.
*   **Text-in-GIF (End-of-File Injection):** Injects secret messages past the End-Of-File (EOF) marker of animated GIF files. This technique allows the animation to play normally without data corruption, as standard image viewers ignore data appended post-EOF.
*   **Text-in-Text (Zero-Width Character Encoding):** Translates binary data into non-printing Unicode characters (zero-width spaces, joiners, and non-joiners) and embeds them within ordinary, plain-text cover messages.

## System Architecture and Technology Stack
The application is built on a modern, decoupled architecture, separating the computational heavy-lifting from the user interface.

*   **Frontend Interface:** Developed using React.js and Vite. It features a responsive, state-driven UI with fluid animations powered by Framer Motion, ensuring a premium user experience.
*   **Backend Processing API:** Developed using Python and the Flask microframework. The backend exposes RESTful endpoints to process media files securely and efficiently.
*   **Core Dependencies:** 
    *   `Pillow` (PIL) for deep-level pixel manipulation and image processing.
    *   `React Router` for client-side navigation.

## System Requirements
To deploy and run the application locally, the following environment is required:
*   Node.js (v16.0 or higher) and npm
*   Python (v3.8 or higher)
*   Virtual Environment (recommended for Python dependencies)

## Installation and Execution

### 1. Backend Setup
Navigate to the backend directory and establish the Python environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*The Flask server will initialize and listen on port 5050.*

### 2. Frontend Setup
Open a new terminal session, navigate to the frontend directory, install the necessary node modules, and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
*The React application will be accessible via localhost.*

## Usage Guidelines
*   **Lossless Formats:** When utilizing the Image Steganography modules, always use and output lossless formats (such as PNG) to prevent compression algorithms (e.g., JPEG) from destroying the embedded binary payload.
*   **File Size Constraints:** The capacity of the hidden payload is strictly limited by the resolution and format of the cover media. Exceeding these bounds will result in processing errors or visible artifacting.
