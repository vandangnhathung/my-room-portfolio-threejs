'use client'

import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { TOUCH } from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Scene from "./Scene";
import { useCameraStore } from '../stores/useCameraStore'
import { useDebounceKeydown } from '../hooks/use-debounce-keydown'
import { useMediaQuery } from "react-responsive"
import { useRoomData } from '../hooks/use-room-data'
import * as React from "react"

export const Experience: React.FC = () => {
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
          enableRotate={!isCameraFocused && !isDebouncing}
          enableZoom={true}
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
        
        <Scene orbitControlsRef={orbitControlsRef} />
      </Suspense>
    </>
  );
};