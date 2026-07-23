import React, { useState } from 'react'
import { FileVideo, Info, Upload } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import TabSwitcher from '../components/TabSwitcher'
import OutputPanel from '../components/OutputPanel'

const ACCENT = '#ffc740'

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

const FileUpload = ({ onFileSelect, selectedFile, id, disabled = false }) => (
  <div style={{
    border: `1px dashed ${selectedFile ? ACCENT : '#333'}`,
    borderRadius: '6px', padding: '2rem', textAlign: 'center',
    backgroundColor: '#0f0f0f', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  }} onClick={() => document.getElementById(id).click()}>
    <Upload size={24} color={selectedFile ? ACCENT : '#666'} style={{ margin: '0 auto 10px' }} />
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", color: selectedFile ? '#fff' : '#666', fontSize: '0.9rem' }}>
      {selectedFile ? selectedFile.name : 'Click to upload a GIF'}
    </p>
    <input
      id={id} type="file" accept="image/gif"
      style={{ display: 'none' }}
      disabled={disabled}
      onChange={(e) => onFileSelect(e.target.files[0])}
    />
  </div>
)

export default function TextInGif() {
  const [mode, setMode] = useState('encrypt')
  
  const [coverGif, setCoverGif] = useState(null)
  const [secretMsg, setSecretMsg] = useState('')
  const [stegoGif, setStegoGif] = useState(null)
  
  const [output, setOutput] = useState(null) 
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (loading) return
    setLoading(true);
    setOutput(null);

    try {
      if (mode === 'encrypt') {
        if (!coverGif || !secretMsg) {
          setOutput({ type: 'text', content: '// Error: Please provide both a Cover GIF and a Secret Message.'});
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('cover_gif', coverGif);
        formData.append('secret_message', secretMsg);

        const response = await fetch('https://stegovault-cmgd.onrender.com/api/encode-gif', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Encoding failed");

        // Backend returns the modified GIF file
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setOutput({ type: 'image', content: imageUrl });

      } else {
        if (!stegoGif) {
          setOutput({ type: 'text', content: '// Error: Please upload a stego GIF to decode.'});
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('stego_gif', stegoGif);

        // CHANGED: Fixed this port from 5000 to 5050
        const response = await fetch('https://stegovault-cmgd.onrender.com/api/decode-gif', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error("Decoding failed");

        // Backend returns JSON with the extracted text
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
      title="Text in GIF"
      subtitle="Conceal text inside animated GIF files by injecting data safely past the End-Of-File (EOF) marker."
      badge="Module 04 — EOF Steganography"
      accentColor={ACCENT}
      icon={FileVideo}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <TabSwitcher active={mode} onChange={setMode} accentColor={ACCENT} />

        {mode === 'encrypt' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                {label('Cover GIF')}
                <FileUpload id="upload-cover-gif" onFileSelect={setCoverGif} selectedFile={coverGif} disabled={loading} />
              </div>
              <div>
                {label('Secret Message')}
                {textarea({ placeholder: 'Enter the secret message...', value: secretMsg, onChange: e => setSecretMsg(e.target.value), tall: true, disabled: loading, style: loading ? { cursor: 'not-allowed', opacity: 0.6 } : undefined })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              {label('Stego GIF (upload to extract message)')}
              <FileUpload id="upload-stego-gif" onFileSelect={setStegoGif} selectedFile={stegoGif} disabled={loading} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={handleRun}
            disabled={loading}
            aria-busy={loading}
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
            {loading ? 'Processing...' : (mode === 'encrypt' ? 'Inject Data into GIF →' : 'Extract Hidden Data →')}
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