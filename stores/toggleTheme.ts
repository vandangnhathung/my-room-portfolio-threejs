import { create } from "zustand"
import { subscribeWithSelector } from 'zustand/middleware'

export type ThemeType = 'light' | 'dark'

interface LightingConfig {
  sunLight: {
    color: { r: number; g: number; b: number }
    intensity: number
  }
  ambientLight: {
    color: { r: number; g: number; b: number }
    intensity: number
  }
}

interface ToggleThemeStore {
  currentTheme: ThemeType
  isDarkMode: boolean
  lightingConfig: LightingConfig
  toggleTheme: () => void
  setTheme: (theme: ThemeType) => void
  updateLighting: (config: Partial<LightingConfig>) => void
}

const defaultLighting: LightingConfig = {
  sunLight: {
    color: { r: 1, g: 0.85, b: 0.6 }, // Much warmer golden sunlight
    intensity: 3
  },
  ambientLight: {
    color: { r: 0.95, g: 0.9, b: 0.8 }, // Very warm ambient glow
    intensity: 2
  }
}

const themeConfigs: Record<ThemeType, LightingConfig> = {
  light: {
    sunLight: {
      color: { r: 1, g: 0.85, b: 0.6 }, // Much warmer golden sunlight
      intensity: 3
    },
    ambientLight: {
      color: { r: 0.95, g: 0.9, b: 0.8 }, // Very warm ambient glow
      intensity: 2
    }
  },
  dark: {
    sunLight: {
      color: { r: 0.17254901960784313, g: 0.23137254901960785, b: 0.6862745098039216 },
      intensity: 0.3
    },
    ambientLight: {
      color: { r: 0.17254901960784313, g: 0.23137254901960785, b: 0.6862745098039216 },
      intensity: 0.2
    }
  }
}

export const useToggleThemeStore = create<ToggleThemeStore>()(
  subscribeWithSelector((set, get) => ({
    currentTheme: 'light',
    isDarkMode: false,
    lightingConfig: themeConfigs.light, // Use themeConfigs instead of defaultLighting
    
    toggleTheme: () => set((state) => {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light'
      const newConfig = themeConfigs[newTheme]
      return {
        currentTheme: newTheme,
        isDarkMode: newTheme === 'dark',
        lightingConfig: newConfig
      }
    }),
    
    setTheme: (theme: ThemeType) => set((state) => {
      const newConfig = themeConfigs[theme]
      return {
        currentTheme: theme,
        isDarkMode: theme === 'dark',
        lightingConfig: newConfig
      }
    }),
    
    updateLighting: (config: Partial<LightingConfig>) => set((state) => ({
      lightingConfig: {
        ...state.lightingConfig,
        ...config
      }
    }))
  }))
)

// Export theme configs for external use
export { themeConfigs }