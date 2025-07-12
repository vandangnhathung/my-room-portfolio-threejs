// ===== FILE: components/MyRoom.tsx (KEEP YOUR EXISTING CODE + ADD PROPS) =====
'use client'

import { useHoverState } from "@/hooks/hovering/use-hover-state"
import { useRoomMaterials } from "@/hooks/use-room-materials"
import { useVideoMaterials } from "@/hooks/videos/use-video-materials"
import { useEasyPopup } from "@/hooks/use-easy-popup"
import { useRoomData } from "@/hooks/use-room-data"
import * as THREE from "three"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { InteractiveMeshWrapper } from "@/components/mesh/InteractiveMesh"
import { StaticMesh } from "@/components/mesh/StaticMesh"
import { GLTFResult } from "@/types/type"
import { useMemo, useCallback, Suspense } from "react"
import { ThreeEvent } from '@react-three/fiber'
import { useLoadingManagerContext } from '@/components/LoadingSystem'

// Types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

interface MyRoomProps {
  hoveredMesh?: string | null
  createHoverHandlers?: (meshName: string) => HoverHandlers
}

const RoomLoader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
)

export function MyRoom(props: MyRoomProps) {
  const manager = useLoadingManagerContext()
  
  // Hover state management
  const localHoverState = useHoverState()
  const hoveredMesh = props.hoveredMesh ?? localHoverState.hoveredMesh
  const createHoverHandlers = props.createHoverHandlers ?? localHoverState.createHoverHandlers

  // Initialize EasyPopup
  useEasyPopup()

  // Data fetching
  const { meshConfigs, materialPaths, roomConfig, isLoading } = useRoomData()

  // 3D model loading
  const { nodes } = useGLTF(
    roomConfig?.modelPath || '/models/Room_ver2-v1 (2).glb',
    false, // draco
    false, // ktx2
    (loader) => {
      loader.manager = manager
    }
  ) as unknown as GLTFResult

  // Materials
  const { woodMaterial, fixedObjectMaterial, raycasterObjectMaterial, plantMaterial } = useRoomMaterials(materialPaths || {})
  const { screenVideoMaterial, screen001VideoMaterial } = useVideoMaterials()

  // Material assignment
  const getMaterial = useCallback((meshName: string): THREE.Material => {
    const materialMap: Record<string, THREE.Material> = {
      'floor': woodMaterial,
      'Room': fixedObjectMaterial,
      'plant': plantMaterial,
      'inside_screen_popup': screenVideoMaterial || raycasterObjectMaterial,
      'inside_screen001_popup': screen001VideoMaterial || raycasterObjectMaterial
    }
    
    return materialMap[meshName] || raycasterObjectMaterial
  }, [woodMaterial, fixedObjectMaterial, plantMaterial, raycasterObjectMaterial, screenVideoMaterial, screen001VideoMaterial])

  // Mesh configuration
  const { interactiveMeshConfigs, staticMeshConfigs } = useMemo(() => {
    const interactive = meshConfigs.filter(config => config.isInteractive)
    const staticMeshes = meshConfigs.filter(config => !config.isInteractive)
    return { interactiveMeshConfigs: interactive, staticMeshConfigs: staticMeshes }
  }, [meshConfigs])

  // Loading state
  if (isLoading) {
    return <RoomLoader />
  }

  // Render functions
  const renderInteractiveMeshes = () => {
    return interactiveMeshConfigs.map((config) => (
      <InteractiveMeshWrapper
        key={`interactive-${config.name}`}
        config={config}
        nodes={nodes}
        getMaterial={getMaterial}
        hoveredMesh={hoveredMesh}
        createHoverHandlers={createHoverHandlers}
      />
    ))
  }

  const renderStaticMeshes = () => {
    if (!nodes) return null

    return staticMeshConfigs.map((config) => {
      const geometry = nodes[config.name as keyof typeof nodes]?.geometry
      if (!geometry) return null

      return (
        <StaticMesh
          key={`static-${config.name}`}
          config={config}
          nodes={nodes}
          getMaterial={getMaterial}
        />
      )
    })
  }

  return (
    <Suspense fallback={<RoomLoader />}>
      <OrbitControls 
        makeDefault 
        target={roomConfig?.cameraConfig.target}
        minDistance={roomConfig?.cameraConfig.minDistance}
        maxDistance={roomConfig?.cameraConfig.maxDistance}
        minPolarAngle={roomConfig?.cameraConfig.minPolarAngle}
        maxPolarAngle={roomConfig?.cameraConfig.maxPolarAngle}
        minAzimuthAngle={roomConfig?.cameraConfig.minAzimuthAngle}
        maxAzimuthAngle={roomConfig?.cameraConfig.maxAzimuthAngle}
        enablePan={false}
      />
      <group dispose={null}>
        <group name="Scene">
          {renderInteractiveMeshes()}
          {renderStaticMeshes()}
        </group>
      </group>
    </Suspense>
  )
}

useGLTF.preload('/models/Room_ver2-v1 (2).glb')