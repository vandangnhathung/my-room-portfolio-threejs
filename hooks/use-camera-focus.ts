import { useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { cameraFocusPositions } from '@/data/camera-focus-position'

interface CameraFocusHook {
  isCameraFocused: boolean
  focusOnScreen: () => void
  focusOnScreen001: () => void
  focusOnCertificate: () => void
  resetCamera: () => void
}

export const useCameraFocus = (
  orbitControlsRef: React.MutableRefObject<{ target: { x: number; y: number; z: number } } | null>,
  isMobile: boolean = false
): CameraFocusHook => {
  const { camera } = useThree()
  const [isCameraFocused, setIsCameraFocused] = useState(false)

  const focusOnScreen = useCallback(() => {
    if (isCameraFocused || !orbitControlsRef.current) return

    const tl = gsap.timeline({ ease: "power3.inOut" })
    
    const targetPos = isMobile 
      ? cameraFocusPositions.screenFocused.target.mobile 
      : cameraFocusPositions.screenFocused.target.desktop
    
    const cameraPos = isMobile 
      ? cameraFocusPositions.screenFocused.camera.mobile 
      : cameraFocusPositions.screenFocused.camera.desktop

    tl.to(orbitControlsRef.current.target, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1,
    })
    .to(camera.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 1,
    }, "-=1")
    .call(() => {
      setIsCameraFocused(true)
    })
  }, [isCameraFocused, orbitControlsRef, camera, isMobile])

  const focusOnScreen001 = useCallback(() => {
    if (isCameraFocused || !orbitControlsRef.current) return

    const tl = gsap.timeline({ ease: "power3.inOut" })
    
    const targetPos = isMobile 
      ? cameraFocusPositions.screen001Focused.target.mobile 
      : cameraFocusPositions.screen001Focused.target.desktop
    
    const cameraPos = isMobile 
      ? cameraFocusPositions.screen001Focused.camera.mobile 
      : cameraFocusPositions.screen001Focused.camera.desktop

    tl.to(orbitControlsRef.current.target, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1,
    })
    .to(camera.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 1,
    }, "-=1")
    .call(() => {
      setIsCameraFocused(true)
    })
  }, [isCameraFocused, orbitControlsRef, camera, isMobile])

  const focusOnCertificate = useCallback(() => {
    if (isCameraFocused || !orbitControlsRef.current) return

    const tl = gsap.timeline({ ease: "power3.inOut" })
    
    const targetPos = isMobile 
      ? cameraFocusPositions.screenFocused.target.mobile 
      : cameraFocusPositions.screenFocused.target.desktop
    
    const cameraPos = isMobile 
      ? cameraFocusPositions.screenFocused.camera.mobile 
      : cameraFocusPositions.screenFocused.camera.desktop

    tl.to(orbitControlsRef.current.target, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1,
    })
    .to(camera.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 1,
    }, "-=1")
    .call(() => {
      setIsCameraFocused(true)
    })
  }, [isCameraFocused, orbitControlsRef, camera, isMobile])

  const resetCamera = useCallback(() => {
    if (!orbitControlsRef.current) return

    setIsCameraFocused(false)

    const tl = gsap.timeline({ ease: "power3.inOut" })

    const targetPos = isMobile 
      ? cameraFocusPositions.initialTarget.mobile 
      : cameraFocusPositions.initialTarget.desktop
    
    const cameraPos = isMobile 
      ? cameraFocusPositions.initial.mobile 
      : cameraFocusPositions.initial.desktop

    tl.to(orbitControlsRef.current.target, {
      x: targetPos[0],
      y: targetPos[1],
      z: targetPos[2],
      duration: 1.4,
    })
    .to(camera.position, {
      x: cameraPos[0],
      y: cameraPos[1],
      z: cameraPos[2],
      duration: 1.4,
    }, "-=1.4")
  }, [orbitControlsRef, camera, isMobile])

  return {
    isCameraFocused,
    focusOnScreen,
    focusOnScreen001,
    focusOnCertificate,
    resetCamera
  }
}    