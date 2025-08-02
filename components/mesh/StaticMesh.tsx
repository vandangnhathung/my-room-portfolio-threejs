'use client'

import * as THREE from "three"
import { GLTFResult, MeshConfig } from "@/types/type"

export const StaticMesh: React.FC<{
  config: MeshConfig
  nodes: GLTFResult['nodes']
  getMaterial: (name: string, materialType?: string) => THREE.Material
}> = ({ config, nodes, getMaterial }) => {
  // Add safety checks for nodes
  if (!nodes) {
    console.warn(`Nodes object is undefined for mesh: ${config.name}`)
    return null
  }

  const geometry = nodes[config.name as keyof typeof nodes]?.geometry
  const material = getMaterial(config.name, config.material)

  if (!geometry) {
    console.warn(`Geometry not found for mesh: ${config.name}`)
    return null
  }

  return (
    <mesh
      name={config.name}
      geometry={geometry}
      material={material}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
      castShadow
      receiveShadow
    />
  )
}