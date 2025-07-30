import { InteractiveMeshWrapper } from "@/components/Mesh/InteractiveMesh"
import { useRoomUtils } from "@/hooks/use-room-utils"
import { useHoveredMesh, useHoverHandlers } from "@/stores/useHoverStore"
import { useCameraStore } from "@/stores/useCameraStore"
import * as THREE from "three"

export const RenderInteractiveMeshes = ({ 
  onMeshRef 
}: { 
  onMeshRef?: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void
}) => {
  const { nodes, getMaterial, interactiveMeshConfigs } = useRoomUtils()
  const hoveredMesh = useHoveredMesh()
  const createHoverHandlers = useHoverHandlers()
  
  // Get isCameraFocused from Zustand store
  const isCameraFocused = useCameraStore((state) => state.isCameraFocused)

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