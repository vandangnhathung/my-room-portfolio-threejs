# Theme Switching System

This document explains how to use the simplified theme switching system that provides dynamic lighting control for your React Three Fiber 3D room.

## Overview

The theme switching system allows you to dynamically change the lighting in your 3D scene, similar to the vanilla Three.js Environment class you referenced. It includes:

- **Preset Themes**: Light and Dark lighting configurations
- **Real-time Controls**: Live adjustment of light colors and intensities using lil-gui
- **Smooth Transitions**: GSAP-powered animations for theme changes
- **State Management**: Zustand-based store for theme persistence

## Components

### 1. LightingSystem.tsx
The core component that manages Three.js lighting in your 3D scene.

**Features:**
- Directional light (sun) with shadows
- Ambient light for overall scene illumination
- Automatic theme-based lighting updates
- GSAP animations for smooth transitions

**Usage:**
```tsx
import LightingSystem from './LightingSystem'

// Add to your Scene component
<LightingSystem />
```

### 2. ThemeSelector.tsx
A UI component that provides preset theme options.

**Available Themes:**
- ☀️ **Light**: Bright daylight (default)
- 🌙 **Dark**: Night mode with blue tones

**Features:**
- Visual theme previews
- Smooth theme transitions
- Positioned in top-left corner

### 3. LightingGUI.tsx
Advanced lighting controls using the lil-gui library, similar to your vanilla Three.js example.

**Controls:**
- Color pickers for both sun and ambient lights
- Intensity sliders (0-10 for sun, 0-5 for ambient)
- Organized in collapsible folders
- Real-time updates to your 3D scene

**Features:**
- Uses lil-gui for professional-looking controls
- Organized in folders: "☀️ Sun Light" and "💡 Ambient Light"
- Immediate visual feedback
- Positioned in top-right corner

## Store Structure

### useToggleThemeStore
The Zustand store that manages theme state and lighting configurations.

**State:**
```typescript
interface ToggleThemeStore {
  currentTheme: ThemeType
  isDarkMode: boolean
  lightingConfig: LightingConfig
  toggleTheme: () => void
  setTheme: (theme: ThemeType) => void
  updateLighting: (config: Partial<LightingConfig>) => void
}
```

**Actions:**
- `toggleTheme()`: Switches between light and dark themes
- `setTheme(theme)`: Sets a specific theme
- `updateLighting(config)`: Updates individual lighting parameters

## Theme Configurations

Each theme has predefined lighting settings:

```typescript
const themeConfigs = {
  light: {
    sunLight: { color: { r: 1, g: 1, b: 1 }, intensity: 3 },
    ambientLight: { color: { r: 1, g: 1, b: 1 }, intensity: 1 }
  },
  dark: {
    sunLight: { color: { r: 0.17, g: 0.23, b: 0.69 }, intensity: 0.78 },
    ambientLight: { color: { r: 0.17, g: 0.23, b: 0.69 }, intensity: 0.78 }
  }
}
```

## Implementation Details

### Lighting Setup
The system creates two main lights:

1. **Directional Light (Sun)**
   - Position: [-1.5, 7, 3]
   - Casts shadows
   - High-quality shadow mapping (2048x2048)
   - Configurable color and intensity

2. **Ambient Light**
   - Provides overall scene illumination
   - Configurable color and intensity
   - No shadows, fills in dark areas

### Animation System
- Uses GSAP for smooth transitions
- 1-second duration with "power2.out" easing
- Animates both color and intensity simultaneously
- Prevents jarring lighting changes

### Performance Optimizations
- Stable refs prevent unnecessary re-renders
- Efficient state updates through Zustand
- Minimal DOM updates during theme changes

## Customization

### Adding New Themes
1. Define new theme in `themeConfigs`
2. Add theme option to `ThemeSelector`
3. Update `ThemeType` union type

### Modifying Lighting Parameters
1. Adjust ranges in lil-gui controls
2. Modify default values in `defaultLighting`
3. Update theme configurations as needed

### Styling
- All UI components use Tailwind CSS
- Backdrop blur and transparency effects
- Responsive design for different screen sizes

## Troubleshooting

### Common Issues

1. **Lights not updating**
   - Check if `LightingSystem` is added to Scene
   - Verify GSAP is properly imported
   - Ensure refs are properly initialized

2. **Performance issues**
   - Reduce shadow map size if needed
   - Check for excessive re-renders
   - Monitor GSAP animation performance

3. **GUI not visible**
   - Check z-index values
   - Verify component mounting order
   - Ensure proper positioning

### Debug Mode
Enable console logging by adding to your store:

```typescript
// In useToggleThemeStore
setTheme: (theme: ThemeType) => {
  console.log('Theme changed to:', theme)
  // ... rest of implementation
}
```

## Future Enhancements

- **Time-based themes**: Automatic theme switching based on time of day
- **Weather integration**: Dynamic lighting based on weather conditions
- **User preferences**: Save theme preferences in localStorage
- **Animation presets**: Different transition styles for theme changes
- **Material updates**: Theme-aware material adjustments

## Comparison with Vanilla Three.js

| Feature | Vanilla Three.js | React Three Fiber |
|---------|------------------|-------------------|
| Lighting Setup | Manual in constructor | Component-based |
| Theme Switching | Method calls | State-driven |
| Animation | GSAP on light objects | GSAP with refs |
| State Management | None | Zustand store |
| UI Controls | lil-gui | lil-gui integration |
| Performance | Direct object manipulation | Optimized re-renders |

The React Three Fiber implementation provides better integration with React's component system while maintaining the same functionality as your vanilla Three.js Environment class, including the use of lil-gui for professional lighting controls.
