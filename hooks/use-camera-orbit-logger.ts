import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'

interface UseCameraOrbitLoggerOptions {
  logInterval?: number
  enabled?: boolean
  logOnChange?: boolean
}

/**
 * Hook for logging camera and orbit controls data
 * Useful for debugging camera positions and rotations
 */
export const useCameraOrbitLogger = (
  orbitControlsRef: React.RefObject<OrbitControls | null>,
  options: UseCameraOrbitLoggerOptions = {}
) => {
  const { camera } = useThree()
  const { 
    logInterval = 1000, 
    enabled = false, // Disabled by default to prevent console spam
    logOnChange = true 
  } = options

  const lastCameraPos = useRef({ x: 0, y: 0, z: 0 })
  const lastTargetPos = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    if (!enabled) return // Early return if disabled

    const logCameraAndTarget = () => {
      const currentCameraPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      const currentTargetPos = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }

      // Only log if positions have changed (when logOnChange is true)
      if (logOnChange) {
        const cameraChanged = (
          Math.abs(currentCameraPos.x - lastCameraPos.current.x) > 0.01 ||
          Math.abs(currentCameraPos.y - lastCameraPos.current.y) > 0.01 ||
          Math.abs(currentCameraPos.z - lastCameraPos.current.z) > 0.01
        )

        const targetChanged = (
          Math.abs(currentTargetPos.x - lastTargetPos.current.x) > 0.01 ||
          Math.abs(currentTargetPos.y - lastTargetPos.current.y) > 0.01 ||
          Math.abs(currentTargetPos.z - lastTargetPos.current.z) > 0.01
        )

        if (!cameraChanged && !targetChanged) {
          return // Don't log if nothing changed
        }
      }

      const logData = {
        camera: {
          position: currentCameraPos,
          rotation: {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z
          }
        },
        orbitControls: {
          target: currentTargetPos
        },
        timestamp: new Date().toISOString()
      }

      // Only log when explicitly enabled for debugging
      if (enabled) {
        console.log('Camera & OrbitControls Data:', logData)
      }

      // Update last known positions
      lastCameraPos.current = currentCameraPos
      lastTargetPos.current = currentTargetPos
    }

    // Log initial values only if enabled
    if (enabled) {
      logCameraAndTarget()
    }

    // Set up interval for continuous logging only if enabled
    const interval = enabled ? setInterval(logCameraAndTarget, logInterval) : null

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [camera, orbitControlsRef, logInterval, enabled, logOnChange])

  // Return functions to manually log current values (only when needed for debugging)
  const logCurrentValues = () => {
    if (!enabled) return

    const currentCameraPos = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }

    const currentTargetPos = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }

    console.log('Current Camera Position:', currentCameraPos)
    console.log('Current OrbitControls Target:', currentTargetPos)
  }

  const logCameraPosition = () => {
    if (!enabled) return
    
    console.log('Camera Position:', {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    })
  }

  const logOrbitTarget = () => {
    if (!enabled) return
    
    const target = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }
    console.log('OrbitControls Target:', target)
  }

  return {
    logCurrentValues,
    logCameraPosition,
    logOrbitTarget
  }
} 