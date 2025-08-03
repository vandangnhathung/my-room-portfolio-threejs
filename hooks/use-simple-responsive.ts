import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const useSimpleResponsive = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleResize = () => {
      // Update viewport size
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Update camera aspect ratio
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height
        
        // Adjust FOV based on screen size for better mobile experience
        if (width <= 768) {
          // Mobile: wider FOV for better scene visibility
          camera.fov = width <= 480 ? 65 : 60
        } else if (width <= 1024) {
          // Tablet: medium FOV
          camera.fov = 50
        } else {
          // Desktop: standard FOV
          camera.fov = 45
        }
        
        camera.updateProjectionMatrix()
      }

      // Update renderer size
      gl.setSize(width, height)
      gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }

    // Initial setup
    handleResize()
    
    // Add event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [camera, gl])
} 