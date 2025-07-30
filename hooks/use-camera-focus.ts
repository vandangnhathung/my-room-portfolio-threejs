import { useCallback, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { cameraFocusPositions } from '@/data/camera-focus-position'
import { useCameraStore } from '@/stores/useCameraStore'
import * as THREE from 'three'

interface ConstraintsState {
  minDistance: number
  maxDistance: number
  minPolarAngle: number
  maxPolarAngle: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
}

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
  isMobile: boolean = false,
  meshRefs?: React.MutableRefObject<Map<string, React.RefObject<THREE.Mesh | null>>>
) => {
  const { camera } = useThree()
  const originalConstraintsRef = useRef<ConstraintsState | null>(null)
  
  // Use Zustand store instead of local state
  const { isCameraFocused, setIsCameraFocused } = useCameraStore()

  const storeOriginalConstraints = () => {
    if (orbitControlsRef.current && !originalConstraintsRef.current) {
      originalConstraintsRef.current = {
        minDistance: orbitControlsRef.current.minDistance,
        maxDistance: orbitControlsRef.current.maxDistance,
        minPolarAngle: orbitControlsRef.current.minPolarAngle,
        maxPolarAngle: orbitControlsRef.current.maxPolarAngle,
        minAzimuthAngle: orbitControlsRef.current.minAzimuthAngle,
        maxAzimuthAngle: orbitControlsRef.current.maxAzimuthAngle,
      }
    }
  }

  const removeConstraints = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.minDistance = 0
      orbitControlsRef.current.maxDistance = Infinity
      orbitControlsRef.current.minPolarAngle = 0
      orbitControlsRef.current.maxPolarAngle = Math.PI
      orbitControlsRef.current.minAzimuthAngle = -Infinity
      orbitControlsRef.current.maxAzimuthAngle = Infinity
    }
  }

  const restoreConstraints = () => {
    if (orbitControlsRef.current && originalConstraintsRef.current) {
      orbitControlsRef.current.minDistance = originalConstraintsRef.current.minDistance
      orbitControlsRef.current.maxDistance = originalConstraintsRef.current.maxDistance
      orbitControlsRef.current.minPolarAngle = originalConstraintsRef.current.minPolarAngle
      orbitControlsRef.current.maxPolarAngle = originalConstraintsRef.current.maxPolarAngle
      orbitControlsRef.current.minAzimuthAngle = originalConstraintsRef.current.minAzimuthAngle
      orbitControlsRef.current.maxAzimuthAngle = originalConstraintsRef.current.maxAzimuthAngle
    }
  }

  const focusOnScreen = useCallback(() => {
    if (isCameraFocused || !orbitControlsRef.current) return

    storeOriginalConstraints()
    removeConstraints()

    const tl = gsap.timeline({ 
      ease: "power3.inOut",
      onComplete: () => {
        setIsCameraFocused(true)
      }
    })
    
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
  }, [isCameraFocused, orbitControlsRef, camera, isMobile, setIsCameraFocused])

  const focusOnScreen001 = useCallback(() => {
    if (isCameraFocused || !orbitControlsRef.current) return

    storeOriginalConstraints()
    removeConstraints()

    const tl = gsap.timeline({ 
      ease: "power3.inOut",
      onComplete: () => {
        setIsCameraFocused(true)
      }
    })
    
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
  }, [isCameraFocused, orbitControlsRef, camera, isMobile, setIsCameraFocused])

  const resetCamera = useCallback(() => {
    if (!orbitControlsRef.current) return

    // Show chair BEFORE animation starts
    const chairRef = meshRefs?.current.get('Executive_office_chair_raycaster')
    if (chairRef?.current) {
      chairRef.current.visible = true
    }

    // Set state to false BEFORE animation
    setIsCameraFocused(false)

    const tl = gsap.timeline({ 
      ease: "power3.inOut",
      onComplete: () => {
        restoreConstraints()
        originalConstraintsRef.current = null
      }
    })

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
  }, [orbitControlsRef, camera, isMobile, meshRefs, setIsCameraFocused])

  return {
    isCameraFocused,
    focusOnScreen,
    focusOnScreen001,
    resetCamera,
  }
}