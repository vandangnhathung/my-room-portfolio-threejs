import { useQuery } from '@tanstack/react-query'
import { MeshConfig } from "@/types/type"
import { meshConfig } from "@/utils/mesh.config"

const QUERY_KEYS = {
  MESH_CONFIGS: ['meshConfigs'],
  MATERIALS: ['materials'],
  ROOM_DATA: ['roomData'],
} as const

const createMeshClickHandlers = (meshName: string) => {
  const handlers: Record<string, () => void> = {
    'Executive_office_chair_raycaster': () => {
      console.log('Chair clicked! You can add more interaction here.')
    },
    'inside_screen_popup': () => {
      console.log('Screen clicked! Opening popup...')
      if (typeof window !== 'undefined' && window.EasyPopup) {
        const popup = window.EasyPopup.get('screen-popup')
        if (popup) popup.open()
      }
    },
    'inside_screen001_popup': () => {
      console.log('Screen001 clicked! Opening popup...')
      if (typeof window !== 'undefined' && window.EasyPopup) {
        const popup = window.EasyPopup.get('screen001-popup')
        if (popup) popup.open()
      }
    }
  }
  
  return handlers[meshName] || (() => {})
}

const processMeshConfigs = async (): Promise<MeshConfig[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const processedConfigs = meshConfig.map((config: MeshConfig) => ({
        ...config,
        onClick: createMeshClickHandlers(config.name)
      }))
      resolve(processedConfigs)
    }, 0)
  })
}

const loadMaterialTextures = async () => ({
  wood: '/textures/room/wood.png',
  fixedObject: '/textures/room/FixedObjectSet.png',
  raycasterObject: '/textures/room/RaycasterObjectSet.png',
  plant: '/textures/room/Plant.png'
})

const getRoomConfiguration = async () => ({
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
})

export const useRoomData = () => {
  const meshConfigsQuery = useQuery({
    queryKey: QUERY_KEYS.MESH_CONFIGS,
    queryFn: processMeshConfigs,
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