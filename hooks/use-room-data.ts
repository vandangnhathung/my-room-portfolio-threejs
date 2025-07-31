import { useQuery } from '@tanstack/react-query'
import { MeshConfig } from "@/types/type"
import { meshConfig } from "@/utils/mesh.config"
import { RefObject } from 'react'

const QUERY_KEYS = {
  MESH_CONFIGS: ['meshConfigs'],
  MATERIALS: ['materials'],
  ROOM_DATA: ['roomData'],
} as const

const createMeshClickHandlers = (
  orbitControlsRef: RefObject<{ target: { x: number; y: number; z: number } } | null>,
  meshName: string,
  focusOnScreen?: () => void
) => {
  const handlers: Record<string, () => void> = {
    'Executive_office_chair_raycaster001': () => {
      console.log('Chair clicked! You can add more interaction here.')
    },
    'Executive_office_chair_raycaster': () => {
      console.log('Executive chair clicked! You can add more interaction here.')
    },
    'inside_screen_popup': () => {
      // Now we get the CURRENT target value, not the stale one
      const currentTarget = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }
      console.log('Screen clicked! orbitControlsTarget...', currentTarget)
      
      if (focusOnScreen) focusOnScreen()
    },
    'inside_screen001_popup': () => {
      const currentTarget = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }
      console.log('Screen001 clicked!', currentTarget)
      
      // Removed focusOnScreen001 as per edit hint
    }
  }
  
  return handlers[meshName] || (() => {})
}

const processMeshConfigs = async (
  orbitControlsRef: RefObject<{ target: { x: number; y: number; z: number } } | null>,
  focusOnScreen?: () => void
): Promise<MeshConfig[]> => {
  // Remove artificial delay for faster loading
  const processedConfigs = meshConfig.map((config: MeshConfig) => ({
    ...config,
    onClick: createMeshClickHandlers(orbitControlsRef, config.name, focusOnScreen)
  }))
  return processedConfigs
}

const loadMaterialTextures = async () => ({
  wood: '/textures/room/wood.webp',
  fixedObject: '/textures/room/FixedObjectSet.webp',
  raycasterObject: '/textures/room/RaycasterObjectSet.webp',
  plant: '/textures/room/Plant.jpg',
  devicesOnTable: '/textures/room/devices_on_table.jpg',
  world: '/textures/room/World.webp'
})

const getRoomConfiguration = async () => ({
  modelPath: '/models/Room_Portfolio.glb',
  cameraConfig: {
    target: [4.149959777666874, 7.647045028235788, 1.2788151669711065] as [number, number, number],
    minDistance: 4,
    maxDistance: 38,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI / 2,
    minAzimuthAngle: Math.PI * -1,
    maxAzimuthAngle: Math.PI * -1 / 2,
  }
})

export const useRoomData = (
  orbitControlsRef: RefObject<{ target: { x: number; y: number; z: number } } | null>,
  focusOnScreen?: () => void
) => {
  const meshConfigsQuery = useQuery({
    queryKey: QUERY_KEYS.MESH_CONFIGS,
    queryFn: () => processMeshConfigs(orbitControlsRef, focusOnScreen),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })

  const materialPathsQuery = useQuery({
    queryKey: QUERY_KEYS.MATERIALS,
    queryFn: loadMaterialTextures,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const roomConfigQuery = useQuery({
    queryKey: QUERY_KEYS.ROOM_DATA,
    queryFn: getRoomConfiguration,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
  })

  return {
    meshConfigs: meshConfigsQuery.data || [],
    materialPaths: materialPathsQuery.data,
    roomConfig: roomConfigQuery.data,
    isLoading: meshConfigsQuery.isLoading || materialPathsQuery.isLoading || roomConfigQuery.isLoading,
    hasError: meshConfigsQuery.error || materialPathsQuery.error || roomConfigQuery.error
  }
}