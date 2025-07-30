import { create } from 'zustand'

interface CameraState {
  isCameraFocused: boolean
  setIsCameraFocused: (focused: boolean) => void
  resetCameraFocus: () => void
}

export const useCameraStore = create<CameraState>((set) => ({
  isCameraFocused: false,
  setIsCameraFocused: (focused: boolean) => set({ isCameraFocused: focused }),
  resetCameraFocus: () => set({ isCameraFocused: false }),
})) 