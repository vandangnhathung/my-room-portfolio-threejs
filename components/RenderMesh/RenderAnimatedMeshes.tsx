import FireFlies from "@/components/FireFlies/FireFlies"

export const RenderAnimatedMeshes = () => {
  try {
    return (
      <group>
        <FireFlies />
      </group>
    )
  } catch (error) {
    console.error("Error rendering animated meshes:", error)
    return null
  }
}