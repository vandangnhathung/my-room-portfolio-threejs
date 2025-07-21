import { InteractiveMeshWrapper } from "@/components/mesh/InteractiveMesh"
import { useRoomUtils } from "@/hooks/use-room-utils"
import { useHoverZustand } from "@/hooks/use-hover-zustand"

export const RenderInteractiveMeshes = () => {
  const { nodes, getMaterial, interactiveMeshConfigs } = useRoomUtils()
  const { hoveredMesh, createHoverHandlers } = useHoverZustand()

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
          />
        )
      })}
    </>
  )
}