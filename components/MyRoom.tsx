// ===== FILE: components/MyRoom.tsx (KEEP YOUR EXISTING CODE + ADD PROPS) =====
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
import { ThreeEvent } from '@react-three/fiber'
import { useLoadingManagerContext } from '@/components/LoadingSystem';

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
    raycasterObject: '/textures/room/RaycasterObjectSet.png',
    plant: '/textures/room/Plant.png'
  }
}

const getRoomConfiguration = async () => {
  return {
    modelPath: '/models/Room_ver2-v1 (2).glb',
    cameraConfig: {
      target: [4.149959777666874, 4.647045028235788, 1.2788151669711065] as [number, number, number],
      minDistance: 20,
      maxDistance: 40,
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

// ===== UPDATE the MyRoomProps interface in your MyRoom.tsx =====

// Define proper event handler types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

// ===== ADD INTERFACE FOR PROPS =====
interface MyRoomProps {
  hoveredMesh?: string | null
  createHoverHandlers?: (meshName: string) => HoverHandlers
}

// ===== UPDATE FUNCTION SIGNATURE =====
export function MyRoom(props: MyRoomProps) {
  const manager = useLoadingManagerContext();
  
  // ===== MODIFY THIS LINE TO USE PROPS OR FALLBACK =====
  const localHoverState = useHoverState()
  const hoveredMesh = props.hoveredMesh ?? localHoverState.hoveredMesh
  const createHoverHandlers = props.createHoverHandlers ?? localHoverState.createHoverHandlers

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

  // Use manager with useGLTF
  const { nodes } = useGLTF(
    roomConfig?.modelPath || '/models/Room_ver2-v1 (2).glb',
    false, // draco
    false, // ktx2
    (loader) => {
      // Configure the loader to use our LoadingManager
      loader.manager = manager;
    }
  ) as unknown as GLTFResult;

  // Rest of your component code stays exactly the same...
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
    path: materialPaths?.raycasterObject || '/textures/room/RaycasterObjectSet.png',
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
    // Add safety check for nodes
    if (!nodes) {
      console.warn('Nodes object is not available yet')
      return null
    }

    return staticMeshConfigs.map((config) => {
      const geometry = nodes[config.name as keyof typeof nodes]?.geometry
      
      if (!geometry) {
        console.warn(`Geometry not found for static mesh: ${config.name}`)
        return null
      }

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

  // ===== PASS THROUGH OTHER PROPS TO GROUP =====
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