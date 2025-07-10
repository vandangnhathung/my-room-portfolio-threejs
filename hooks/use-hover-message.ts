// ===== FILE: hooks/use-hover-message.ts (REPLACE EXISTING) =====
import { useState, useCallback } from 'react'
import { ThreeEvent } from '@react-three/fiber'

interface MeshInfo {
  name: string
  displayName: string
  description: string
  category: string
  interactionHint?: string
}

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

// Mesh information database
const meshInfoDatabase: Record<string, MeshInfo> = {
  'Executive_office_chair_raycaster001': {
    name: 'Executive_office_chair_raycaster001',
    displayName: 'Executive Office Chair',
    description: 'A comfortable executive office chair with ergonomic design',
    category: 'Furniture',
    interactionHint: 'Click to interact'
  },
  'Executive_office_chair_raycaster': {
    name: 'Executive_office_chair_raycaster',
    displayName: 'Rotating Executive Chair',
    description: 'A premium executive chair that gently rotates back and forth',
    category: 'Furniture',
    interactionHint: 'Watch it rotate automatically'
  },
  'camera_raycaster': {
    name: 'camera_raycaster',
    displayName: 'Professional Camera',
    description: 'A high-quality camera for capturing moments',
    category: 'Electronics',
    interactionHint: 'Click to take a photo'
  },
  'guitar_raycaster': {
    name: 'guitar_raycaster',
    displayName: 'Acoustic Guitar',
    description: 'A beautiful acoustic guitar for making music',
    category: 'Musical Instrument',
    interactionHint: 'Click to play a chord'
  },
  'screen_raycaster': {
    name: 'screen_raycaster',
    displayName: 'Computer Monitor',
    description: 'A modern computer monitor for work and entertainment',
    category: 'Electronics',
    interactionHint: 'Click to turn on/off'
  },
  'screen001_raycaster': {
    name: 'screen001_raycaster',
    displayName: 'Secondary Monitor',
    description: 'An additional monitor for enhanced productivity',
    category: 'Electronics',
    interactionHint: 'Click to switch display'
  },
  'player_button_raycaster': {
    name: 'player_button_raycaster',
    displayName: 'Music Player Button',
    description: 'Control button for the music player system',
    category: 'Electronics',
    interactionHint: 'Click to play/pause music'
  },
  'headphone_raycaster': {
    name: 'headphone_raycaster',
    displayName: 'Premium Headphones',
    description: 'High-quality headphones for immersive audio experience',
    category: 'Electronics',
    interactionHint: 'Click to put on/off'
  },
  'cup_coaster_raycaster': {
    name: 'cup_coaster_raycaster',
    displayName: 'Coffee Cup & Coaster',
    description: 'A warm cup of coffee on a wooden coaster',
    category: 'Accessories',
    interactionHint: 'Click to take a sip'
  },
  'lamp_raycaster': {
    name: 'lamp_raycaster',
    displayName: 'Desk Lamp',
    description: 'An adjustable desk lamp for focused lighting',
    category: 'Lighting',
    interactionHint: 'Click to toggle light'
  },
  'vinyl_record_player_raycaster': {
    name: 'vinyl_record_player_raycaster',
    displayName: 'Vinyl Record Player',
    description: 'A vintage vinyl record player for analog music',
    category: 'Musical Equipment',
    interactionHint: 'Click to play vinyl'
  },
  'misc_things004_raycaster': {
    name: 'misc_things004_raycaster',
    displayName: 'Decorative Items',
    description: 'Various decorative items that add character to the space',
    category: 'Decoration',
    interactionHint: 'Click to examine'
  },
  'misc_things009_raycaster': {
    name: 'misc_things009_raycaster',
    displayName: 'Office Supplies',
    description: 'Essential office supplies for daily work',
    category: 'Office',
    interactionHint: 'Click to organize'
  }
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