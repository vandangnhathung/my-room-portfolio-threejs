'use client'

import { OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useEffect, useMemo } from "react";
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
  
  // iOS detection utility
  const isIOSDevice = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  }, [])

  // iOS-optimized pointer and touch move handler with canvas-relative coordinates
  useEffect(() => {
    const getCanvasRelativeCoordinates = (clientX: number, clientY: number) => {
      const canvas = document.querySelector('canvas')
      if (!canvas) return { x: 0, y: 0 }
      
      const rect = canvas.getBoundingClientRect()
      
      // Calculate canvas-relative coordinates (CRITICAL for iOS)
      const x = ((clientX - rect.left) / rect.width) * 2 - 1
      const y = -((clientY - rect.top) / rect.height) * 2 + 1
      
      return { x, y }
    }

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = getCanvasRelativeCoordinates(e.clientX, e.clientY)
      setPointer(x, y)
    }

    // iOS-specific touch event handling
    const onTouchMove = (e: TouchEvent) => {
      if (isIOSDevice) {
        e.preventDefault() // Prevent scrolling on iOS
      }
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const { x, y } = getCanvasRelativeCoordinates(touch.clientX, touch.clientY)
        setPointer(x, y)
      }
    }

    // Add both pointer and touch events for maximum compatibility
    window.addEventListener('pointermove', onPointerMove)
    
    // Only add touch events on iOS devices for better performance
    if (isIOSDevice) {
      window.addEventListener('touchmove', onTouchMove, { passive: false })
    }
    
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (isIOSDevice) {
        window.removeEventListener('touchmove', onTouchMove)
      }
    }
  }, [setPointer])

  return (
    <>
      <Suspense fallback={null}>
        <color attach="background" args={['#000000']} />

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