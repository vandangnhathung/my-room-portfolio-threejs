import { InteractiveMeshWrapper } from "@/components/Mesh/InteractiveMesh"
import { useRoomUtils } from "@/hooks/use-room-utils"
import { useHoveredMesh, useHoverHandlers } from "@/stores/useHoverStore"
import * as THREE from "three"

export const RenderInteractiveMeshes = ({ 
  isCameraFocused, 
  onMeshRef 
}: { 
  isCameraFocused: boolean
  onMeshRef?: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void
}) => {
  const { nodes, getMaterial, interactiveMeshConfigs } = useRoomUtils()
  const hoveredMesh = useHoveredMesh()
  const createHoverHandlers = useHoverHandlers()

  if (!nodes) {
    console.warn("GLTF model not loaded properly")
    return null
  }

  return (
    <>
      {interactiveMeshConfigs.map((config) => {
        const geometry = nodes[config.name as keyof typeof nodes]?.geometry
        if (!geometry) {
          console.warn(`Geometry not found for interactive mesh: ${config.name}`)
          return null
        }

        return (
          <InteractiveMeshWrapper
            key={`interactive-${config.name}`}
            config={config}
            nodes={nodes}
            getMaterial={getMaterial}
            hoveredMesh={hoveredMesh}
            createHoverHandlers={createHoverHandlers}
            isCameraFocused={isCameraFocused}
            onMeshRef={onMeshRef}
          />
        )
      })}
    </>
  )
}