// ===== FILE: components/mesh/InteractiveMesh.tsx (REPLACE EXISTING) =====
'use client'

import * as THREE from "three"
import { animated } from "@react-spring/three"
import { GLTFResult, MeshConfig } from "@/types/type"
import { useHoverAnimation } from "@/hooks/use-hover-animation"
import { useChairRotation } from "@/hooks/use-chair-rotation"
import { ThreeEvent } from '@react-three/fiber'

// Define proper event handler types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

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
  createHoverHandlers: (name: string) => HoverHandlers
}) {
  const animatedScale = useHoverAnimation(config.name, config.scale, hoveredMesh)
  const chairRotation = useChairRotation(config.name, 0.3) // Slow initial speed
  const hoverHandlers = createHoverHandlers(config.name)
  const geometry = nodes[config.name as keyof typeof nodes]?.geometry
  const material = getMaterial(config.name)

  if (!geometry) return null

  // Check if this is the chair that should rotate
  const isRotatingChair = config.name === 'Executive_office_chair_raycaster'

  return (
      <InteractiveMesh
        config={config}
        geometry={geometry}
        material={material}
        animatedScale={animatedScale as unknown as { scale: number | [number, number, number] }}
        hoverHandlers={hoverHandlers}
        chairRotationRef={isRotatingChair ? chairRotation.meshRef : undefined}
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
  hoverHandlers: HoverHandlers
  chairRotationRef?: React.RefObject<THREE.Mesh | null>
}> = ({ config, geometry, material, animatedScale, hoverHandlers, chairRotationRef }) => (
  <animated.mesh
    ref={chairRotationRef}
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