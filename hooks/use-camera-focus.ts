import { useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'

export const useCameraFocus = (
  orbitControlsRef: React.MutableRefObject<{ 
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  } | null>,
  isMobile: boolean = false
) => {
  const { camera } = useThree()
  const [isCameraFocused, setIsCameraFocused] = useState(false)

  const focusOnScreen = useCallback(() => {
    if (!orbitControlsRef.current || !camera) return

    const targetPos = isMobile
      ? { x: 5.287, y: 6.189, z: -0.05 }
      : { x: 5.287, y: 6.189, z: -0.05 }

    const cameraPos = isMobile
      ? { x: 5.287, y: 6.189, z: 2 }
      : { x: 5.287, y: 6.189, z: 2 }

    // Animate camera to screen position
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.target.x = targetPos.x
          orbitControlsRef.current.target.y = targetPos.y
          orbitControlsRef.current.target.z = targetPos.z
        }
      },
      onComplete: () => {
        setIsCameraFocused(true)
      }
    })
  }, [isCameraFocused, orbitControlsRef, camera, isMobile, setIsCameraFocused])

  const resetCamera = useCallback(() => {
    if (!orbitControlsRef.current || !camera) return

    const targetPos = isMobile
      ? { x: 0, y: 2, z: 0 }
      : { x: 0, y: 2, z: 0 }

    const cameraPos = isMobile
      ? { x: 0, y: 2, z: 5 }
      : { x: 0, y: 2, z: 5 }

    // Animate camera back to initial position
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.target.x = targetPos.x
          orbitControlsRef.current.target.y = targetPos.y
          orbitControlsRef.current.target.z = targetPos.z
        }
      },
      onComplete: () => {
        setIsCameraFocused(false)
      }
    })
  }, [orbitControlsRef, camera, isMobile, setIsCameraFocused])

  const focusOnCertificate = useCallback(() => {
    if (!orbitControlsRef.current || !camera) return

    const targetPos = isMobile
      ? { x: 5.287, y: 6.189, z: -0.05 }
      : { x: 5.287, y: 6.189, z: -0.05 }

    const cameraPos = isMobile
      ? { x: 5.287, y: 6.189, z: 2 }
      : { x: 5.287, y: 6.189, z: 2 }

    // Animate camera to certificate position
    gsap.to(camera.position, {
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.target.x = targetPos.x
          orbitControlsRef.current.target.y = targetPos.y
          orbitControlsRef.current.target.z = targetPos.z
        }
      },
      onComplete: () => {
        setIsCameraFocused(true)
      }
    })
  }, [orbitControlsRef, camera, isMobile, setIsCameraFocused])

  return {
    isCameraFocused,
    focusOnScreen,
    focusOnCertificate,
    resetCamera
  }
}