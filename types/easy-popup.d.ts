// Create a new file: types/easy-popup.d.ts (or add to your existing types file)

declare module '@viivue/easy-popup' {
    // This tells TypeScript that the module exists but we don't care about its types
  }
  
  // If you want more specific types, you can also declare the global interface:
  declare global {
    interface Window {
      EasyPopup: {
        init: (selector: string) => void
        get: (id: string) => {
          open: () => void
          close: () => void
          isOpen?: () => boolean
        } | null
      }
    }
  }