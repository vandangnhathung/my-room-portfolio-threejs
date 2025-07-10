// In your components/MyRoom.tsx file, make these changes:

'use client'

import { useQuery } from '@tanstack/react-query'
import { useHoverState } from "@/hooks/use-hover-state"
import { useOptimizedTexture } from "@/hooks/use-optimized-texture"
import * as THREE from "three"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { InteractiveMeshWrapper } from "@/components/mesh/InteractiveMesh"
import { StaticMesh } from "@/components/mesh/StaticMesh"
import { meshConfig } from "@/utils/mesh.config"
import { GLTFResult, MeshConfig } from "@/types/type"
import { useMemo, useCallback, Suspense, useEffect } from "react"

// Query keys for TanStack Query
const QUERY_KEYS = {
  MESH_CONFIGS: ['meshConfigs'],
  MATERIALS: ['materials'],
  ROOM_DATA: ['roomData'],
} as const

// EasyPopup types are declared in PopupManager.tsx

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

// Rest of your existing code stays exactly the same...
const processMeshConfigs = async (): Promise<MeshConfig[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processedConfigs = meshConfig.map((config: MeshConfig) => ({
        ...config,
        isInteractive: config.name.includes('raycaster')
      }))
      resolve(enhancedMeshConfig(processedConfigs))
    }, 0)
  })
}

const loadMaterialTextures = async () => {
  return {
    wood: '/textures/room/wood.png',
    fixedObject: '/textures/room/FixedObjectSet.png',
    raycasterObject: '/textures/room/RaycasterObjectSet.jpg',
    plant: '/textures/room/Plant.png'
  }
}

const getRoomConfiguration = async () => {
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

const RoomLoader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="gray" />
  </mesh>
)

export function MyRoom(props: React.JSX.IntrinsicElements['group']) {
  const { hoveredMesh, createHoverHandlers } = useHoverState()

  // ADD THIS: Initialize Easy Popup when component mounts (client-side only)
  useEffect(() => {
    // Dynamic import only on client side
    const loadEasyPopup = async () => {
      if (typeof window !== 'undefined') {
        try {
          await import("@viivue/easy-popup")
          
          setTimeout(() => {
            if (window.EasyPopup) {
              try {
                window.EasyPopup.init('[data-easy-popup]')
                console.log('Easy Popup initialized successfully')
              } catch (error) {
                console.log('Easy Popup already initialized or error:', error)
              }
            }
          }, 100)
        } catch (error) {
          console.error('Failed to load Easy Popup:', error)
        }
      }
    }
    
    loadEasyPopup()
  }, [])

  // All your existing TanStack Query code stays the same...
  const {
    data: meshConfigs = [],
    isLoading: meshConfigsLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.MESH_CONFIGS,
    queryFn: processMeshConfigs,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  const {
    data: materialPaths,
    isLoading: materialPathsLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.MATERIALS,
    queryFn: loadMaterialTextures,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const {
    data: roomConfig,
    isLoading: roomConfigLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.ROOM_DATA,
    queryFn: getRoomConfiguration,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  })

  // Rest of your component code stays exactly the same...
  const { nodes } = useGLTF(roomConfig?.modelPath || '/models/Room_ver2-v1 (2).glb') as unknown as GLTFResult

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

  const getMaterial = useCallback((meshName: string): THREE.Material => {
    if (meshName === 'floor') return woodMaterial
    if (meshName === 'Room') return fixedObjectMaterial
    if (meshName === 'plant') return plantMaterial
    return raycasterObjectMaterial
  }, [woodMaterial, fixedObjectMaterial, plantMaterial, raycasterObjectMaterial])

  const { interactiveMeshConfigs, staticMeshConfigs } = useMemo(() => {
    const interactive = meshConfigs.filter(config => config.isInteractive)
    const staticMeshConfigs = meshConfigs.filter(config => !config.isInteractive)
    return { interactiveMeshConfigs: interactive, staticMeshConfigs: staticMeshConfigs }
  }, [meshConfigs])

  if (meshConfigsLoading || materialPathsLoading || roomConfigLoading) {
    return <RoomLoader />
  }

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

useGLTF.preload('/models/Room_ver2-v1 (2).glb')

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