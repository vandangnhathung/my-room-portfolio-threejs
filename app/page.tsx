'use client'

import React, { useState } from 'react'
import { LoadingSystem } from '@/components/LoadingSystem'
import { Experience } from '@/components/Experience'
import { PopupManager } from '@/components/popup/PopupManager'
import { useHoverState } from '@/hooks/use-hover-state'
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
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(139, 115, 85, 0.9)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '14px',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              animation: 'fadeInUp 1s ease-out'
            }}
          >
            🖱️ Use mouse to explore • 👆 Click objects to interact
          </div>
        </>
      )}
    </main>
  )
}
