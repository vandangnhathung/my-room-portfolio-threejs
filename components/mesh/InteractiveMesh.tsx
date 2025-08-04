'use client'

import * as THREE from "three"
import React from "react"
import { animated } from "@react-spring/three"
import { GLTFResult, MeshConfig } from "@/types/type"
import { useHoverAnimation } from "@/hooks/hovering/use-hover-animation"
import { useChairRotation } from "@/hooks/use-chair-rotation"
import { ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef } from "react"
import { useRegisterMesh } from "@/stores/useMeshesAnimationStore"

// Define proper event handler types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

// Create a separate component for interactive meshes to handle hooks properly
const InteractiveMeshWrapperComponent = ({ 
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
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const registerMesh = useRegisterMesh()

  useEffect(() => {
    if (config.name === 'Executive_office_chair_raycaster' && onMeshRef) {
      onMeshRef(config.name, meshRef)
    }
  }, [config.name, onMeshRef])

  // Register wood meshes for animation
  useEffect(() => {
    if (!config.name.includes('inside_screen001_popup') && meshRef.current) {
      registerMesh(config.name, meshRef)
      // Initially hide wood meshes - they will be animated in
      meshRef.current.scale.set(0, 0, 0)
    }
  }, [config.name, registerMesh])

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
  const shouldAnimate = !config.name.includes('popup')
  const animatedScale = useHoverAnimation(config.name, config.scale, shouldAnimate ? hoveredMesh : null)
  
  const chairRotation = useChairRotation(config.name, 0.7)
  const hoverHandlers = createHoverHandlers(config.name)
  
  // Simple cursor configuration for wood meshes
  const enhancedHoverHandlers = {
    ...hoverHandlers,
    style: { 
      cursor: config.name.includes('wood') ? 'pointer' : hoverHandlers.style.cursor 
    }
  }
  
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
      hoverHandlers={enhancedHoverHandlers}
      chairRotationRef={isRotatingChair ? chairRotation.meshRef : undefined}
      meshRef={meshRef}
    />
  )
}

// Memoize the component to prevent unnecessary re-renders
export const InteractiveMeshWrapper = React.memo(InteractiveMeshWrapperComponent, (prevProps, nextProps) => {
  // Only re-render if these specific props have actually changed
  return (
    prevProps.config.name === nextProps.config.name &&
    prevProps.hoveredMesh === nextProps.hoveredMesh &&
    prevProps.isCameraFocused === nextProps.isCameraFocused &&
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
  )
})

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