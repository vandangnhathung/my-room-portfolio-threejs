import React, { Suspense } from 'react'
import { useGLTF } from '@react-three/drei'

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

// Error fallback component
function ErrorFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

// Main MyRoom component
function MyRoomModel() {
  try {
    const { scene } = useGLTF('/models/MyRoom.glb')
    
    // Optional: Log the loaded scene for debugging
    console.log('Loaded GLB scene:', scene)
    
    // Clone the scene to avoid issues with multiple instances
    const clonedScene = scene.clone()
    
    return <primitive object={clonedScene} />
  } catch (error) {
    console.error('Error loading GLB:', error)
    return <ErrorFallback />
  }
}

// Export component with Suspense wrapper
const MyRoom = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MyRoomModel />
      
      {/* Add some basic lighting if your GLB doesn't include lights */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.2} />
    </Suspense>
  )
}

// Preload the GLB file for better performance
useGLTF.preload('/models/MyRoom.glb')

export default MyRoom