import { useState } from "react"

export const useHoverState = () => {
    const [hoveredMesh, setHoveredMesh] = useState<string | null>(null)
  
    const createHoverHandlers = (meshName: string) => ({
      onPointerEnter: () => setHoveredMesh(meshName),
      onPointerLeave: () => setHoveredMesh(null),
      style: { cursor: 'pointer' }
    })
  
    return { hoveredMesh, createHoverHandlers }
  }
  