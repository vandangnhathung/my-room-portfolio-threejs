import { useOptimizedTexture } from "@/hooks/use-optimized-texture"
import * as THREE from "three"

interface MaterialPaths {
  wood?: string
  fixedObject?: string
  raycasterObject?: string
  plant?: string
  devicesOnTable?: string
  screenChair?: string
  fifthTextureSet?: string
  window?: string
  world?: string
}

export const useRoomMaterials = (materialPaths: MaterialPaths) => {
  const woodMaterial = useOptimizedTexture({
    path: materialPaths?.wood || '/textures/room/wood.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const fixedObjectMaterial = useOptimizedTexture({
    path: materialPaths?.fixedObject || '/textures/room/FixedObjectSet.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const raycasterObjectMaterial = useOptimizedTexture({
    path: materialPaths?.raycasterObject || '/textures/room/RaycasterObjectSet.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const plantMaterial = useOptimizedTexture({
    path: materialPaths?.plant || '/textures/room/Plant.jpg',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const devicesOnTableMaterial = useOptimizedTexture({
    path: materialPaths?.devicesOnTable || '/textures/room/devices_on_table.jpg',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const screenChairMaterial = useOptimizedTexture({
    path: materialPaths?.screenChair || '/textures/room/screen_chair.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const fifthTextureSetMaterial = useOptimizedTexture({
    path: materialPaths?.fifthTextureSet || '/textures/room/FifthTextureSet.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const windowMaterial = useOptimizedTexture({
    path: materialPaths?.window || '/textures/room/window_texture_set.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const worldMaterial = useOptimizedTexture({
    path: materialPaths?.world || '/textures/room/World.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  return { woodMaterial, fixedObjectMaterial, raycasterObjectMaterial,
     plantMaterial, devicesOnTableMaterial, screenChairMaterial,
      fifthTextureSetMaterial, windowMaterial, worldMaterial }
} 