import { useToggleThemeStore } from "@/stores/toggleTheme"
import React, { useRef, useEffect, useCallback } from "react"
import * as THREE from "three"
import { gsap } from "gsap"

interface AnimatedRectAreaLightsProps {
  onLightsOff?: () => void
}

// Animated RectAreaLight component with ordered animation
const AnimatedRectAreaLights: React.FC<AnimatedRectAreaLightsProps> = React.memo(({ onLightsOff }) => {
  const { currentTheme } = useToggleThemeStore()
  const light1Ref = useRef<THREE.RectAreaLight>(null)
  const light2Ref = useRef<THREE.RectAreaLight>(null)
  const previousThemeRef = useRef(currentTheme)

  // Callback to notify when lights are fully off
  const handleLightsOff = useCallback(() => {
    if (onLightsOff) {
      onLightsOff()
    }
  }, [onLightsOff])

  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      if (currentTheme === 'dark') {
        // Animate lights in order when switching to dark
        const timeline = gsap.timeline()
        
        // First light (screen area)
        timeline.to(light1Ref.current, {
          intensity: 2,
          duration: 0.8,
          ease: "power2.out"
        })
        
        // Second light (window area) with delay
        timeline.to(light2Ref.current, {
          intensity: 6,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.4") // Start 0.4s before first light finishes
        
      } else {
        // Turn off lights when switching to light theme - FIRST
        const timeline = gsap.timeline({
          onComplete: handleLightsOff // Notify when lights are fully off
        })
        
        // Turn off both lights simultaneously but with slight stagger
        timeline.to(light1Ref.current, {
          intensity: 0,
          duration: 0.6,
          ease: "power2.in"
        })
        .to(light2Ref.current, {
          intensity: 0,
          duration: 0.6,
          ease: "power2.in"
        }, "-=0.3") // Start 0.3s before first light finishes
      }
      
      previousThemeRef.current = currentTheme
    }
  }, [currentTheme, handleLightsOff])

  return (
    <>
      {/* First RectAreaLight - Screen area */}
      <rectAreaLight
        ref={light1Ref}
        position={[5.699, 6.165, -0.1]}
        rotation={[192 * (Math.PI / 180), 75 * (Math.PI / 180), -12 * (Math.PI / 180)]}
        width={5}
        height={1}
        intensity={currentTheme === 'dark' ? 0 : 0} // Start at 0, will be animated
        color="#ffffff"
      />

      {/* Second RectAreaLight - Window area */}
      <rectAreaLight
        ref={light2Ref}
        position={[7.23, 9.789, -8.33]}
        rotation={[0, 0, 0]}
        width={3}
        height={8}
        intensity={currentTheme === 'dark' ? 0 : 0} // Start at 0, will be animated
        color="#f5ca92"
      />
    </>
  )
})

AnimatedRectAreaLights.displayName = 'AnimatedRectAreaLights'

export default AnimatedRectAreaLights