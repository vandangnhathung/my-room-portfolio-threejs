import * as THREE from "three"
import { MeshConfig } from "@/types/type"

export const StaticMesh: React.FC<{
    config: MeshConfig
    geometry: THREE.BufferGeometry
    material: THREE.Material
  }> = ({ config, geometry, material }) => (
    <mesh
      name={config.name}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
    />
  )
  