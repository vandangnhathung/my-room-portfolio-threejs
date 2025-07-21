import { useRoomMaterials } from "@/hooks/use-room-materials"
import { useVideoMaterials } from "@/hooks/videos/use-video-materials"
import { useLoadingTexture } from "@/hooks/use-loading-texture"
import * as THREE from "three"
import { useCallback, useMemo } from "react"
import { useRoomData } from "@/hooks/use-room-data"
import { GLTFResult } from "@/types/type"
import { useGLTF } from "@react-three/drei"
import { useLoadingManagerContext } from "@/components/LoadingSystem"

export const useRoomUtils = () => {
  // Data fetching
  const { meshConfigs, materialPaths, roomConfig, isLoading } = useRoomData()
  
  // Loading manager
  const manager = useLoadingManagerContext()

  // Materials
  const { woodMaterial, fixedObjectMaterial, raycasterObjectMaterial, plantMaterial } = useRoomMaterials(materialPaths || {})
  const { screenVideoMaterial, screen001VideoMaterial } = useVideoMaterials()
  
  // Loading spinner texture
  const { loadingMaterial } = useLoadingTexture()

  // Material assignment with loading spinner for better UX
  const getMaterial = useCallback((meshName: string): THREE.Material => {
    const materialMap: Record<string, THREE.Material> = {
      'floor': woodMaterial,
      'Room': fixedObjectMaterial,
      'plant': plantMaterial,
      'inside_screen_popup': screenVideoMaterial || loadingMaterial,
      'inside_screen001_popup': screen001VideoMaterial || loadingMaterial
    }
    
    return materialMap[meshName] || raycasterObjectMaterial
  }, [woodMaterial, fixedObjectMaterial, plantMaterial, raycasterObjectMaterial, screenVideoMaterial, screen001VideoMaterial, loadingMaterial])

  // Mesh configuration
  const { interactiveMeshConfigs, staticMeshConfigs } = useMemo(() => {
    const interactive = meshConfigs.filter(config => config.isInteractive)
    const staticMeshes = meshConfigs.filter(config => !config.isInteractive)
    return { interactiveMeshConfigs: interactive, staticMeshConfigs: staticMeshes }
  }, [meshConfigs])

  // 3D model loading
  const { nodes } = useGLTF(
    roomConfig?.modelPath || '/models/Room_ver2-v1 (2).glb',
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