import { useMemo } from "react"
import * as THREE from "three"
import { TextureConfig } from "@/types/type"
import { useLoadingManagerContext } from '@/components/LoadingSystem';

export const useOptimizedTexture = (config: TextureConfig): THREE.MeshStandardMaterial => {
  const manager = useLoadingManagerContext();
  
  return useMemo(() => {
    const loader = new THREE.TextureLoader(manager); // Pass the manager here
    const texture = loader.load(config.path);
    
    texture.flipY = config.flipY
    texture.colorSpace = config.colorSpace
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    texture.generateMipmaps = config.generateMipmaps
    
    return new THREE.MeshStandardMaterial({ map: texture })
  }, [config.path, config.colorSpace, config.flipY, config.generateMipmaps, manager]);
}
