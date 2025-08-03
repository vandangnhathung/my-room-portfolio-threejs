import { create } from 'zustand'

interface PointerStore {
  x: number
  y: number
  isDisabled: boolean
  setPointer: (x: number, y: number) => void
  setDisabled: (disabled: boolean) => void
  reset: () => void
}

export const usePointerStore = create<PointerStore>((set, get) => ({
  x: 0,
  y: 0,
  isDisabled: false,
  
  setPointer: (x: number, y: number) => {
    // Only update if not disabled to avoid unnecessary state changes
    if (!get().isDisabled) {
      set({ x, y })
    }
  },
  
  setDisabled: (disabled: boolean) => {
    set({ isDisabled: disabled })
    // Reset pointer position when disabled
    if (disabled) {
      set({ x: 0, y: 0 })
    }
  },
  
  reset: () => set({ x: 0, y: 0, isDisabled: false }),
}))

// Performance-optimized selector hooks to prevent unnecessary re-renders
export const usePointerX = () => usePointerStore(state => state.x)
export const usePointerY = () => usePointerStore(state => state.y)
export const usePointerDisabled = () => usePointerStore(state => state.isDisabled)

// Stable action selectors - these don't create new objects
export const useSetPointer = () => usePointerStore(state => state.setPointer)
export const useSetPointerDisabled = () => usePointerStore(state => state.setDisabled)
export const useResetPointer = () => usePointerStore(state => state.reset) 