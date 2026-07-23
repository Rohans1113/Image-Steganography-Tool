import React from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0px 0px rgba(0, 255, 135, 0.0)",
              "0 0 40px 10px rgba(0, 255, 135, 0.2)",
              "0 0 0px 0px rgba(0, 255, 135, 0.0)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ borderRadius: '50%', padding: '10px' }}
        >
          <img src="/logo.svg" alt="StegoVault Logo" style={{ width: '80px', height: '80px' }} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '4rem',
            color: '#ffffff',
            margin: '20px 0 0 0',
            letterSpacing: '0.05em'
          }}
        >
          STEGOVAULT
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1rem',
            color: '#888',
            margin: '5px 0 30px 0',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          Secure Digital Steganography Suite
        </motion.p>

        {/* Thin Animated Loading Bar */}
        <div style={{ width: '200px', height: '2px', backgroundColor: '#1a1a1a', borderRadius: '1px', overflow: 'hidden' }}>
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ width: '50%', height: '100%', backgroundColor: '#00ff87', borderRadius: '1px' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
