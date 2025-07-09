'use client'

import { useEffect } from 'react'
// Import Easy Popup from npm package
import "@viivue/easy-popup"

// TypeScript declaration for EasyPopup
declare global {
  interface Window {
    EasyPopup: {
      init: (selector: string, options?: any) => void;
      get: (id: string) => {
        open: () => void;
        close: () => void;
        toggle: () => void;
        on: (event: string, callback: (data: any) => void) => void;
      };
      setDev: (isDev: boolean) => void;
    };
  }
}

// Popup content configurations
const popupConfigs = {
  'screen-popup': {
    title: 'Main Screen',
    content: (
      <div>
        <h2>Main Screen Information</h2>
        <p>You clicked on the main screen! This is an interactive display.</p>
        <div style={{marginTop: '20px'}}>
          <h3>Screen Features:</h3>
          <ul>
            <li>4K Ultra HD Resolution</li>
            <li>Touch-enabled Interface</li>
            <li>Real-time Data Display</li>
            <li>Multi-application Support</li>
          </ul>
          <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
            <strong>Status:</strong> Active and Ready
          </div>
        </div>
      </div>
    )
  },
  'screen001-popup': {
    title: 'Secondary Screen',
    content: (
      <div>
        <h2>Secondary Screen</h2>
        <p>This is the secondary display with extended functionality!</p>
        <div style={{marginTop: '20px'}}>
          <h3>Secondary Screen Features:</h3>
          <ul>
            <li>Extended Desktop Mode</li>
            <li>Mirror Display Available</li>
            <li>Video Conferencing Ready</li>
            <li>Presentation Mode</li>
          </ul>
          <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#e8f4f8', borderRadius: '5px'}}>
            <strong>Current Mode:</strong> Extended Display
          </div>
        </div>
      </div>
    )
  }
}

// Popup Manager Component
export const PopupManager = () => {
  useEffect(() => {
    // Initialize popups when component mounts
    const initializePopups = () => {
      if (typeof window !== 'undefined' && window.EasyPopup) {
        try {
          // Initialize all popups
          window.EasyPopup.init('[data-easy-popup]', {
            theme: 'right-side',
            closeButtonInnerText: '✕',
            clickOutsideToClose: true,
            keyboard: true,
            preventScroll: true
          })
          console.log('Popups initialized successfully')
        } catch (error) {
          console.log('Popups already initialized or error:', error)
        }
      } else {
        // Retry if EasyPopup isn't loaded yet
        setTimeout(initializePopups, 100)
      }
    }

    initializePopups()
  }, [])

  return (
    <>
      {/* Popup HTML content */}
      {Object.entries(popupConfigs).map(([id, config]) => (
        <div key={id} data-easy-popup={id} style={{maxWidth: '500px'}}>
          {config.content}
        </div>
      ))}
    </>
  )
}

// Hook for managing popups
export const usePopupManager = () => {
  const openPopup = (popupId: string) => {
    if (typeof window !== 'undefined' && window.EasyPopup) {
      try {
        const popup = window.EasyPopup.get(popupId)
        if (popup) {
          popup.open()
        }
      } catch (error) {
        console.error('Error opening popup:', error)
      }
    }
  }

  const closePopup = (popupId: string) => {
    if (typeof window !== 'undefined' && window.EasyPopup) {
      try {
        const popup = window.EasyPopup.get(popupId)
        if (popup) {
          popup.close()
        }
      } catch (error) {
        console.error('Error closing popup:', error)
      }
    }
  }

  const togglePopup = (popupId: string) => {
    if (typeof window !== 'undefined' && window.EasyPopup) {
      try {
        const popup = window.EasyPopup.get(popupId)
        if (popup) {
          popup.toggle()
        }
      } catch (error) {
        console.error('Error toggling popup:', error)
      }
    }
  }

  return {
    openPopup,
    closePopup,
    togglePopup
  }
}

// Example usage component
export const PopupTestButtons = () => {
  const { openPopup } = usePopupManager()

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <button 
        onClick={() => openPopup('screen-popup')}
        style={{
          marginRight: '10px',
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Screen Popup
      </button>
      <button 
        onClick={() => openPopup('screen001-popup')}
        style={{
          padding: '8px 12px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Screen001 Popup
      </button>
    </div>
  )
}