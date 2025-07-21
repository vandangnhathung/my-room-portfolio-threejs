import { useOptimizedTexture } from "@/hooks/use-optimized-texture"
import * as THREE from "three"

interface MaterialPaths {
  wood?: string
  fixedObject?: string
  raycasterObject?: string
  plant?: string
  devicesOnTable?: string
}

export const useRoomMaterials = (materialPaths: MaterialPaths) => {
  const woodMaterial = useOptimizedTexture({
    path: materialPaths?.wood || '/textures/room/wood.webp',
    colorSpace: THREE.SRGBColorSpace,
    flipY: false,
    generateMipmaps: false
  })

  const fixedObjectMaterial = useOptimizedTexture({
    path: materialPaths?.fixedObject || '/textures/room/FixedObjectSet.jpg',
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

  return { woodMaterial, fixedObjectMaterial, raycasterObjectMaterial, plantMaterial, devicesOnTableMaterial }
} 