'use client'

import { useHoveredMesh, useMessageState, useHoverHandlers } from '@/stores/useHoverStore'

export const useHoverZustand = () => {
  const hoveredMesh = useHoveredMesh()
  const messageState = useMessageState()
  const createHoverHandlers = useHoverHandlers()
  
  return {
    hoveredMesh,
    createHoverHandlers,
    messageState,
    // For backwards compatibility
    hoverMessage: {
      messageState
    }
  }
} 