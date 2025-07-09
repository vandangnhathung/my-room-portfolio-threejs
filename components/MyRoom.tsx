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
import { useMemo, useCallback, Suspense, useEffect } from "react"
// Import Easy Popup from npm package
import "@viivue/easy-popup"

// Query keys for TanStack Query
const QUERY_KEYS = {
  MESH_CONFIGS: ['meshConfigs'],
  MATERIALS: ['materials'],
  ROOM_DATA: ['roomData'],
} as const

// Declare EasyPopup global type for TypeScript
declare global {
  interface Window {
    EasyPopup: {
      init: (selector: string, options?: any) => void;
      get: (id: string) => {
        open: () => void;
        close: () => void;
        toggle: () => void;
      };
    };
  }
}

// Updated mesh config to ensure screens have proper click handlers
const enhancedMeshConfig = (originalConfig: MeshConfig[]): MeshConfig[] => {
  return originalConfig.map(config => {
    // Special handling for the executive chair
    if (config.name === 'Executive_office_chair_raycaster') {
      return {
        ...config,
        // Ensure the chair has an onClick handler for interaction
        onClick: () => {
          console.log('Chair clicked! You can add more interaction here.')
        }
      }
    }
    
    // Handle screen raycaster objects
    if (config.name === 'screen_raycaster') {
      return {
        ...config,
        onClick: () => {
          console.log('Screen clicked! Opening popup...')
          // Check if EasyPopup is available
          if (typeof window !== 'undefined' && window.EasyPopup) {
            const popup = window.EasyPopup.get('screen-popup')
            if (popup) {
              popup.open()
            }
          }
        }
      }
    }
    
    if (config.name === 'screen001_raycaster') {
      return {
        ...config,
        onClick: () => {
          console.log('Screen001 clicked! Opening popup...')
          // Check if EasyPopup is available
          if (typeof window !== 'undefined' && window.EasyPopup) {
            const popup = window.EasyPopup.get('screen001-popup')
            if (popup) {
              popup.open()
            }
          }
        }
      }
    }
    
    return config
  })
}

// Data fetchers/processors
const processMeshConfigs = async (): Promise<MeshConfig[]> => {
  // Simulate async processing or actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const processedConfigs = meshConfig.map((config: MeshConfig) => ({
        ...config,
        // Auto-detect interactive meshes based on "raycaster" in name
        isInteractive: config.name.includes('raycaster')
      }))
      resolve(enhancedMeshConfig(processedConfigs))
    }, 0)
  })
}

const loadMaterialTextures = async () => {
  // This could be extended to load textures from API or validate paths
  return {
    wood: '/textures/room/wood.png',
    fixedObject: '/textures/room/FixedObjectSet.png',
    raycasterObject: '/textures/room/RaycasterObjectSet.jpg',
    plant: '/textures/room/Plant.png'
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

  // Initialize Easy Popup when component mounts
  useEffect(() => {
    // Wait for EasyPopup to be available
    const initPopup = () => {
      if (typeof window !== 'undefined' && window.EasyPopup) {
        // Initialize popups if they haven't been initialized yet
        try {
          window.EasyPopup.init('[data-easy-popup]')
          console.log('Easy Popup initialized successfully')
        } catch (error) {
          console.log('Easy Popup already initialized or error:', error)
        }
      } else {
        // Retry after a short delay if EasyPopup isn't loaded yet
        setTimeout(initPopup, 100)
      }
    }
    
    initPopup()
  }, [])

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
    path: materialPaths?.plant || '/textures/room/Plant.png',
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