'use client'

import * as THREE from "three"
import { animated } from "@react-spring/three"
import { GLTFResult, MeshConfig } from "@/type.d"
import { useHoverAnimation } from "@/hooks/use-hover-animation"

// Create a separate component for interactive meshes to handle hooks properly
export function InteractiveMeshWrapper({ 
  config, 
  nodes, 
  getMaterial, 
  hoveredMesh, 
  createHoverHandlers 
}: {
  config: MeshConfig
  nodes: GLTFResult['nodes']
  getMaterial: (name: string) => THREE.Material
  hoveredMesh: string | null
  createHoverHandlers: (name: string) => { 
    onPointerEnter: () => void; 
    onPointerLeave: () => void; 
    style: { cursor: string } 
  }
}) {
  const animatedScale = useHoverAnimation(config.name, config.scale, hoveredMesh)
  const hoverHandlers = createHoverHandlers(config.name)
  const geometry = nodes[config.name as keyof typeof nodes]?.geometry
  const material = getMaterial(config.name)

  if (!geometry) return null

  return (
    <InteractiveMesh
      config={config}
      geometry={geometry}
      material={material}
      animatedScale={animatedScale as unknown as { scale: number | [number, number, number] }}
      hoverHandlers={hoverHandlers}
    />
  )
}

export const InteractiveMesh: React.FC<{
  config: MeshConfig
  geometry: THREE.BufferGeometry
  material: THREE.Material
  animatedScale: {
    scale: number | [number, number, number]
  }
  hoverHandlers: {
    onPointerEnter: () => void
    onPointerLeave: () => void
    style: { cursor: string }
  }
}> = ({ config, geometry, material, animatedScale, hoverHandlers }) => (
  <animated.mesh
    name={config.name}
    castShadow
    receiveShadow
    geometry={geometry}
    material={material}
    position={config.position}
    rotation={config.rotation}
    scale={animatedScale.scale}
    onClick={config.onClick}
    {...hoverHandlers}
  />
)