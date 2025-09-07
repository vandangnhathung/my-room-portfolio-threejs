'use client'

import * as THREE from "three"
import { GLTFResult, MeshConfig } from "@/types/type"
import { useRef, useEffect } from "react"
import { useRegisterMesh } from "@/stores/useMeshesAnimationStore"

export const StaticMesh: React.FC<{
  config: MeshConfig
  nodes: GLTFResult['nodes']
  getMaterial: (name: string, materialType?: string) => THREE.Material
}> = ({ config, nodes, getMaterial }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const registerMesh = useRegisterMesh()
  
  const geometry = nodes[config.name as keyof typeof nodes]?.geometry
  const material = getMaterial(config.name, config.material)

  // Register ALL meshes for potential animation, not just wood ones
  useEffect(() => {
     if (!nodes) {
       console.warn(`Nodes object is undefined for mesh: ${config.name}`)
       return
     }

     if (!geometry) {
       console.warn(`Geometry not found for mesh: ${config.name}`)
       return
     }

     // Register all meshes, not just wood ones
     if (meshRef.current) {
       registerMesh(config.name, meshRef)
       
       // Only hide wood meshes initially
       if (config.name.includes('wood')) {
         meshRef.current.scale.set(0, 0, 0)
       }
     }
  }, [config.name, registerMesh, geometry, nodes])

  return (
    <mesh
      ref={meshRef}
      name={config.name}
      geometry={geometry}
      material={material}
      position={config.position}
      rotation={config.rotation}
      scale={config.scale}
      receiveShadow
    />
  )
}