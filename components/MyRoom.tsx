'use client'

import { useRoomData } from "@/hooks/use-room-data"
import { useGLTF } from "@react-three/drei"
import { Suspense, useRef } from "react"
import * as React from "react"
import { useMediaQuery } from "react-responsive"
import * as THREE from "three"
import { RenderStaticMeshes } from "./RenderMesh/RenderStaticMeshes"
import { RenderInteractiveMeshes } from "./RenderMesh/RenderInteractiveMeshes"
import { OptimizedIframeScreen } from "./OptimizedIframeScreen"
import PointCursor from "./PointCursor/PointCursor"
import { useCameraStore } from '@/stores/useCameraStore'
import { useThree } from "@react-three/fiber"

// Error boundary for render components
const RenderComponents = ({
  focusOnScreen, 
  onMeshRef,
  disablePointerRef
}: {
  focusOnScreen: () => void, 
  onMeshRef: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void,
  disablePointerRef?: React.RefObject<(() => void) | null>
}) => {
  try {
    return (
      <>
        <RenderInteractiveMeshes onMeshRef={onMeshRef} />
        <RenderStaticMeshes />
        <PointCursor 
          handleClick={() => {
            // Disable pointer immediately when clicked
            if (disablePointerRef?.current) {
              disablePointerRef.current()
            }
            focusOnScreen()
          }} 
        />
        {/* <RenderAnimatedMeshes /> */}
      </>
    )
  } catch (error) {
    console.error("Error rendering mesh components:", error)
  }
}

interface MyRoomProps {
  orbitControlsRef: React.RefObject<{ 
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  } | null>
  disablePointerRef?: React.RefObject<(() => void) | null>
}

export function MyRoom({ orbitControlsRef, disablePointerRef }: MyRoomProps) {
  
  const meshRefs = useRef<Map<string, React.RefObject<THREE.Mesh | null>>>(new Map())
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { camera } = useThree()

  const { 
    isCameraFocused, 
    focusOnScreen
  } = useCameraStore()

  const handleMeshRef = (name: string, ref: React.RefObject<THREE.Mesh | null>) => {
    meshRefs.current.set(name, ref)
  }

  // Pass the ref and camera focus functions
  useRoomData(
    orbitControlsRef, 
    () => focusOnScreen(orbitControlsRef, camera, isMobile, meshRefs)
  )

  return (
    <Suspense >
      <group dispose={null}>
        <group name="Scene">
          <RenderComponents 
            focusOnScreen={() => focusOnScreen(orbitControlsRef, camera, isMobile, meshRefs)}
            onMeshRef={handleMeshRef}
            disablePointerRef={disablePointerRef}
          />
          {/* Optimized iframe with immediate loading */}
          <OptimizedIframeScreen 
            src="https://vandangnhathung.github.io/lofi-ver-2/"
            position={[5.287, 6.719, -0.05]}
            rotation={[192 * (Math.PI / 180), 73 * (Math.PI / 180), -11.5 * (Math.PI / 180)]}
            onLoad={() => console.log('Lofi website loaded successfully!')}
            isCameraFocused={isCameraFocused}
          />
        </group>
        {/* Axes Helper at iframe position */}
        <group position={[5.267, 6.165, -0.079]}
          rotation={[192 * (Math.PI / 180), 75 * (Math.PI / 180), -12 * (Math.PI / 180)]}
        >
          {/* <primitive object={new AxesHelper(2)} /> */}
        </group>
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Room_Portfolio.glb')