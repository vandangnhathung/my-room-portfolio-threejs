import { 
  usePopupOpenAction, 
  usePopupCloseAction, 
  usePopupIsOpenById 
} from '@/stores/usePopupStore'
import WoodMeshPopupContent from '@/components/Popup/WoodMeshPopupContent'
import React, { useCallback } from 'react'

// Wood mesh popup configurations
const WOOD_MESH_CONFIGS = {
  wood_2: {
    title: "My Work Showcase",
    beforeOpen: () => {
      // Optional: Add any setup logic here
    },
    afterOpen: () => {
      // Optional: Add any completion logic here
    },
    beforeClose: () => {
      // Optional: Add any cleanup logic here
    },
    afterClose: () => {
      // Optional: Add any final cleanup logic here
    }
  },
  wood_3: {
    title: "Skills & Expertise",
    beforeOpen: () => {},
    afterOpen: () => {},
    beforeClose: () => {},
    afterClose: () => {}
  },
  wood_4: {
    title: "About Me",
    beforeOpen: () => {},
    afterOpen: () => {},
    beforeClose: () => {},
    afterClose: () => {}
  }
}

export const useWoodMeshPopup = () => {
  const openPopup = usePopupOpenAction()
  const closePopup = usePopupCloseAction()
  const isPopupOpen = usePopupIsOpenById()

  // Memoize the openWoodMeshPopup function to ensure stable reference
  const openWoodMeshPopup = useCallback(async (meshName: string) => {
    const config = WOOD_MESH_CONFIGS[meshName as keyof typeof WOOD_MESH_CONFIGS]
    
    if (!config) {
      console.warn(`No popup configuration found for mesh: ${meshName}`)
      return
    }

    try {
      const popupConfig = {
        id: `wood-mesh-${meshName}`,
        title: config.title,
        content: React.createElement(WoodMeshPopupContent, { meshName }),
        beforeOpen: config.beforeOpen,
        afterOpen: config.afterOpen,
        beforeClose: config.beforeClose,
        afterClose: config.afterClose,
        closeOnOutsideClick: true,
        closeOnEscape: true,
        showCloseButton: true
      }

      await openPopup(popupConfig)
    } catch (error) {
      console.error('Error in openWoodMeshPopup:', error)
    }
  }, [openPopup])

  const isWoodMeshPopupOpen = useCallback((meshName: string) => {
    return isPopupOpen(`wood-mesh-${meshName}`)
  }, [isPopupOpen])

  return {
    openWoodMeshPopup,
    closePopup,
    isWoodMeshPopupOpen
  }
} 