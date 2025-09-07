import React, { useEffect, useRef } from 'react'
import { useToggleThemeStore } from '@/stores/toggleTheme'
import GUI from 'lil-gui'

const LightingGUI: React.FC = () => {
  const { lightingConfig, updateLighting } = useToggleThemeStore()
  const guiRef = useRef<GUI | null>(null)
  const guiContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!guiContainerRef.current) return

    // Create GUI instance
    guiRef.current = new GUI({ container: guiContainerRef.current })
    
    // Create objects that will be directly controlled by the GUI
    const sunLightObj = {
      color: { 
        r: lightingConfig.sunLight.color.r, 
        g: lightingConfig.sunLight.color.g, 
        b: lightingConfig.sunLight.color.b 
      },
      intensity: lightingConfig.sunLight.intensity
    }

    const ambientLightObj = {
      color: { 
        r: lightingConfig.ambientLight.color.r, 
        g: lightingConfig.ambientLight.color.g, 
        b: lightingConfig.ambientLight.color.b 
      },
      intensity: lightingConfig.ambientLight.intensity
    }

    // Add sun light controls
    const sunLightFolder = guiRef.current.addFolder('☀️ Sun Light')
    
    // Color control
    sunLightFolder.addColor(sunLightObj, 'color').onChange(() => {
      console.log('Sun color changed:', sunLightObj.color)
      updateLighting({
        sunLight: {
          ...lightingConfig.sunLight,
          color: { ...sunLightObj.color }
        }
      })
    })
    
    // Intensity control
    sunLightFolder.add(sunLightObj, 'intensity', 0, 10, 0.1).onChange(() => {
      console.log('Sun intensity changed to:', sunLightObj.intensity)
      updateLighting({
        sunLight: {
          ...lightingConfig.sunLight,
          intensity: sunLightObj.intensity
        }
      })
    })

    // Add ambient light controls
    const ambientLightFolder = guiRef.current.addFolder('💡 Ambient Light')
    
    // Color control
    ambientLightFolder.addColor(ambientLightObj, 'color').onChange(() => {
      console.log('Ambient color changed:', ambientLightObj.color)
      updateLighting({
        ambientLight: {
          ...lightingConfig.ambientLight,
          color: { ...ambientLightObj.color }
        }
      })
    })
    
    // Intensity control
    ambientLightFolder.add(ambientLightObj, 'intensity', 0, 5, 0.1).onChange(() => {
      console.log('Ambient intensity changed to:', ambientLightObj.intensity)
      updateLighting({
        ambientLight: {
          ...lightingConfig.ambientLight,
          intensity: ambientLightObj.intensity
        }
      })
    })

    // Cleanup function
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy()
        guiRef.current = null
      }
    }
  }, [lightingConfig.ambientLight, lightingConfig.sunLight, updateLighting])

  return (
    <div className="fixed z-50 top-4 right-4">
      <div ref={guiContainerRef} className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20" />
    </div>
  )
}

export default LightingGUI
