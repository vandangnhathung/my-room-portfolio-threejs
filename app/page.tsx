'use client'

import React, { useState } from 'react'
import { LoadingSystem } from '@/components/LoadingSystem'
import { Experience } from '@/components/Experience'
import { PopupManager } from '@/components/popup/PopupManager'
import { useHoverState } from '@/hooks/hovering/use-hover-state'
import { HoverMessage } from '@/components/HoverMessage'

export default function HomePage() {
  const [showUI, setShowUI] = useState(false) // Only controls UI elements, not 3D scene
  const { hoveredMesh, createHoverHandlers, hoverMessage } = useHoverState()

  const handleLoadingComplete = () => {
    setShowUI(true) // Show UI elements after loading is complete
  }

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 
        LoadingSystem now contains BOTH the Canvas AND the loading overlay
        The 3D scene starts loading immediately when this component mounts
        The progress bar shows the ACTUAL loading progress of the models
      */}
      <LoadingSystem
        onComplete={handleLoadingComplete}
        theme="cozy"
        customMessages={{
          initializing: 'Preparing your cozy room...',
          loading: 'Loading furniture and decor...',
          ready: 'Your room is ready to explore!',
          entering: 'Welcome home...'
        }}
      >
        {/* 
          Your 3D scene goes HERE as children
          This will start loading immediately when LoadingSystem mounts
          The progress bar will track the loading of these models
        */}
        <Experience 
          hoveredMesh={hoveredMesh}
          createHoverHandlers={createHoverHandlers}
        />
      </LoadingSystem>
      
      {/* UI elements that appear after loading is complete */}
      {showUI && (
        <>
          <PopupManager />

          <div className="absolute inset-0 pointer-events-none">
        <HoverMessage messageState={hoverMessage.messageState} />
      </div>
          
          {/* Navigation hint */}
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
