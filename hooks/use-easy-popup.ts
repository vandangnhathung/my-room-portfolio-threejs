import { useEffect } from 'react'

export const useEasyPopup = () => {
  useEffect(() => {
    const loadEasyPopup = async () => {
      if (typeof window !== 'undefined') {
        try {
          await import("@viivue/easy-popup")
          
          setTimeout(() => {
            if (window.EasyPopup) {
              try {
                window.EasyPopup.init('[data-easy-popup]')
                console.log('Easy Popup initialized successfully')
              } catch (error) {
                console.log('Easy Popup already initialized or error:', error)
              }
            }
          }, 100)
        } catch (error) {
          console.error('Failed to load Easy Popup:', error)
        }
      }
    }
    
    loadEasyPopup()
  }, [])
} 