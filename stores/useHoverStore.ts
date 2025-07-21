'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ThreeEvent } from '@react-three/fiber'
import { meshInfoDatabase } from '@/utils/mesh-message.config'

// Types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

interface MessageState {
  isVisible: boolean
  meshInfo: typeof meshInfoDatabase[string] | null
  position: { x: number; y: number }
}

interface HoverStore {
  // Hover state (rarely changes)
  hoveredMesh: string | null
  
  // Message state (changes frequently during mouse move)
  messageState: MessageState
  
  // Actions
  setHoveredMesh: (meshName: string | null) => void
  showMessage: (meshName: string, x: number, y: number) => void
  hideMessage: () => void
  updateMessagePosition: (x: number, y: number) => void
  createHoverHandlers: (meshName: string) => HoverHandlers
}

// Throttle function to limit update frequency
let throttleTimeout: NodeJS.Timeout | null = null
const throttledUpdatePosition = (
  set: (partial: Partial<HoverStore>) => void, 
  get: () => HoverStore, 
  x: number, 
  y: number
) => {
  if (throttleTimeout) return // Skip if already scheduled
  
  throttleTimeout = setTimeout(() => {
    const currentState = get().messageState
    if (currentState.isVisible) {
      set({
        messageState: {
          ...currentState,
          position: { x, y }
        }
      })
    }
    throttleTimeout = null
  }, 16) // ~60fps throttling
}

export const useHoverStore = create<HoverStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    hoveredMesh: null,
    messageState: {
      isVisible: false,
      meshInfo: null,
      position: { x: 0, y: 0 }
    },
    
    // Actions
    setHoveredMesh: (meshName) => set({ hoveredMesh: meshName }),
    
    showMessage: (meshName: string, x: number, y: number) => {
      const meshInfo = meshInfoDatabase[meshName]
      if (meshInfo) {
        set({
          messageState: {
            isVisible: true,
            meshInfo,
            position: { x, y }
          }
        })
      }
    },
    
    hideMessage: () => {
      set({
        messageState: {
          isVisible: false,
          meshInfo: null,
          position: { x: 0, y: 0 }
        }
      })
    },
    
    updateMessagePosition: (x: number, y: number) => {
      throttledUpdatePosition(set, get, x, y)
    },
    
    createHoverHandlers: (meshName: string) => ({
      onPointerEnter: (event: ThreeEvent<PointerEvent>) => {
        set({ hoveredMesh: meshName })
        const { showMessage } = get()
        showMessage(meshName, event.clientX, event.clientY)
      },
      onPointerLeave: () => {
        set({ hoveredMesh: null })
        const { hideMessage } = get()
        hideMessage()
      },
      onPointerMove: (event: ThreeEvent<PointerEvent>) => {
        const { updateMessagePosition } = get()
        updateMessagePosition(event.clientX, event.clientY)
      },
      style: { cursor: 'pointer' }
    })
  }))
)

// Optimized selectors for specific data
export const useHoveredMesh = () => useHoverStore(state => state.hoveredMesh)
export const useMessageState = () => useHoverStore(state => state.messageState)
export const useHoverHandlers = () => useHoverStore(state => state.createHoverHandlers) 