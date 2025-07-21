// ===== FILE: components/MyRoom.tsx (KEEP YOUR EXISTING CODE + ADD PROPS) =====
'use client'

import { useEasyPopup } from "@/hooks/use-easy-popup"
import { useRoomData } from "@/hooks/use-room-data"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Suspense } from "react"
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
  
  // Initialize EasyPopup
  useEasyPopup()

  // Data fetching with error handling
  const { roomConfig, isLoading, hasError } = useRoomData()

  if (hasError) {
    console.error("Error loading room data:", hasError)
  }

  if (isLoading || !roomConfig) {
    return <LoadingFallback />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrbitControls 
        makeDefault 
        target={roomConfig.cameraConfig.target}
        minDistance={roomConfig.cameraConfig.minDistance}
        maxDistance={roomConfig.cameraConfig.maxDistance}
        minPolarAngle={roomConfig.cameraConfig.minPolarAngle}
        maxPolarAngle={roomConfig.cameraConfig.maxPolarAngle}
        minAzimuthAngle={roomConfig.cameraConfig.minAzimuthAngle}
        maxAzimuthAngle={roomConfig.cameraConfig.maxAzimuthAngle}
        enablePan={false}
      />
      <group dispose={null}>
        <group name="Scene">
          <RenderComponents />
        </group>
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Room_ver2-v1 (2).glb')