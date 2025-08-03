import React, { useEffect } from 'react'
import { 
  usePopupIsOpen, 
  usePopupIsLoading, 
  usePopupIsAnimating,
  usePopupConfig, 
  usePopupCloseAction 
} from '@/stores/usePopupStore'
import { PopupContainer } from '@/components/Popup/PopupContainer'

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOpen = usePopupIsOpen()
  const isLoading = usePopupIsLoading()
  const isAnimating = usePopupIsAnimating()
  const config = usePopupConfig()
  const closePopup = usePopupCloseAction()

  // Handle outside click
  const handleOutsideClick = () => {
    if (config?.closeOnOutsideClick && !isAnimating) {
      closePopup()
    }
  }

  // Handle close button click
  const handleCloseClick = () => {
    if (!isAnimating) {
      closePopup()
    }
  }

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !config?.closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isAnimating) {
        closePopup()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, config?.closeOnEscape, closePopup, isAnimating])

  return (
    <>
      {children}
      {/* Ensure popup container is rendered with maximum z-index */}
      <div style={{ position: 'relative', zIndex: 9999 }}>
        <PopupContainer
          isOpen={isOpen}
          isLoading={isLoading}
          isAnimating={isAnimating}
          config={config}
          onClose={handleCloseClick}
          onOutsideClick={handleOutsideClick}
        />
      </div>
    </>
  )
} 