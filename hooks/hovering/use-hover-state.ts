// ===== FILE: hooks/use-hover-state.ts (REPLACE EXISTING) =====
import { useState, useCallback } from "react"
import { useHoverMessage } from '@/hooks/hovering/use-hover-message'
import { ThreeEvent } from '@react-three/fiber'

// Define proper event handler types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

export const useHoverState = () => {
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null)
  const hoverMessage = useHoverMessage()

  const createHoverHandlers = useCallback((meshName: string): HoverHandlers => {
    const messageHandlers = hoverMessage.createHoverHandlers(meshName)
    
    return {
      onPointerEnter: (event: ThreeEvent<PointerEvent>) => {
        setHoveredMesh(meshName)
        messageHandlers.onPointerEnter(event)
      },
      onPointerLeave: (event: ThreeEvent<PointerEvent>) => {
        setHoveredMesh(null)
        messageHandlers.onPointerLeave(event)
      },
      onPointerMove: (event: ThreeEvent<PointerEvent>) => {
        messageHandlers.onPointerMove?.(event)
      },
      style: { cursor: 'pointer' }
    }
  }, [hoverMessage])

  return { 
    hoveredMesh, 
    createHoverHandlers,
    hoverMessage
  }
}