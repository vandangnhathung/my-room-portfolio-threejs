'use client'

import { useRoomData } from "@/hooks/use-room-data"
import { useDebounceKeydown } from "@/hooks/use-debounce-keydown"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense, useRef } from "react"
import * as React from "react"
import { useMediaQuery } from "react-responsive"
import * as THREE from "three" // Add this import
import { RenderStaticMeshes } from "./RenderMesh/RenderStaticMeshes"
import { RenderInteractiveMeshes } from "./RenderMesh/RenderInteractiveMeshes"
import { OptimizedIframeScreen } from "./OptimizedIframeScreen"
import PointCursor from "./PointCursor/PointCursor"
import { TOUCH } from 'three' // Add this import
import { useCameraStore } from '@/stores/useCameraStore'
import { useThree } from "@react-three/fiber"

// Loading fallback component
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
)

// Error boundary for render components
const RenderComponents = ({
  focusOnScreen, 
  onMeshRef
}: {
  focusOnScreen: () => void, 
  onMeshRef: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void
}) => {
  try {
    return (
      <>
        <RenderInteractiveMeshes onMeshRef={onMeshRef} />
        <RenderStaticMeshes />
        <PointCursor handleClick={focusOnScreen} />
        {/* <RenderAnimatedMeshes /> */}
      </>
    )
  } catch (error) {
    console.error("Error rendering mesh components:", error)
    return <LoadingFallback />
  }
}

export function MyRoom() {
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
  
  const meshRefs = useRef<Map<string, React.RefObject<THREE.Mesh | null>>>(new Map())
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { camera } = useThree()

  const { 
    isCameraFocused, 
    focusOnScreen, 
    focusOnScreen001, 
    resetCamera 
  } = useCameraStore()

  const handleMeshRef = (name: string, ref: React.RefObject<THREE.Mesh | null>) => {
    meshRefs.current.set(name, ref)
  }

  // Debounced keydown handler
  const { handleKeyDown: debouncedKeyDown, isDebouncing } = useDebounceKeydown({
    delay: 500, // 500ms debounce delay to allow camera transitions to complete
    onKeyDown: (event: KeyboardEvent) => {
      if (event.code === "Escape" && isCameraFocused) {
        resetCamera(orbitControlsRef, camera, isMobile, meshRefs)
      }
      
      // Add keyboard shortcuts for manual logging
      // if (event.code === "KeyL" && event.ctrlKey) {
      //   logCurrentValues()
      // }
      // if (event.code === "KeyC" && event.ctrlKey) {
      //   logCameraPosition()
      // }
      // if (event.code === "KeyT" && event.ctrlKey) {
      //   logOrbitTarget()
      // }
    }
  })

  // Handle ESC key to reset camera with debouncing
  React.useEffect(() => {
    window.addEventListener("keydown", debouncedKeyDown)
    return () => window.removeEventListener("keydown", debouncedKeyDown)
  }, [debouncedKeyDown])

  // Pass the ref and camera focus functions
  const { roomConfig, isLoading, hasError } = useRoomData(
    orbitControlsRef, 
    () => focusOnScreen(orbitControlsRef, camera, isMobile, meshRefs),
    () => focusOnScreen001(orbitControlsRef, camera, isMobile)
  )

  // Handle ESC key to reset camera
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape" && isCameraFocused) {
        resetCamera(orbitControlsRef, camera, isMobile, meshRefs)
      }
      
      // Add keyboard shortcuts for manual logging
      // if (event.code === "KeyL" && event.ctrlKey) {
      //   logCurrentValues()
      // }
      // if (event.code === "KeyC" && event.ctrlKey) {
      //   logCameraPosition()
      // }
      // if (event.code === "KeyT" && event.ctrlKey) {
      //   logOrbitTarget()
      // }
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
        enablePan={isMobile} // Enable panning on mobile
        enableRotate={!isCameraFocused && !isDebouncing}
        enableZoom={true}
        enableDamping={true}
        dampingFactor={0.1}
        // Mobile-specific configurations
        touches={{
          ONE: TOUCH.ROTATE,
          TWO: TOUCH.DOLLY_PAN
        }}
        // Optional: Adjust sensitivity for mobile
        rotateSpeed={isMobile ? 0.5 : 1.0}
        zoomSpeed={isMobile ? 0.5 : 1.0}
        panSpeed={isMobile ? 0.5 : 1.0}
      />
      <group dispose={null}>
        <group name="Scene">
          <RenderComponents 
            focusOnScreen={() => focusOnScreen(orbitControlsRef, camera, isMobile, meshRefs)}
            onMeshRef={handleMeshRef}
          />
          {/* Optimized iframe with conditional rendering */}
          <OptimizedIframeScreen 
            src="https://vandangnhathung.github.io/lofi-ver-2/"
            position={[5.287, 6.189, -0.05]}
            rotation={[192 * (Math.PI / 180), 73 * (Math.PI / 180), -11.5 * (Math.PI / 180)]}
            onLoad={() => console.log('Lofi website loaded successfully!')}
          />
        </group>
        {/* Axes Helper at iframe position */}
        <group position={[5.267, 6.165, -0.079]}
      rotation={[192 * (Math.PI / 180), 75 * (Math.PI / 180), -12 * (Math.PI / 180)]} // Adjust rotation if needed
      >
          {/* <primitive object={new AxesHelper(2)} /> */}
        </group>
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Room_Portfolio.glb')