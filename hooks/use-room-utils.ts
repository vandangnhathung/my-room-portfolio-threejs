import { useRoomData } from './use-room-data'
import { useRoomMaterials } from './use-room-materials'
import { useVideoMaterials } from "@/hooks/videos/use-video-materials"
import { useLoadingTexture } from "@/hooks/use-loading-texture"
import * as THREE from "three"
import { useCallback, useMemo } from "react"
import { GLTFResult } from "@/types/type"
import { useGLTF } from "@react-three/drei"
import { useLoadingManagerContext } from "@/components/LoadingSystem"

export const useRoomUtils = (
  orbitControlsRef: React.RefObject<{ 
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  } | null>,
  focusOnScreen: () => void
) => {
  const { meshConfigs, materialPaths, roomConfig, isLoading } = useRoomData(orbitControlsRef, focusOnScreen)
  
  // Loading manager
  const manager = useLoadingManagerContext()

  // Materials
  const { woodMaterial, fixedObjectMaterial, raycasterObjectMaterial, plantMaterial, devicesOnTableMaterial, screenChairMaterial, fifthTextureSetMaterial, windowMaterial } = useRoomMaterials(materialPaths || {})
  const { screenVideoMaterial, screen001VideoMaterial } = useVideoMaterials()
  
  // Loading spinner texture
  const { loadingMaterial } = useLoadingTexture()

  // Material assignment with loading spinner for better UX
  const getMaterial = useCallback((meshName: string, materialType?: string): THREE.Material => {
    const materialMap: Record<string, THREE.Material> = {
      'floor': woodMaterial,
      'Room': fixedObjectMaterial,
      'plant': plantMaterial,
      // Hide the screen mesh since it will be replaced with iframe
      'inside_screen_popup': new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0,
        depthWrite: false 
      }),
      'inside_screen001_popup': screen001VideoMaterial || loadingMaterial,
      'devices_on_table': devicesOnTableMaterial || loadingMaterial,
      'screen_chair': screenChairMaterial || loadingMaterial,
      'fifth_texture_set': fifthTextureSetMaterial || loadingMaterial,
      'window': windowMaterial || loadingMaterial
    }
    
    // If a specific material type is provided, use it
    if (materialType && materialMap[materialType]) {
      return materialMap[materialType]
    }
    
    return materialMap[meshName] || raycasterObjectMaterial
  }, [woodMaterial, fixedObjectMaterial, plantMaterial, raycasterObjectMaterial, screen001VideoMaterial, loadingMaterial, devicesOnTableMaterial, screenChairMaterial, fifthTextureSetMaterial, windowMaterial])

  // Mesh configuration
  const { interactiveMeshConfigs, staticMeshConfigs } = useMemo(() => {
    const interactive = meshConfigs.filter(config => config.isInteractive)
    const staticMeshes = meshConfigs.filter(config => !config.isInteractive)
    return { interactiveMeshConfigs: interactive, staticMeshConfigs: staticMeshes }
  }, [meshConfigs])

  // 3D model loading
  const { nodes } = useGLTF(
    roomConfig?.modelPath || '/models/Room_Portfolio.glb',
    false, // draco     
    false, // ktx2
    (loader) => {
      loader.manager = manager
    }
  ) as unknown as GLTFResult

  return {
    // Data
    meshConfigs,
    materialPaths,
    roomConfig,
    isLoading,
    
    // Materials
    woodMaterial,
    fixedObjectMaterial,
    raycasterObjectMaterial,
    plantMaterial,
    devicesOnTableMaterial,
    screenChairMaterial,
    screenVideoMaterial,
    screen001VideoMaterial,
    loadingMaterial,
    getMaterial,
    
    // Configurations
    interactiveMeshConfigs,
    staticMeshConfigs,
    
    // 3D Model
    nodes
  }
} 