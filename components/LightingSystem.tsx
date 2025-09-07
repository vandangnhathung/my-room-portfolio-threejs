import React, { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useToggleThemeStore } from '@/stores/toggleTheme'
import { gsap } from 'gsap'

const LightingSystem: React.FC = React.memo(() => {
  const { currentTheme, lightingConfig } = useToggleThemeStore()
  
  const sunLightRef = useRef<THREE.DirectionalLight>(null)
  const ambientLightRef = useRef<THREE.AmbientLight>(null)
  const previousThemeRef = useRef(currentTheme)
  
  // Optimized theme switching with GSAP animations
  const updateLighting = useCallback((newConfig: typeof lightingConfig) => {
    if (!sunLightRef.current || !ambientLightRef.current) return
    
    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(sunLightRef.current.color)
    gsap.killTweensOf(sunLightRef.current)
    gsap.killTweensOf(ambientLightRef.current.color)
    gsap.killTweensOf(ambientLightRef.current)
    
    // Animate sun light
    gsap.to(sunLightRef.current.color, {
      r: newConfig.sunLight.color.r,
      g: newConfig.sunLight.color.g,
      b: newConfig.sunLight.color.b,
      duration: 0.5, // Reduced from 1s to 0.5s
      ease: "power2.out"
    })
    
    gsap.to(sunLightRef.current, {
      intensity: newConfig.sunLight.intensity,
      duration: 0.5,
      ease: "power2.out"
    })
    
    // Animate ambient light
    gsap.to(ambientLightRef.current.color, {
      r: newConfig.ambientLight.color.r,
      g: newConfig.ambientLight.color.g,
      b: newConfig.ambientLight.color.b,
      duration: 0.5,
      ease: "power2.out"
    })
    
    gsap.to(ambientLightRef.current, {
      intensity: newConfig.ambientLight.intensity,
      duration: 0.5,
      ease: "power2.out"
    })
  }, [])
  
  // Only update lighting when theme actually changes
  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      updateLighting(lightingConfig)
      previousThemeRef.current = currentTheme
    }
  }, [currentTheme, lightingConfig, updateLighting])

  return (
    <>
      {/* Directional Light (Sun) */}
      <directionalLight
        ref={sunLightRef}
        position={[-1.5, 7, 3]}
        intensity={lightingConfig.sunLight.intensity}
        castShadow
        shadow-mapSize={[1024, 1024]} // Reduced from 2048x2048 for performance
        shadow-camera-far={20}
        shadow-normalBias={0.05}
      />
      
      {/* Ambient Light */}
      <ambientLight
        ref={ambientLightRef}
        intensity={lightingConfig.ambientLight.intensity}
      />
    </>
  )
})

LightingSystem.displayName = 'LightingSystem'

export default LightingSystem
