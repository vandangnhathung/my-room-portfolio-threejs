// ===== FILE: app/page.tsx (REPLACE EXISTING) =====
'use client'

import { Canvas } from '@react-three/fiber'
import { Experience } from '@/components/Experience'
import { useHoverState } from '@/hooks/use-hover-state'
import { HoverMessage } from '@/components/HoverMessage'
import { PopupManager } from '@/components/popup/PopupManager'

export default function Home() {
  const { hoveredMesh, createHoverHandlers, hoverMessage } = useHoverState()

  return (
    <div className="relative w-full h-screen">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6]
        }}
        shadows
      >
        <Experience 
          hoveredMesh={hoveredMesh}
          createHoverHandlers={createHoverHandlers}
        />
      </Canvas>

      {/* Hover message overlay - renders outside Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <HoverMessage messageState={hoverMessage.messageState} />
      </div>

      {/* Add PopupManager to ensure popups are available */}
      <PopupManager />
    </div>
  )
}