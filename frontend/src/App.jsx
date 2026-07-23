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

const SPLASH_DURATION_MS = 2500

const splashRuntime = {
  completed: false,
  timerId: null,
  listeners: new Set(),
}

function scheduleSplashDismissal() {
  if (splashRuntime.completed || splashRuntime.timerId !== null) return

  splashRuntime.timerId = window.setTimeout(() => {
    splashRuntime.completed = true
    splashRuntime.timerId = null
    splashRuntime.listeners.forEach((listener) => listener())
    splashRuntime.listeners.clear()
  }, SPLASH_DURATION_MS)
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !splashRuntime.completed)

  useEffect(() => {
    if (splashRuntime.completed) {
      setShowSplash(false)
      return
    }

    const hideSplash = () => setShowSplash(false)

    splashRuntime.listeners.add(hideSplash)
    scheduleSplashDismissal()
    setShowSplash(true)

    return () => {
      splashRuntime.listeners.delete(hideSplash)
    }
  }, []);

  return (
    <>
      <AnimatePresence initial={false}>
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