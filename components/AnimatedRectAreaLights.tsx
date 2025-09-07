import { useToggleThemeStore } from "@/stores/toggleTheme"
import React, { useRef, useEffect, useCallback } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { useFrame } from "@react-three/fiber"

interface AnimatedRectAreaLightsProps {
  onLightsOff?: () => void
}

// Animated RectAreaLight component with ordered animation
const AnimatedRectAreaLights: React.FC<AnimatedRectAreaLightsProps> = React.memo(({ onLightsOff }) => {
  const { currentTheme } = useToggleThemeStore()
  const light1Ref = useRef<THREE.RectAreaLight>(null)
  const light2Ref = useRef<THREE.RectAreaLight>(null)
  const light3Ref = useRef<THREE.PointLight>(null)
  const previousThemeRef = useRef(currentTheme)

  // Helper refs
  const helper3Ref = useRef<THREE.PointLightHelper>(null)

  // Add a target ref
  const targetRef = useRef<THREE.Object3D>(null)

  // Callback to notify when lights are fully off
  const handleLightsOff = useCallback(() => {
    if (onLightsOff) {
      onLightsOff()
    }
  }, [onLightsOff])

  // Update helpers when lights change
  // useEffect(() => {
  //   if (helper3Ref.current && light3Ref.current) {
  //     helper3Ref.current.update()
  //   }
  // }, [currentTheme])

  // // Add useFrame to continuously update the helper
  // useFrame(() => {
  //   if (helper3Ref.current && light3Ref.current) {
  //     helper3Ref.current.update()
  //   }
  // })

  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      if (currentTheme === 'dark') {
        // Animate lights in order when switching to dark
        const timeline = gsap.timeline({delay:0.8})
        
        // First light (screen area)
        timeline.to(light1Ref.current, {
          intensity: 10,
          duration: 0.8,
          ease: "power2.out"
        })
        
        // Second light (window area) with delay
        timeline.to(light2Ref.current, {
          intensity: 10,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.4") // Start 0.4s before first light finishes

        timeline.to(light3Ref.current, {
          intensity: 2,
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
        .to(light3Ref.current, {
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
      <pointLight
        ref={light2Ref}
        position={[3.23, 9.789, -8.33]}
        rotation={[0, 0, 0]}
        intensity={currentTheme === 'dark' ? 0 : 0} // Start at 0, will be animated
        color="#f5ca92"
        decay={1}
      />


      <spotLight
        ref={light3Ref}
        castShadow
        target={targetRef.current || undefined}
        angle={Math.PI * 0.3}
        position={[-0.505, 8, 3.918]} 
        decay={1}
        penumbra={0.25} 
        intensity={0} 
        distance={100} 
      />

      {/* Target object for spot light */}
      <object3D ref={targetRef} position={[-0.505, 5.016, 3.918]} />
      
      {/* {light3Ref.current && (
        <primitive 
          ref={helper3Ref}
          object={new THREE.SpotLightHelper(light3Ref.current)}
        />
      )} */}
    </>
  )
})

AnimatedRectAreaLights.displayName = 'AnimatedRectAreaLights'

export default AnimatedRectAreaLights