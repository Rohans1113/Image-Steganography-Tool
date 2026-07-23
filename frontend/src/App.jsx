import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import TextToText from './pages/TextToText'
import TextToImage from './pages/TextToImage'
import ImageToImage from './pages/ImageToImage'
import TextToGif from './pages/TextToGif'
import SplashScreen from './components/SplashScreen'

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds on initial load
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text-to-text" element={<TextToText />} />
              <Route path="/text-to-image" element={<TextToImage />} />
              <Route path="/image-to-image" element={<ImageToImage />} />
              <Route path="/text-to-gif" element={<TextToGif />} />
            </Routes>
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  )
}