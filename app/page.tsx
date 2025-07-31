'use client'

import React, { useState } from 'react'
import { LoadingSystem } from '@/components/LoadingSystem'
import { Experience } from '@/components/Experience'
import { HoverMessage } from '@/components/HoverMessage'
import { useMessageState } from '@/stores/useHoverStore'
import { useCameraStore } from '@/stores/useCameraStore'

export default function HomePage() {
  const [showUI, setShowUI] = useState(false)
  const messageState = useMessageState()
  const { isCameraFocused, resetCamera } = useCameraStore()
  const handleLoadingComplete = () => {
    setShowUI(true)
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoadingSystem
        onComplete={handleLoadingComplete}
        theme="cozy">
        <Experience />
      </LoadingSystem>

      {isCameraFocused && (
          <button className='absolute top-3 left-3 bg-primary
           text-white px-4 py-2 rounded-lg !opacity-100 text-sm z-50 animate-fade-in-up
           hover:bg-white hover:text-primary transition-all duration-300 cursor-pointer'
              onClick={() => {
              resetCamera(true)
              }}
            >
              Go back
            </button>
        )}
      {showUI && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <HoverMessage messageState={messageState} />
          </div>
          
          <div
            className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm z-50 animate-fade-in-up'
          >
            🖱️ Use mouse to explore • 👆 Click objects to interact
          </div>
        </>
      )}
    </main>
  )
}
