import { create } from 'zustand'
import React from 'react'

export interface PopupConfig {
  id: string
  title?: string
  content?: React.ReactNode
  beforeOpen?: () => void | Promise<void>
  afterOpen?: () => void | Promise<void>
  beforeClose?: () => void | Promise<void>
  afterClose?: () => void | Promise<void>
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

interface PopupStore {
  isOpen: boolean
  isLoading: boolean
  isAnimating: boolean // New state for animation control
  config: PopupConfig | null
  
  // Actions
  openPopup: (config: PopupConfig) => Promise<void>
  closePopup: () => Promise<void>
  startCloseAnimation: () => void // New action to start closing
  finishCloseAnimation: () => void // New action to finish closing
  setLoading: (loading: boolean) => void
  isPopupOpen: (id: string) => boolean
}

export const usePopupStore = create<PopupStore>((set, get) => ({
  isOpen: false,
  isLoading: false,
  isAnimating: false,
  config: null,

  openPopup: async (config: PopupConfig) => {
    try {
      set({ isLoading: true })

      // Execute beforeOpen callback
      if (config.beforeOpen) {
        await config.beforeOpen()
      }

      const finalConfig = {
        closeOnOutsideClick: true,
        closeOnEscape: true,
        showCloseButton: true,
        ...config
      }

      // Set popup state
      set({
        isOpen: true,
        isLoading: false,
        isAnimating: false,
        config: finalConfig
      })

      // Execute afterOpen callback after a brief delay
      if (config.afterOpen) {
        setTimeout(async () => {
          try {
            await config.afterOpen!()
          } catch (error) {
            console.error('Error in afterOpen callback:', error)
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error opening popup:', error)
      set({ isLoading: false })
    }
  },

  closePopup: async () => {
    const state = get()
    if (!state.config || state.isAnimating) return

    try {
      // Start the closing animation (popup stays visible)
      set({ isAnimating: true })

      // Execute beforeClose callback
      if (state.config.beforeClose) {
        await state.config.beforeClose()
      }

      // The actual closing will be handled by finishCloseAnimation
      // after the GSAP animation completes
    } catch (error) {
      console.error('Error closing popup:', error)
      set({ isLoading: false, isAnimating: false })
    }
  },

  startCloseAnimation: () => {
    set({ isAnimating: true })
  },

  finishCloseAnimation: () => {
    const state = get()
    
    // Actually close the popup after animation
    set({
      isOpen: false,
      isLoading: false,
      isAnimating: false,
      config: null
    })

    // Execute afterClose callback
    if (state.config?.afterClose) {
      setTimeout(async () => {
        try {
          await state.config!.afterClose!()
        } catch (error) {
          console.error('Error in afterClose callback:', error)
        }
      }, 50)
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  isPopupOpen: (id: string) => {
    const state = get()
    return state.isOpen && state.config?.id === id
  }
}))

// Individual stable selectors to prevent infinite loops
export const usePopupIsOpen = () => usePopupStore(state => state.isOpen)
export const usePopupIsLoading = () => usePopupStore(state => state.isLoading)
export const usePopupIsAnimating = () => usePopupStore(state => state.isAnimating)
export const usePopupConfig = () => usePopupStore(state => state.config)
export const usePopupOpenAction = () => usePopupStore(state => state.openPopup)
export const usePopupCloseAction = () => usePopupStore(state => state.closePopup)
export const usePopupStartCloseAnimation = () => usePopupStore(state => state.startCloseAnimation)
export const usePopupFinishCloseAnimation = () => usePopupStore(state => state.finishCloseAnimation)
export const usePopupSetLoading = () => usePopupStore(state => state.setLoading)
export const usePopupIsOpenById = () => usePopupStore(state => state.isPopupOpen) 