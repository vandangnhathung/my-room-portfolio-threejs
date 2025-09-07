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

  // Helper function to get canvas-relative coordinates (iOS fix)
  const getCanvasRelativeCoordinates = useCallback((event: ThreeEvent<PointerEvent>) => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    
    // Handle both pointer events and touch events for iOS compatibility
    let clientX = 0
    let clientY = 0
    
    if (event.clientX !== undefined && event.clientY !== undefined) {
      // Pointer event
      clientX = event.clientX
      clientY = event.clientY
    } else if (event.nativeEvent) {
      // Touch event or other native event
      const nativeEvent = event.nativeEvent as any
      if (nativeEvent.touches && nativeEvent.touches.length > 0) {
        // Touch event
        clientX = nativeEvent.touches[0].clientX
        clientY = nativeEvent.touches[0].clientY
      } else if (nativeEvent.clientX !== undefined) {
        // Fallback to native event coordinates
        clientX = nativeEvent.clientX
        clientY = nativeEvent.clientY
      }
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }, [])

  const createHoverHandlers = useCallback((meshName: string): HoverHandlers => ({
    onPointerEnter: (event: ThreeEvent<PointerEvent>) => {
      const { x, y } = getCanvasRelativeCoordinates(event)
      showMessage(meshName, x, y)
    },
    onPointerLeave: () => {
      hideMessage()
    },
    onPointerMove: (event: ThreeEvent<PointerEvent>) => {
      if (messageState.isVisible) {
        const { x, y } = getCanvasRelativeCoordinates(event)
        updatePosition(x, y)
      }
    },
    style: { cursor: 'pointer' }
  }), [messageState.isVisible, showMessage, hideMessage, updatePosition, getCanvasRelativeCoordinates])

  return {
    messageState,
    createHoverHandlers,
    showMessage,
    hideMessage,
    updatePosition
  }
}