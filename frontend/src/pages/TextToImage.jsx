import React, { useState } from 'react'
import { Image as ImageIcon, Info, Upload } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import TabSwitcher from '../components/TabSwitcher'
import OutputPanel from '../components/OutputPanel'

const ACCENT = '#00d4ff'

const label = (text) => (
  <label style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.82rem', color: '#aaa',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    display: 'block', marginBottom: '10px',
  }}>{text}</label>
)

const textarea = (props) => (
  <textarea
    {...props}
    style={{
      width: '100%', backgroundColor: '#0f0f0f',
      border: '1px solid #1e1e1e', borderRadius: '6px',
      padding: '16px 18px', color: '#ffffff',
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '1rem', lineHeight: 1.75,
      resize: 'vertical', outline: 'none',
      minHeight: props.tall ? '160px' : '120px',
      transition: 'border-color 0.2s',
      ...props.style,
    }}
    onFocus={e => e.target.style.borderColor = props.focusColor || ACCENT}
    onBlur={e => e.target.style.borderColor = '#1e1e1e'}
  />
)

const FileUpload = ({ onFileSelect, selectedFile }) => (
  <div style={{
    border: `1px dashed ${selectedFile ? ACCENT : '#333'}`,
    borderRadius: '6px', padding: '2rem', textAlign: 'center',
    backgroundColor: '#0f0f0f', cursor: 'pointer', transition: 'all 0.2s',
  }} onClick={() => document.getElementById('file-upload').click()}>
    <Upload size={24} color={selectedFile ? ACCENT : '#666'} style={{ margin: '0 auto 10px' }} />
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: selectedFile ? '#fff' : '#666', fontSize: '0.9rem' }}>
      {selectedFile ? selectedFile.name : 'Click to upload an image (PNG, JPG)'}
    </p>
    <input
      id="file-upload" type="file" accept="image/png, image/jpeg"
      style={{ display: 'none' }}
      onChange={(e) => onFileSelect(e.target.files[0])}
    />
  </div>
)

const API_BASE_URL = "https://stegovault-api.onrender.com"; // Replace with YOUR actual URL

export default function TextInImage() {
  const [mode, setMode] = useState('encrypt')
  const [coverImage, setCoverImage] = useState(null)
  const [secretMsg, setSecretMsg] = useState('')
  const [stegoImage, setStegoImage] = useState(null)
  
  // output data will now be an object: { type: 'text' | 'image', content: string }
  const [output, setOutput] = useState(null) 
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);

    try {
      if (mode === 'encrypt') {
        if (!coverImage || !secretMsg) {
          setOutput({ type: 'text', content: '// Error: Please provide both an image and a secret message.'});
          setLoading(false);
          return;
        }

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('cover_image', coverImage);
        formData.append('secret_message', secretMsg);

        // DO NOT set Content-Type header manually when using FormData! The browser does it.
        const response = await fetch(`${API_BASE_URL}/api/encode-image`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Encoding failed");

        // The backend returns an image file (Blob), not JSON!
        const blob = await response.blob();
        
        // Create a local URL for the downloaded blob so we can display it
        const imageUrl = URL.createObjectURL(blob);
        setOutput({ type: 'image', content: imageUrl });

      } else {
        if (!stegoImage) {
          setOutput({ type: 'text', content: '// Error: Please upload a stego image to decode.'});
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('stego_image', stegoImage);

        // CHANGED: Fixed this port from 5000 to 5050
        const response = await fetch(`${API_BASE_URL}/api/decode-image`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        setOutput({ type: 'text', content: data.decoded_message || 'Error: Could not decode text.' });
      }
    } catch (error) {
      console.error("API Error:", error);
      setOutput({ type: 'text', content: "// Error: Could not connect to Python backend." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Text in Image"
      subtitle="Conceal text inside image files using Least Significant Bit (LSB) manipulation."
      badge="Module 02 — Image Steganography"
      accentColor={ACCENT}
      icon={ImageIcon}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <TabSwitcher active={mode} onChange={setMode} accentColor={ACCENT} />

        {mode === 'encrypt' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                {label('Cover Image')}
                <FileUpload onFileSelect={setCoverImage} selectedFile={coverImage} />
              </div>
              <div>
                {label('Secret Message')}
                {textarea({ placeholder: 'Enter the secret message...', value: secretMsg, onChange: e => setSecretMsg(e.target.value), tall: true })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              {label('Stego Image (upload to decode)')}
              <FileUpload onFileSelect={setStegoImage} selectedFile={stegoImage} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleRun}
            style={{
              backgroundColor: ACCENT, border: 'none', borderRadius: '6px',
              color: '#080808', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.9rem', padding: '12px 32px',
              cursor: 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {mode === 'encrypt' ? 'Hide Data in Image →' : 'Extract Data →'}
          </button>
        </div>

        {/* Adjusting how output is rendered based on whether it is an image or text */}
        {output && output.type === 'text' && (
           <OutputPanel output={output.content} type="text" loading={loading} accentColor={ACCENT} />
        )}

        {output && output.type === 'image' && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #1e1e1e', borderRadius: '6px', backgroundColor: '#0f0f0f' }}>
             {label('Encoded Image (Right-click to Save)')}
             <img src={output.content} alt="Encoded Stego" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
          </div>
        )}

      </div>
    </PageLayout>
  )
}