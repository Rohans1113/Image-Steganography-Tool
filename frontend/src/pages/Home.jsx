import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Image, Layers, Film, ArrowRight, Lock, Cpu, Shield } from 'lucide-react'
import DotGrid from '../components/DotGrid'

const modules = [
  {
    id: '01', label: 'Text in Text',
    desc: 'Conceal secret messages inside ordinary-looking cover text using invisible zero-width Unicode characters.',
    path: '/text-to-text', icon: FileText, accent: '#00ff87',
    tags: ['Zero-Width Encoding', 'Unicode'],
  },
  {
    id: '02', label: 'Text in Image',
    desc: 'Embed hidden text into image pixel data using LSB steganography. Output is visually identical to the original.',
    path: '/text-to-image', icon: Image, accent: '#00d4ff',
    tags: ['LSB Encoding', 'PNG / BMP'],
  },
  {
    id: '03', label: 'Image in Image',
    desc: 'Conceal a full secret image inside a carrier image by blending across bit planes. Zero visual difference.',
    path: '/image-to-image', icon: Layers, accent: '#ff3cac',
    tags: ['Pixel Blending', 'Bit-plane'],
  },
  {
    id: '04', label: 'Text in GIF',
    desc: 'Encode secret messages across GIF animation frames using inter-frame delta techniques.',
    path: '/text-to-gif', icon: Film, accent: '#ffc740',
    tags: ['Frame Delta', 'Palette Order'],
  },
]

export default function Home() {
  const heroRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !bgRef.current) return
      const heroH = heroRef.current.offsetHeight
      const opacity = Math.max(0, 1 - (window.scrollY / (heroH * 0.55)))
      bgRef.current.style.opacity = opacity
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* ══ HERO — exactly 100vh minus navbar ══ */}
      <div
        ref={heroRef}
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vh - 80px)',   /* fixed height = full viewport */
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* DotGrid background */}
        <div ref={bgRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <DotGrid
            dotSize={3}
            gap={28}
            baseColor="#1f382a"
            activeColor="#00ff87"
            proximity={230}
          />
        </div>

        {/* Vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(8,8,8,0.95) 100%)',
        }} />

        {/* All hero content in one flex column, gap controlled tightly */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(1rem, 2vh, 1.8rem)',
          padding: '0 4vw',
          width: '100%',
          maxWidth: '100%',
          textAlign: 'center',
          animation: 'fadeUp 0.7s ease both',
        }}>

          {/* Heading */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3.5rem, 10vw, 11rem)',
            letterSpacing: '0.04em',
            lineHeight: 0.92,
            margin: 0,
          }}>
            <span style={{ color: '#ffffff', display: 'block' }}>CONCEALED IN</span>
            <span style={{
              display: 'block',
              color: 'transparent',
              WebkitTextStroke: '2px #00ff87',
            }}>
              EVERY PIXEL.
            </span>
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)',
            color: '#cccccc',
            lineHeight: 1.75,
            maxWidth: '540px',
            margin: 0,
          }}>
            Your secrets hide in plain sight —{' '}
            <span style={{ color: '#00ff87' }}>encoded in pixels, frames & invisible characters.</span>
          </p>

          {/* Feature chips */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            justifyContent: 'center',
          }}>
            {[
              { icon: Lock,   text: 'Encrypt & Decrypt', color: '#ff3cac'  },
              { icon: Shield, text: '4 Stego Methods',   color: '#00d4ff' },
            ].map(item => (
              <div key={item.text} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '1px solid #222', borderRadius: '6px',
                padding: '8px 16px',
                backgroundColor: 'rgba(8,8,8,0.8)',
                backdropFilter: 'blur(6px)',
              }}>
                <item.icon size={14} color={item.color} strokeWidth={1.5} />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.82rem, 1vw, 1rem)',
                  color: '#ccc',
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button — scrolls to module grid */}
        <div style={{
          zIndex: 2,
          display: 'flex', justifyContent: 'center',
          marginTop: 'clamp(1.75rem, 4vh, 3rem)',
          animation: 'fadeUp 1s ease 0.8s both',
        }}>
          <button
            onClick={() => document.getElementById('modules').scrollIntoView({ behavior: 'smooth' })}
            style={{
              backgroundColor: '#00ff87', border: 'none', borderRadius: '6px',
              color: '#080808', fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1.1rem', padding: '16px 48px',
              cursor: 'pointer', letterSpacing: '0.02em',
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Explore Modules ↓
          </button>
        </div>
      </div>

      {/* ══ MODULE GRID ══ */}
      <div id="modules" style={{ width: '100%', padding: '5rem 4vw 7rem', backgroundColor: '#080808' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={{ width: '40px', height: '1px', backgroundColor: '#00ff87' }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem', color: '#00ff87',
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            Select Module
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#1a1a1a' }} />
        </div>

        {/* Responsive grid: 4 cols on wide, 2 on medium, 1 on small */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1px', backgroundColor: '#1a1a1a',
          border: '1px solid #1a1a1a', borderRadius: '8px', overflow: 'hidden',
        }}>
          {modules.map(mod => (
            <Link key={mod.id} to={mod.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div
                style={{
                  backgroundColor: '#0c0c0c', padding: '2.5rem 2rem',
                  height: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem',
                  transition: 'background-color 0.2s', cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#111'
                  e.currentTarget.querySelector('.card-arrow').style.opacity = '1'
                  e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(6px)'
                  e.currentTarget.querySelector('.card-line').style.width = '100%'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#0c0c0c'
                  e.currentTarget.querySelector('.card-arrow').style.opacity = '0.2'
                  e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(0)'
                  e.currentTarget.querySelector('.card-line').style.width = '0%'
                }}
              >
                <div className="card-line" style={{
                  height: '2px', backgroundColor: mod.accent,
                  width: '0%', transition: 'width 0.35s ease',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.78rem', color: mod.accent, letterSpacing: '0.15em', opacity: 0.7,
                  }}>
                    {mod.id} ——
                  </span>
                  <mod.icon size={20} color={mod.accent} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                </div>

                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)',
                  letterSpacing: '0.04em', color: '#ffffff', lineHeight: 1,
                }}>
                  {mod.label}
                </h3>

                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(0.88rem, 1vw, 1rem)',
                  color: '#888', lineHeight: 1.75, flex: 1,
                }}>
                  {mod.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mod.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.7rem', color: mod.accent,
                      border: `1px solid ${mod.accent}30`,
                      padding: '3px 10px', borderRadius: '2px',
                      letterSpacing: '0.06em', opacity: 0.8,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ArrowRight size={18} color={mod.accent} className="card-arrow"
                    style={{ opacity: 0.2, transition: 'all 0.25s ease' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  )
}