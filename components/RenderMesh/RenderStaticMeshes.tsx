import { StaticMesh } from "@/components/mesh/StaticMesh"
import { useRoomUtils } from "@/hooks/use-room-utils"

export const RenderStaticMeshes = () => {
    const { nodes, getMaterial, staticMeshConfigs } = useRoomUtils()

    if (!nodes) {
        console.warn("GLTF model not loaded properly")
        return null
    }

    return (
        <>
            {staticMeshConfigs.map((config) => {
                const geometry = nodes[config.name as keyof typeof nodes]?.geometry
                if (!geometry) {
                    console.warn(`Geometry not found for static mesh: ${config.name}`)
                    return null
                }

                return (
                    <StaticMesh
                        key={`static-${config.name}`}
                        config={config}
                        nodes={nodes}
                        getMaterial={getMaterial}
                    />
                )
            })}
        </>
    )
}