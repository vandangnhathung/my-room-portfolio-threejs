import React, { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { useToggleThemeStore } from '@/stores/toggleTheme'
import { gsap } from 'gsap'

const LightingSystem: React.FC = React.memo(() => {
  const { currentTheme, lightingConfig } = useToggleThemeStore()
  
  const sunLightRef = useRef<THREE.DirectionalLight>(null)
  const ambientLightRef = useRef<THREE.AmbientLight>(null)
  const previousThemeRef = useRef(currentTheme)
  const isInitializedRef = useRef(false)
  
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
      duration: 0.5,
      ease: "power2.out"
    })
    
    gsap.to(sunLightRef.current, {
      intensity: newConfig.sunLight.intensity,
      duration: 1,
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
      duration: 1,
      ease: "power2.out"
    })
  }, [])
  
  // Initialize lighting on first render and update on theme changes
  useEffect(() => {
    if (!isInitializedRef.current) {
      // First render - set initial values without animation
      if (sunLightRef.current && ambientLightRef.current) {
        sunLightRef.current.color.setRGB(
          lightingConfig.sunLight.color.r,
          lightingConfig.sunLight.color.g,
          lightingConfig.sunLight.color.b
        )
        sunLightRef.current.intensity = lightingConfig.sunLight.intensity
        
        ambientLightRef.current.color.setRGB(
          lightingConfig.ambientLight.color.r,
          lightingConfig.ambientLight.color.g,
          lightingConfig.ambientLight.color.b
        )
        ambientLightRef.current.intensity = lightingConfig.ambientLight.intensity
        
        isInitializedRef.current = true
      }
    } else if (previousThemeRef.current !== currentTheme) {
      // Theme change - animate to new values
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
        intensity={1} // Default intensity, will be set by animation
        color="#ffffff" // Default white color, will be set by animation
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-normalBias={0.05}
      />
      
      {/* Ambient Light */}
      <ambientLight
        ref={ambientLightRef}
        intensity={1} // Default intensity, will be set by animation
        color="#ffffff" // Default white color, will be set by animation
      />
    </>
  )
})

LightingSystem.displayName = 'LightingSystem'

export default LightingSystem
