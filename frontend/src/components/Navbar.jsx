import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, FileText, Image, Layers, Film } from 'lucide-react'

const navItems = [
  { path: '/text-to-text',   label: 'Text in Text',   sub: 'Hide messages in plain text',  icon: FileText, accent: '#00ff87' },
  { path: '/text-to-image',  label: 'Text in Image',  sub: 'Embed text into image pixels',  icon: Image,   accent: '#00d4ff' },
  { path: '/image-to-image', label: 'Image in Image', sub: 'Hide image inside image',       icon: Layers,  accent: '#ff0000' },
  { path: '/text-to-gif',    label: 'Text in GIF',    sub: 'Encode text across GIF frames', icon: Film,    accent: '#ffc740' },
]

export default function Navbar() {
  const location = useLocation()
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid #1e1e1e',
      backgroundColor: 'rgba(8,8,8,0.97)',
      backdropFilter: 'blur(20px)',
      width: '100%',
    }}>
      <div style={{
        width: '100%',
        padding: '0 4vw',
        height: '80px',                 /* bigger navbar */
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px',
            border: '1px solid #00ff87',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={20} color="#00ff87" strokeWidth={1.5} />
          </div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '1.35rem',
            color: '#ffffff', letterSpacing: '-0.02em',
          }}>
            Stego<span style={{ color: '#00ff87' }}>Vault</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navItems.map(item => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.sub}
                style={{
                  textDecoration: 'none',
                  padding: '10px 22px',
                  borderRadius: '6px',
                  border: `1px solid ${active ? item.accent : 'transparent'}`,
                  backgroundColor: active ? `${item.accent}18` : 'transparent',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '9px',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#ffffff0a' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <item.icon size={16} color={active ? item.accent : '#777'} strokeWidth={1.5} />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: active ? 600 : 400,
                  color: active ? item.accent : '#bbb',
                  letterSpacing: '0.01em',
                }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Clock */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.9rem', color: '#555',
          letterSpacing: '0.1em',
          border: '1px solid #1e1e1e',
          padding: '7px 16px',
        }}>
          {time}
        </div>
      </div>
    </nav>
  )
}