import { useRef, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
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
  const targetSpeedRef = useRef(initialSpeed)
  
  // Stable useFrame callback
  const animationCallback = useCallback((state: RootState, delta: number) => {
    if (!meshRef.current || meshName !== 'Executive_office_chair_raycaster') return
    
    // Smooth speed interpolation (manual spring replacement)
    speedRef.current += (targetSpeedRef.current - speedRef.current) * delta * 5 // 5 is tension factor
    
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
  }, [meshName]) // Only recreate if meshName changes

  useFrame(animationCallback)

  // Add cleanup effect
  useEffect(() => {
    return () => {
      // Reset any ongoing animations
      timeRef.current = 0
      speedRef.current = initialSpeed
      targetSpeedRef.current = initialSpeed
    }
  }, [meshName, initialSpeed])

  // Functions to control speed - now just update target values
  const increaseSpeed = useCallback(() => {
    targetSpeedRef.current = Math.min(targetSpeedRef.current + 0.2, 2.0)
  }, [])
  
  const decreaseSpeed = useCallback(() => {
    targetSpeedRef.current = Math.max(targetSpeedRef.current - 0.2, 0.1)
  }, [])
  
  const setRotationSpeed = useCallback((newSpeed: number) => {
    targetSpeedRef.current = Math.max(0.1, Math.min(newSpeed, 3.0))
  }, [])
  
  const resetSpeed = useCallback(() => {
    targetSpeedRef.current = initialSpeed
  }, [initialSpeed])

  return {
    meshRef,
    get currentSpeed() { return speedRef.current }, // Getter to avoid creating new objects
    increaseSpeed,
    decreaseSpeed,
    setRotationSpeed,
    resetSpeed
  }
}