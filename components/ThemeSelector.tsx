import React from 'react'
import { useToggleThemeStore, ThemeType } from '@/stores/toggleTheme'

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme } = useToggleThemeStore()

  const themes: { type: ThemeType; label: string; description: string }[] = [
    { type: 'light', label: '☀️ Light', description: 'Bright daylight' },
    { type: 'dark', label: '🌙 Dark', description: 'Night mode' }
  ]

  return (
    <div className="fixed z-50 top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <h3 className="text-white text-sm font-medium mb-3">Lighting Themes</h3>
      <div className="space-y-2">
        {themes.map((theme) => (
          <button
            key={theme.type}
            onClick={() => setTheme(theme.type)}
            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 ${
              currentTheme === theme.type
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm">{theme.label}</span>
              {currentTheme === theme.type && (
                <span className="text-xs">✓</span>
              )}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {theme.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector
