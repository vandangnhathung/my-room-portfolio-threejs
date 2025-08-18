'use client'

import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { TOUCH } from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Scene from "./Scene";
import { useCameraStore } from '../stores/useCameraStore'
import { useDebounceKeydown } from '../hooks/use-debounce-keydown'
import { useMediaQuery } from "react-responsive"
import { useRoomData } from '../hooks/use-room-data'
import { useSetPointer } from '../stores/usePointerStore'
import { useSimpleResponsive } from '../hooks/use-simple-responsive'
import * as React from "react"

const ExperienceComponent: React.FC = () => {
  const orbitControlsRef = useRef<{
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  }>(null)
  
  const isMobile = useMediaQuery({ maxWidth: 768 })

  const { 
    isCameraFocused, 
    resetCamera 
  } = useCameraStore()

  // Get stable pointer action from store
  const setPointer = useSetPointer()

  // Add simple responsive camera behavior
  useSimpleResponsive()

  // Debounced keydown handler
  const { handleKeyDown: debouncedKeyDown, isDebouncing } = useDebounceKeydown({
    delay: 500,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.code === "Escape" && isCameraFocused) {
        resetCamera(true)
      }
    }
  })

  // Handle ESC key to reset camera with debouncing
  React.useEffect(() => {
    window.addEventListener("keydown", debouncedKeyDown)
    return () => window.removeEventListener("keydown", debouncedKeyDown)
  }, [debouncedKeyDown])

  // Get room config from MyRoom
  const { roomConfig } = useRoomData(
    orbitControlsRef, 
    () => {} // Empty function since we don't need focusOnScreen here
  )

  const disablePointerRef = useRef<(() => void) | null>(null)
  
  // Simple pointer move handler - back to original working version
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      // Use optimized store setter
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      setPointer(x, y)
    }
    window.addEventListener('pointermove', onPointerMove)
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [setPointer])

  return (
    <>
      <Suspense fallback={null}>
        <color attach="background" args={['#000000']} />

        <Environment 
            preset="apartment" 
            blur={0.8} 
            environmentIntensity={1.3}
            background={false}
        />
          
        <OrbitControls 
          ref={orbitControlsRef as React.RefObject<OrbitControlsImpl>}
          target={roomConfig?.cameraConfig.target}
          minDistance={roomConfig?.cameraConfig.minDistance}
          maxDistance={roomConfig?.cameraConfig.maxDistance}
          minPolarAngle={roomConfig?.cameraConfig.minPolarAngle}
          maxPolarAngle={roomConfig?.cameraConfig.maxPolarAngle}
          minAzimuthAngle={roomConfig?.cameraConfig.minAzimuthAngle}
          maxAzimuthAngle={roomConfig?.cameraConfig.maxAzimuthAngle}
          enablePan={isMobile}
          enableRotate={isMobile && !isCameraFocused && !isDebouncing} // Only enable on mobile
          enableZoom={isMobile} // Only enable on mobile
          enableDamping={true}
          dampingFactor={0.1}
          touches={{
            ONE: TOUCH.ROTATE,
            TWO: TOUCH.DOLLY_PAN
          }}
          rotateSpeed={isMobile ? 0.5 : 1.0}
          zoomSpeed={isMobile ? 0.5 : 1.0}
          panSpeed={isMobile ? 0.5 : 1.0}
        />
        
        <Scene orbitControlsRef={orbitControlsRef} disablePointerRef={disablePointerRef} />
      </Suspense>
    </>
  );
};

export const Experience = React.memo(ExperienceComponent)