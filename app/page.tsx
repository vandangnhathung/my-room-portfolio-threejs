'use client'

import { Canvas } from '@react-three/fiber'
import { Experience } from '@/components/Experience'
import { PopupManager, PopupTestButtons } from '@/components/PopupManager'

export default function Home() {
  return (
    <>
      {/* Main 3D Canvas */}
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [10, 10, 10]
        }}
        style={{
          width: '100vw',
          height: '100vh',
          background: 'black'
        }}
      >
        <Experience />
      </Canvas>

      {/* Popup Manager - renders popup HTML outside Canvas */}
      <PopupManager />

      {/* Optional: Test buttons for development */}
      {process.env.NODE_ENV === 'development' && <PopupTestButtons />}
    </>
  )
}