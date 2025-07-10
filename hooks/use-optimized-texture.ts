import { useMemo } from "react"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { TextureConfig } from "@/types/type"

export const useOptimizedTexture = (config: TextureConfig): THREE.MeshStandardMaterial => {
    const texture = useTexture(config.path)
    
    return useMemo(() => {
      texture.flipY = config.flipY
      texture.colorSpace = config.colorSpace
      texture.minFilter = THREE.NearestFilter
      texture.magFilter = THREE.NearestFilter
      texture.generateMipmaps = config.generateMipmaps
      return new THREE.MeshStandardMaterial({ map: texture })
    }, [texture, config])
  }
