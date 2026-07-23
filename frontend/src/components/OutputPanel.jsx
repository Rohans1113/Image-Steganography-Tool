import React, { useState, useEffect } from 'react'
import { Download, Copy, CheckCheck, Terminal, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIMARY_LOADING_MESSAGE = 'processing...'
const SECONDARY_LOADING_MESSAGE = 'Preparing secure steganography engine...'
const SECONDARY_MESSAGE_DELAY = 3000

export default function OutputPanel({ output, type = 'text', loading = false, accentColor = '#00ff87' }) {
  const [copied, setCopied] = useState(false)
  const [showSecondaryMessage, setShowSecondaryMessage] = useState(false)

  useEffect(() => {
    if (loading) {
      setShowSecondaryMessage(false)
      const timeout = setTimeout(() => {
        setShowSecondaryMessage(true)
      }, SECONDARY_MESSAGE_DELAY)

      return () => clearTimeout(timeout)
    } else {
      setShowSecondaryMessage(false)
    }
  }, [loading]);

  const handleCopy = () => {
    if (typeof output === 'string') {
      navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!output || type === 'text') return;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = output;
    
    // Determine extension based on type if possible, or default to png
    // In our app, type is just 'image', but outputs are blob URLs of png or gif.
    const timestamp = new Date().getTime();
    // Assuming the URL might be a blob or base64. If it's a gif, it usually has gif mime type, but .png is a safe default unless we know it's a gif.
    // The instructions say: "Preserve the original file extension." 
    // Since output is a URL object (blob:http://...), it doesn't have an extension in the string.
    // We'll use a generic .png unless we know it's a gif from the context.
    const isGif = window.location.pathname.includes('gif');
    const ext = isGif ? 'gif' : 'png';
    a.download = `stegovault_encoded_${timestamp}.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div style={{
      border: '1px solid #1a1a1a',
      borderRadius: '8px',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
    }} aria-busy={loading}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid #141414',
        backgroundColor: '#0f0f0f',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c, opacity: 0.6 }} />
            ))}
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.68rem', color: '#ffffff', letterSpacing: '0.1em',
          }}>
            OUTPUT — {type.toUpperCase()}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {output && type === 'text' && !loading && (
            <button onClick={handleCopy} style={{
              background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
              color: copied ? accentColor : '#ffffff', padding: '3px 10px', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
              display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s',
            }}>
              {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
              {copied ? 'copied!' : 'copy'}
            </button>
          )}
          {output && type !== 'text' && !loading && (
            <button onClick={handleDownload} style={{
              background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
              color: '#ffffff', padding: '3px 10px', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
              display: 'flex', alignItems: 'center', gap: '5px',
              transition: 'background-color 0.2s, color 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#1e1e1e'; e.currentTarget.style.color = accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
            >
              <Download size={11} /> download
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: '1.5rem',
        minHeight: '180px',
        display: 'flex',
        alignItems: loading || !output ? 'center' : 'flex-start',
        justifyContent: loading || !output ? 'center' : 'flex-start',
      }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Sparkles size={24} color={accentColor} />
            </motion.div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.95rem', color: '#ffffff', fontWeight: 500,
                textTransform: 'lowercase', letterSpacing: '0.02em'
              }}>
                {PRIMARY_LOADING_MESSAGE}
              </span>

              <div style={{ minHeight: '20px', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  {showSecondaryMessage && (
                    <motion.span
                      key="secondary-loading-message"
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.75rem', color: '#888', textAlign: 'center'
                      }}
                    >
                      • {SECONDARY_LOADING_MESSAGE}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div style={{ width: '160px', height: '2px', backgroundColor: '#1a1a1a', borderRadius: '1px', position: 'relative', overflow: 'hidden', marginTop: '4px' }}>
              <div style={{
                position: 'absolute', height: '100%', width: '55%',
                backgroundColor: accentColor, borderRadius: '1px',
                animation: 'slideLoader 1.2s ease-in-out infinite',
              }} />
            </div>
          </div>
        ) : output ? (
          type === 'text' ? (
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.82rem', color: accentColor,
              lineHeight: 1.8, wordBreak: 'break-all', whiteSpace: 'pre-wrap',
              width: '100%',
            }}>{output}</pre>
          ) : (
            <img src={output} alt="output" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px', objectFit: 'contain' }} />
          )
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Terminal size={18} color="#222" style={{ marginBottom: '8px', margin: '0 auto' }} />
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem', color: '#222',
            }}>
              // output will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}