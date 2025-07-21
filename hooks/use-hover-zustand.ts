'use client'

import { useHoverStore } from '@/stores/useHoverStore'

export const useHoverZustand = () => {
  const store = useHoverStore()
  
  return {
    hoveredMesh: store.hoveredMesh,
    createHoverHandlers: store.createHoverHandlers,
    messageState: store.messageState,
    // For backwards compatibility
    hoverMessage: {
      messageState: store.messageState
    }
  }
} 