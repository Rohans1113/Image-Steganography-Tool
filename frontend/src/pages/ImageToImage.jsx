import React, { useState } from 'react'
import { Layers, Info, Upload } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import TabSwitcher from '../components/TabSwitcher'
import OutputPanel from '../components/OutputPanel'

const ACCENT = '#ff0000'

const label = (text) => (
  <label style={{
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.82rem', color: '#aaa',
    letterSpacing: '0.12em', textTransform: 'uppercase',
    display: 'block', marginBottom: '10px',
  }}>{text}</label>
)

const FileUpload = ({ onFileSelect, selectedFile, id }) => (
  <div style={{
    border: `1px dashed ${selectedFile ? ACCENT : '#333'}`,
    borderRadius: '6px', padding: '2rem', textAlign: 'center',
    backgroundColor: '#0f0f0f', cursor: 'pointer', transition: 'all 0.2s',
  }} onClick={() => document.getElementById(id).click()}>
    <Upload size={24} color={selectedFile ? ACCENT : '#666'} style={{ margin: '0 auto 10px' }} />
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: selectedFile ? '#fff' : '#666', fontSize: '0.9rem' }}>
      {selectedFile ? selectedFile.name : 'Click to upload an image (PNG, JPG)'}
    </p>
    <input
      id={id} type="file" accept="image/png, image/jpeg"
      style={{ display: 'none' }}
      onChange={(e) => onFileSelect(e.target.files[0])}
    />
  </div>
)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with YOUR actual URL

export default function ImageInImage() {
  const [mode, setMode] = useState('encrypt')
  
  // State for the three possible image uploads
  const [coverImage, setCoverImage] = useState(null)
  const [secretImage, setSecretImage] = useState(null)
  const [stegoImage, setStegoImage] = useState(null)
  
  const [output, setOutput] = useState(null) 
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);

    try {
      if (mode === 'encrypt') {
        if (!coverImage || !secretImage) {
          setOutput({ type: 'text', content: '// Error: Please upload both a Cover Image and a Secret Image.'});
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('cover_image', coverImage);
        formData.append('secret_image', secretImage);

        const response = await fetch(`${API_BASE_URL}/api/encode-img2img`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Encoding failed");

        // The backend returns the merged stego image file
        const blob = await response.blob();
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

        const response = await fetch(`${API_BASE_URL}/api/decode-img2img`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Decoding failed");

        // The backend returns the extracted secret image file
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutput({ type: 'image', content: imageUrl });
      }
    } catch (error) {
      console.error("API Error:", error);
      setOutput({ type: 'text', content: "// Error: Could not connect to Python backend or process image." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Image in Image"
      subtitle="Hide an entire photograph inside another image by merging their Most Significant Bits (MSB)."
      badge="Module 03 — Advanced Steganography"
      accentColor={ACCENT}
      icon={Layers}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <TabSwitcher active={mode} onChange={setMode} accentColor={ACCENT} />

        {mode === 'encrypt' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                {label('Cover Image (Public)')}
                <FileUpload id="upload-cover" onFileSelect={setCoverImage} selectedFile={coverImage} />
              </div>
              <div>
                {label('Secret Image (To Hide)')}
                <FileUpload id="upload-secret" onFileSelect={setSecretImage} selectedFile={secretImage} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              {label('Stego Image (upload to extract secret photo)')}
              <FileUpload id="upload-stego" onFileSelect={setStegoImage} selectedFile={stegoImage} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              backgroundColor: ACCENT, border: 'none', borderRadius: '6px',
              color: '#080808', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.9rem', padding: '12px 32px',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={e => { if(!loading) e.target.style.opacity = '0.85' }}
            onMouseLeave={e => { if(!loading) e.target.style.opacity = '1' }}
          >
            {mode === 'encrypt' ? 'Merge Images →' : 'Extract Hidden Image →'}
          </button>
        </div>

        <OutputPanel 
          output={output ? output.content : null} 
          type={output ? output.type : 'text'} 
          loading={loading} 
          accentColor={ACCENT} 
        />

      </div>
    </PageLayout>
  )
}