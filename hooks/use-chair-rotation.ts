import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'

// Hook for chair rotation animation
export const useChairRotation = (meshName: string, initialSpeed: number = 0.7) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Convert degrees to radians
  const minRotation = (40 * Math.PI) / 180 // 40 degrees
  const maxRotation = (140 * Math.PI) / 180 // 90 degrees
  
  // Time reference for smooth oscillation
  const timeRef = useRef(0)
  const speedRef = useRef(initialSpeed)
  
  // Spring for smooth speed transitions
  const [{ speed }, setSpeed] = useSpring(() => ({
    speed: initialSpeed,
    config: { tension: 100, friction: 20 }
  }))

  useFrame((state, delta) => {
    if (!meshRef.current || meshName !== 'Executive_office_chair_raycaster') return
    
    // Update time with current speed
    timeRef.current += delta * speedRef.current
    
    // Calculate oscillating Y-axis rotation (turning motion)
    // Y-axis rotation - chair turns left and right
    const yRotation = minRotation + (maxRotation - minRotation) * 
      (Math.sin(timeRef.current * 0.8) * 0.5 + 0.5)
    
    // Apply rotation to Y-axis only
    // Preserve any existing X and Z rotations from the original config
    const originalX = meshRef.current.rotation.x
    const originalZ = meshRef.current.rotation.z
    meshRef.current.rotation.set(originalX, yRotation, originalZ)
    
    // Update speed reference for frame calculations
    speedRef.current = speed.get()
  })

  // Functions to control speed
  const increaseSpeed = () => {
    setSpeed({ speed: Math.min(speedRef.current + 0.2, 2.0) })
  }
  
  const decreaseSpeed = () => {
    setSpeed({ speed: Math.max(speedRef.current - 0.2, 0.1) })
  }
  
  const setRotationSpeed = (newSpeed: number) => {
    setSpeed({ speed: Math.max(0.1, Math.min(newSpeed, 3.0)) })
  }
  
  const resetSpeed = () => {
    setSpeed({ speed: initialSpeed })
  }

  return {
    meshRef,
    currentSpeed: speedRef.current,
    increaseSpeed,
    decreaseSpeed,
    setRotationSpeed,
    resetSpeed
  }
}