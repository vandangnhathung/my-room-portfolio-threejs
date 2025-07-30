import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'

interface CameraOrbitLoggerOptions {
  logInterval?: number // in milliseconds, default 1000ms
  enabled?: boolean // whether to enable logging, default true
  logOnChange?: boolean // log only when values change, default false
}

export const useCameraOrbitLogger = (
  orbitControlsRef: React.MutableRefObject<{ 
    target: { x: number; y: number; z: number }
  } | null>,
  options: CameraOrbitLoggerOptions = {}
) => {
  const { camera } = useThree()
  const { 
    logInterval = 1000, 
    enabled = true, 
    logOnChange = false 
  } = options

  const lastCameraPos = useRef({ x: 0, y: 0, z: 0 })
  const lastTargetPos = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    if (!enabled) return

    const logCameraAndTarget = () => {
      const currentCameraPos = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }

      const currentTargetPos = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }

      // Only log if values changed (when logOnChange is true)
      if (logOnChange) {
        const cameraChanged = 
          currentCameraPos.x !== lastCameraPos.current.x ||
          currentCameraPos.y !== lastCameraPos.current.y ||
          currentCameraPos.z !== lastCameraPos.current.z

        const targetChanged = 
          currentTargetPos.x !== lastTargetPos.current.x ||
          currentTargetPos.y !== lastTargetPos.current.y ||
          currentTargetPos.z !== lastTargetPos.current.z

        if (!cameraChanged && !targetChanged) {
          return
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

      console.log('Camera & OrbitControls Data:', logData)

      // Update last known positions
      lastCameraPos.current = currentCameraPos
      lastTargetPos.current = currentTargetPos
    }

    // Log initial values
    logCameraAndTarget()

    // Set up interval for continuous logging
    const interval = setInterval(logCameraAndTarget, logInterval)

    return () => clearInterval(interval)
  }, [camera, orbitControlsRef, logInterval, enabled, logOnChange])

  // Return functions to manually log current values
  const logCurrentValues = () => {
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
    console.log('Camera Position:', {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    })
  }

  const logOrbitTarget = () => {
    const target = orbitControlsRef.current?.target || { x: 0, y: 0, z: 0 }
    console.log('OrbitControls Target:', target)
  }

  return { 
    logCurrentValues, 
    logCameraPosition, 
    logOrbitTarget 
  }
} 