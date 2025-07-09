'use client'

import { useQuery } from '@tanstack/react-query'
import { useHoverState } from "@/hooks/use-hover-state"
import { useOptimizedTexture } from "@/hooks/use-optimized-texture"
import * as THREE from "three"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { InteractiveMeshWrapper } from "@/components/mesh/InteractiveMesh"
import { StaticMesh } from "@/components/mesh/StaticMesh"
import { meshConfig } from "@/utils/mesh.config"
import { GLTFResult, MeshConfig } from "@/type.d"
import { useMemo, useCallback, Suspense } from "react"

// Query keys for TanStack Query
const QUERY_KEYS = {
  MESH_CONFIGS: ['meshConfigs'],
  MATERIALS: ['materials'],
  ROOM_DATA: ['roomData'],
} as const

// Data fetchers/processors
const processMeshConfigs = async (): Promise<MeshConfig[]> => {
  // Simulate async processing or actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        meshConfig.map((config: MeshConfig) => ({
          ...config,
          // Auto-detect interactive meshes based on "raycaster" in name
          isInteractive: config.name.includes('raycaster')
        }))
      )
    }, 0)
  })
}

const loadMaterialTextures = async () => {
  // This could be extended to load textures from API or validate paths
  return {
    wood: '/textures/room/wood.png',
    fixedObject: '/textures/room/FixedObjectSet.png',
    raycasterObject: '/textures/room/RaycasterObjectSet.jpg',
    plant: '/textures/room/plant.png'
  }
}

const getRoomConfiguration = async () => {
  // This could fetch room configuration from an API
  return {
    modelPath: '/models/Room_ver2-v1 (2).glb',
    cameraConfig: {
      target: [4.149959777666874, 4.647045028235788, 1.2788151669711065] as [number, number, number],
      minDistance: 12,
      maxDistance: 20,
      minPolarAngle: 0,
      maxPolarAngle: Math.PI / 2,
      minAzimuthAngle: Math.PI * -1,
      maxAzimuthAngle: Math.PI * -1 / 2,
    }
  }
}

// Loading component
const RoomLoader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
)

// Error component
// const RoomError = ({ error }: { error: Error }) => (
//   <mesh>
//     <boxGeometry args={[1, 1, 1]} />
//     <meshBasicMaterial color="red" />
//   </mesh>
// )

export function MyRoom(props: React.JSX.IntrinsicElements['group']) {
  const { hoveredMesh, createHoverHandlers } = useHoverState()

  // TanStack Query for mesh configurations
  const {
    data: meshConfigs = [],
    isLoading: meshConfigsLoading,
    // error: meshConfigsError
  } = useQuery({
    queryKey: QUERY_KEYS.MESH_CONFIGS,
    queryFn: processMeshConfigs,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  // TanStack Query for material paths
  const {
    data: materialPaths,
    isLoading: materialPathsLoading,
    // error: materialPathsError
  } = useQuery({
    queryKey: QUERY_KEYS.MATERIALS,
    queryFn: loadMaterialTextures,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })

  // TanStack Query for room configuration
  const {
    data: roomConfig,
    isLoading: roomConfigLoading,
    // error: roomConfigError
  } = useQuery({
    queryKey: QUERY_KEYS.ROOM_DATA,
    queryFn: getRoomConfiguration,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  })

  // Load GLTF model
  const { nodes } = useGLTF(roomConfig?.modelPath || '/models/Room_ver2-v1 (2).glb') as unknown as GLTFResult

  // Materials with conditional loading
  const woodMaterial = useOptimizedTexture({
    path: materialPaths?.wood || '/textures/room/wood.png',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const fixedObjectMaterial = useOptimizedTexture({
    path: materialPaths?.fixedObject || '/textures/room/FixedObjectSet.png',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const raycasterObjectMaterial = useOptimizedTexture({
    path: materialPaths?.raycasterObject || '/textures/room/RaycasterObjectSet.jpg',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const plantMaterial = useOptimizedTexture({
    path: materialPaths?.plant || '/textures/room/plant.png',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  // Get material for mesh - memoized with dependency on materials
  const getMaterial = useCallback((meshName: string): THREE.Material => {
    if (meshName === 'floor') return woodMaterial
    if (meshName === 'Room') return fixedObjectMaterial
    if (meshName === 'plant') return plantMaterial
    return raycasterObjectMaterial
  }, [woodMaterial, fixedObjectMaterial, plantMaterial, raycasterObjectMaterial])

  // Memoized interactive and static mesh configs
  const { interactiveMeshConfigs, staticMeshConfigs } = useMemo(() => {
    const interactive = meshConfigs.filter(config => config.isInteractive)
    const staticMeshConfigs = meshConfigs.filter(config => !config.isInteractive)
    return { interactiveMeshConfigs: interactive, staticMeshConfigs: staticMeshConfigs }
  }, [meshConfigs])

  // Error handling
  // if (meshConfigsError || materialPathsError || roomConfigError) {
  //   console.error('Room loading error:', { meshConfigsError, materialPathsError, roomConfigError })
  //   return <RoomError error={meshConfigsError || materialPathsError || roomConfigError} />
  // }

  // Loading state
  if (meshConfigsLoading || materialPathsLoading || roomConfigLoading) {
    return <RoomLoader />
  }

  // Render interactive meshes
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

  // Render static meshes
  const renderStaticMeshes = () => {
    return staticMeshConfigs.map((config) => {
      const geometry = nodes[config.name as keyof typeof nodes]?.geometry
      const material = getMaterial(config.name)

      if (!geometry) return null

      return (
        <StaticMesh
          key={`static-${config.name}`}
          config={config}
          geometry={geometry}
          material={material}
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
      <group {...props} dispose={null}>
        <group name="Scene">
          {renderInteractiveMeshes()}
          {renderStaticMeshes()}
        </group>
      </group>
    </Suspense>
  )
}

// Preload GLTF
useGLTF.preload('/models/Room_ver2-v1 (2).glb')

// Additional query utilities for external use
export const useRoomQueries = () => {
  const meshConfigsQuery = useQuery({
    queryKey: QUERY_KEYS.MESH_CONFIGS,
    queryFn: processMeshConfigs,
  })

  const materialPathsQuery = useQuery({
    queryKey: QUERY_KEYS.MATERIALS,
    queryFn: loadMaterialTextures,
  })

  const roomConfigQuery = useQuery({
    queryKey: QUERY_KEYS.ROOM_DATA,
    queryFn: getRoomConfiguration,
  })

  return {
    meshConfigsQuery,
    materialPathsQuery,
    roomConfigQuery,
    isLoading: meshConfigsQuery.isLoading || materialPathsQuery.isLoading || roomConfigQuery.isLoading,
    hasError: meshConfigsQuery.error || materialPathsQuery.error || roomConfigQuery.error
  }
}