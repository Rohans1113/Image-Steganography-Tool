import React from 'react'
import { Lock, Unlock } from 'lucide-react'

export default function TabSwitcher({ active, onChange, accentColor = '#00ff87', disabled = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '1rem', color: '#ffffff',
        letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        Operation Mode
      </span>
      <div style={{ display: 'flex', gap: '0', border: '1px solid #1e1e1e', borderRadius: '6px', overflow: 'hidden', width: 'fit-content' }}>
        {[
          { id: 'encrypt', label: 'Encrypt', icon: Lock,   desc: 'Hide data' },
          { id: 'decrypt', label: 'Decrypt', icon: Unlock, desc: 'Extract data' },
        ].map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px',
                border: 'none', outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: isActive ? accentColor : '#0f0f0f',
                color: isActive ? '#080808' : '#b7b7b7',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.85rem',
                letterSpacing: '0.02em',
                borderRight: tab.id === 'encrypt' ? '1px solid #1e1e1e' : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled && !isActive ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'auto',
              }}
            >
              <tab.icon size={13} strokeWidth={2} />
              {tab.label}
              <span style={{
                fontSize: '0.65rem',
                opacity: 0.6,
                fontWeight: 400,
              }}>
                — {tab.desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}