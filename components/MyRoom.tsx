'use client'

import { useEasyPopup } from "@/hooks/use-easy-popup"
import { useRoomData } from "@/hooks/use-room-data"
import { useCameraFocus } from "@/hooks/use-camera-focus"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense, useRef } from "react"
import * as React from "react"
import { useMediaQuery } from "react-responsive"
import RenderAnimatedMeshes from "./RenderMesh/RenderAnimatedMeshes"
import { RenderStaticMeshes } from "./RenderMesh/RenderStaticMeshes"
import { RenderInteractiveMeshes } from "./RenderMesh/RenderInteractiveMeshes"

// Loading fallback component
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
)

// Error boundary for render components
const RenderComponents = () => {
  try {
    return (
      <>
        <RenderInteractiveMeshes />
        <RenderStaticMeshes />
        <RenderAnimatedMeshes />
      </>
    )
  } catch (error) {
    console.error("Error rendering mesh components:", error)
    return <LoadingFallback />
  }
}

export function MyRoom() {
  const orbitControlsRef = useRef<{ target: { x: number; y: number; z: number } }>(null)
  const isMobile = useMediaQuery({ maxWidth: 768 })
  
  // Initialize EasyPopup 
  useEasyPopup()

  // Camera focus functionality
  const { isCameraFocused, focusOnScreen, focusOnCertificate, resetCamera } = useCameraFocus(
    orbitControlsRef, 
    isMobile
  )

  // Pass the ref and camera focus functions
  const { roomConfig, isLoading, hasError } = useRoomData(
    orbitControlsRef, 
    focusOnScreen, 
    focusOnCertificate
  )

  // Handle ESC key to reset camera
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && isCameraFocused) {
        resetCamera()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCameraFocused, resetCamera])

  if (hasError) {
    console.error("Error loading room data:", hasError)
  }

  if (isLoading || !roomConfig) {
    return <LoadingFallback />
  }

  console.log('Current target:', orbitControlsRef.current?.target)

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitControls 
        ref={orbitControlsRef as any}
        target={roomConfig.cameraConfig.target}
        minDistance={roomConfig.cameraConfig.minDistance}
        maxDistance={roomConfig.cameraConfig.maxDistance}
        minPolarAngle={roomConfig.cameraConfig.minPolarAngle}
        maxPolarAngle={roomConfig.cameraConfig.maxPolarAngle}
        minAzimuthAngle={roomConfig.cameraConfig.minAzimuthAngle}
        maxAzimuthAngle={roomConfig.cameraConfig.maxAzimuthAngle}
        enablePan={false}
        enableRotate={!isCameraFocused}
      />
      <group dispose={null}>
        <group name="Scene">
          <RenderComponents />
        </group>
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Room_Portfolio.glb')