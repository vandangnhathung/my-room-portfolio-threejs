'use client'

import * as THREE from "three"
import { animated } from "@react-spring/three"
import { GLTFResult, MeshConfig } from "@/types/type"
import { useHoverAnimation } from "@/hooks/hovering/use-hover-animation"
import { useChairRotation } from "@/hooks/use-chair-rotation"
import { ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef } from "react"
import { useRegisterWoodMesh } from "@/stores/useWoodAnimationStore"

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
  createHoverHandlers,
  isCameraFocused,
  onMeshRef
}: {
  config: MeshConfig
  nodes: GLTFResult['nodes']
  getMaterial: (name: string, materialType?: string) => THREE.Material
  hoveredMesh: string | null
  createHoverHandlers: (name: string) => HoverHandlers
  isCameraFocused: boolean
  onMeshRef?: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const registerWoodMesh = useRegisterWoodMesh()

  useEffect(() => {
    if (config.name === 'Executive_office_chair_raycaster' && onMeshRef) {
      onMeshRef(config.name, meshRef)
    }
  }, [config.name, onMeshRef])

  // Register wood meshes for animation
  useEffect(() => {
    if (config.name.includes('wood') && meshRef.current) {
      registerWoodMesh(config.name, meshRef)
      // Initially hide wood meshes - they will be animated in
      meshRef.current.scale.set(0, 0, 0)
    }
  }, [config.name, registerWoodMesh])

  useEffect(() => {
    if (meshRef.current && config.name === 'Executive_office_chair_raycaster') {
      if (isCameraFocused) {
        meshRef.current.visible = false
      } else {
        meshRef.current.visible = true
      }
    }
  }, [isCameraFocused, config.name])

  // Only apply hover animation if mesh name doesn't contain 'popup' and isn't a wood mesh
  const shouldAnimate = !config.name.includes('popup') && !config.name.includes('wood')
  const animatedScale = useHoverAnimation(config.name, config.scale, shouldAnimate ? hoveredMesh : null)
  
  const chairRotation = useChairRotation(config.name, 0.7)
  const hoverHandlers = createHoverHandlers(config.name)
  const geometry = nodes[config.name as keyof typeof nodes]?.geometry
  const material = getMaterial(config.name, config.material)

  if (!geometry) return null

  const isRotatingChair = config.name === 'Executive_office_chair_raycaster'

  return (
    <InteractiveMesh
      config={config}
      geometry={geometry}
      material={material}
      animatedScale={animatedScale as unknown as { scale: number | [number, number, number] }}
      hoverHandlers={hoverHandlers}
      chairRotationRef={isRotatingChair ? chairRotation.meshRef : undefined}
      meshRef={meshRef}
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
  meshRef?: React.RefObject<THREE.Mesh | null>
}> = ({ config, geometry, material, animatedScale, hoverHandlers, chairRotationRef, meshRef }) => (
  <animated.mesh
    ref={(node) => {
      // Handle both refs
      if (meshRef) meshRef.current = node
      if (chairRotationRef) chairRotationRef.current = node
    }}
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