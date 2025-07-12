// ===== FILE: hooks/use-hover-message.ts (REPLACE EXISTING) =====
import { useState, useCallback } from 'react'
import { ThreeEvent } from '@react-three/fiber'
import { MeshInfo, meshInfoDatabase } from '@/utils/mesh-message.config'


interface HoverMessageState {
  isVisible: boolean
  meshInfo: MeshInfo | null
  position: { x: number; y: number }
}

// Define proper event types for Three.js events
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

export const useHoverMessage = () => {
  const [messageState, setMessageState] = useState<HoverMessageState>({
    isVisible: false,
    meshInfo: null,
    position: { x: 0, y: 0 }
  })

  const showMessage = useCallback((meshName: string, mouseX: number, mouseY: number) => {
    const meshInfo = meshInfoDatabase[meshName]
    if (meshInfo) {
      setMessageState({
        isVisible: true,
        meshInfo,
        position: { x: mouseX, y: mouseY }
      })
    }
  }, [])

  const hideMessage = useCallback(() => {
    setMessageState({
      isVisible: false,
      meshInfo: null,
      position: { x: 0, y: 0 }
    })
  }, [])

  const updatePosition = useCallback((mouseX: number, mouseY: number) => {
    setMessageState(prev => ({
      ...prev,
      position: { x: mouseX, y: mouseY }
    }))
  }, [])

  const createHoverHandlers = useCallback((meshName: string): HoverHandlers => ({
    onPointerEnter: (event: ThreeEvent<PointerEvent>) => {
      const mouseX = event.clientX || event.nativeEvent?.clientX || 0
      const mouseY = event.clientY || event.nativeEvent?.clientY || 0
      showMessage(meshName, mouseX, mouseY)
    },
    onPointerLeave: () => {
      hideMessage()
    },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      if (messageState.isVisible) {
        const mouseX = event.clientX || event.nativeEvent?.clientX || 0
        const mouseY = event.clientY || event.nativeEvent?.clientY || 0
        updatePosition(mouseX, mouseY)
      }
    },
    style: { cursor: 'pointer' }
  }), [messageState.isVisible, showMessage, hideMessage, updatePosition])

  return {
    messageState,
    createHoverHandlers,
    showMessage,
    hideMessage,
    updatePosition
  }
}