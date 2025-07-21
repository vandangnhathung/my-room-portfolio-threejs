import React from "react"
import FireFlies from "@/components/FireFlies/FireFlies"

const RenderAnimatedMeshes = () => {
  console.log("RenderAnimatedMeshes - This should only log once after initial load")
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

// Memoize to prevent unnecessary re-renders
export default React.memo(RenderAnimatedMeshes)