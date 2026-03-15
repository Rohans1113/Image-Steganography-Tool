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

        const response = await fetch('http://127.0.0.1:5000/api/encode-img2img', {
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

        const response = await fetch('http://127.0.0.1:5000/api/decode-img2img', {
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
            style={{
              backgroundColor: ACCENT, border: 'none', borderRadius: '6px',
              color: '#080808', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.9rem', padding: '12px 32px',
              cursor: 'pointer', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            {mode === 'encrypt' ? 'Merge Images →' : 'Extract Hidden Image →'}
          </button>
        </div>

        {output && output.type === 'text' && (
           <OutputPanel output={output.content} type="text" loading={loading} accentColor={ACCENT} />
        )}

        {output && output.type === 'image' && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #1e1e1e', borderRadius: '6px', backgroundColor: '#0f0f0f' }}>
             {label(mode === 'encrypt' ? 'Merged Stego Image (Right-click to Save)' : 'Extracted Secret Image (Right-click to Save)')}
             <img src={output.content} alt="Output" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
          </div>
        )}

      </div>
    </PageLayout>
  )
}