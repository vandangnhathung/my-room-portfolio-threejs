import { StaticMesh } from "@/components/mesh/StaticMesh"
import { useRoomUtils } from "@/hooks/use-room-utils"
import { MeshConfig } from "@/types/type"
import { useEffect } from "react"

export const RenderStaticMeshes = () => {
    const { nodes, getMaterial, staticMeshConfigs } = useRoomUtils()


    useEffect(() => {
        if (!nodes) {
            console.warn("GLTF model not loaded properly")
            return
        }

        const myWorkMesh: MeshConfig[] = [];

        staticMeshConfigs.forEach((meshConfig) => {
            if (meshConfig.name.includes('wood')) {
                myWorkMesh.push(meshConfig)
            }
        })

        console.log("myWorkMesh", myWorkMesh)
        
    }, [nodes, staticMeshConfigs])


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