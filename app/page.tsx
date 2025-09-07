'use client'

import React, { useState } from 'react'
import { LoadingSystem } from '@/components/LoadingSystem'
import { Experience } from '@/components/Experience'
import { HoverMessageConnected } from '@/components/HoverMessageConnected'
import { useCameraStore } from '@/stores/useCameraStore'
import { PopupProvider } from '@/components/PopupProvider'
import ScrollArea from '@/components/ScrollArea'
import LightingGUI from '@/components/LightingGUI'

export default function HomePage() {
  const [showUI, setShowUI] = useState(false)
  const { isCameraFocused, resetCamera } = useCameraStore()
  const handleLoadingComplete = () => {
    setShowUI(true)
  }

  return (
    <PopupProvider>
      <main style={{ width: '100%', height: '300vh', position: 'relative' }}>
        <ScrollArea>
          <LoadingSystem
            onComplete={handleLoadingComplete}
            theme="cozy"
            isDev={false}
          >
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
                <HoverMessageConnected />
              </div>
              
              {/* <LightingGUI /> */}
              
              <div
                className='absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm z-50 animate-fade-in-up'
              >
                🖱️ Use mouse to explore • 👆 Click objects to interact
              </div>
            </>
          )}
        </ScrollArea>
      </main>
    </PopupProvider>
  )
}
