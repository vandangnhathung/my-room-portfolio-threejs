import { create } from 'zustand'
import { gsap } from 'gsap'
import { cameraFocusPositions } from '@/data/camera-focus-position'
import * as THREE from 'three'

interface OrbitControlsRef {
  current: {
    target: { x: number; y: number; z: number }
    enabled: boolean
    minDistance: number
    maxDistance: number
    minPolarAngle: number
    maxPolarAngle: number
    minAzimuthAngle: number
    maxAzimuthAngle: number
  } | null
}

interface MeshRefs {
  current: Map<string, React.RefObject<THREE.Mesh | null>>
}

interface ConstraintsState {
  minDistance: number
  maxDistance: number
  minPolarAngle: number
  maxPolarAngle: number
  minAzimuthAngle: number
  maxAzimuthAngle: number
}

interface CameraState {
  isCameraFocused: boolean
  setIsCameraFocused: (focused: boolean) => void
  focusOnScreen: (orbitControlsRef: OrbitControlsRef, camera: THREE.Camera, isMobile: boolean, meshRefs?: MeshRefs) => void
  focusOnScreen001: (orbitControlsRef: OrbitControlsRef, camera: THREE.Camera, isMobile: boolean) => void
  resetCamera: (orbitControlsRef: OrbitControlsRef, camera: THREE.Camera, isMobile: boolean, meshRefs?: MeshRefs) => void
}

export const useCameraStore = create<CameraState>((set, get) => {
  let originalConstraintsRef: ConstraintsState | null = null

  const storeOriginalConstraints = (orbitControlsRef: OrbitControlsRef) => {
    if (orbitControlsRef.current && !originalConstraintsRef) {
      originalConstraintsRef = {
        minDistance: orbitControlsRef.current.minDistance,
        maxDistance: orbitControlsRef.current.maxDistance,
        minPolarAngle: orbitControlsRef.current.minPolarAngle,
        maxPolarAngle: orbitControlsRef.current.maxPolarAngle,
        minAzimuthAngle: orbitControlsRef.current.minAzimuthAngle,
        maxAzimuthAngle: orbitControlsRef.current.maxAzimuthAngle,
      }
    }
  }

  const removeConstraints = (orbitControlsRef: OrbitControlsRef) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.minDistance = 0
      orbitControlsRef.current.maxDistance = Infinity
      orbitControlsRef.current.minPolarAngle = 0
      orbitControlsRef.current.maxPolarAngle = Math.PI
      orbitControlsRef.current.minAzimuthAngle = -Infinity
      orbitControlsRef.current.maxAzimuthAngle = Infinity
    }
  }

  const restoreConstraints = (orbitControlsRef: OrbitControlsRef) => {
    if (orbitControlsRef.current && originalConstraintsRef) {
      orbitControlsRef.current.minDistance = originalConstraintsRef.minDistance
      orbitControlsRef.current.maxDistance = originalConstraintsRef.maxDistance
      orbitControlsRef.current.minPolarAngle = originalConstraintsRef.minPolarAngle
      orbitControlsRef.current.maxPolarAngle = originalConstraintsRef.maxPolarAngle
      orbitControlsRef.current.minAzimuthAngle = originalConstraintsRef.minAzimuthAngle
      orbitControlsRef.current.maxAzimuthAngle = originalConstraintsRef.maxAzimuthAngle
    }
  }

  return {
    isCameraFocused: false,
    setIsCameraFocused: (focused: boolean) => set({ isCameraFocused: focused }),
    focusOnScreen: (orbitControlsRef, camera, isMobile) => {
      if (get().isCameraFocused || !orbitControlsRef.current) return

      storeOriginalConstraints(orbitControlsRef)
      removeConstraints(orbitControlsRef)

      const tl = gsap.timeline({ 
        ease: "power3.inOut",
        onComplete: () => {
          set({ isCameraFocused: true })
        }
      })
      
      const targetPos = isMobile 
        ? cameraFocusPositions.screenFocused.target.mobile 
        : cameraFocusPositions.screenFocused.target.desktop
      
      const cameraPos = isMobile 
        ? cameraFocusPositions.screenFocused.camera.mobile 
        : cameraFocusPositions.screenFocused.camera.desktop

      tl.to(orbitControlsRef.current.target, {
        x: targetPos[0], y: targetPos[1], z: targetPos[2], duration: 1,
      })
      .to(camera.position, {
        x: cameraPos[0], y: cameraPos[1], z: cameraPos[2], duration: 1,
      }, "-=1")
    },

    focusOnScreen001: (orbitControlsRef, camera, isMobile) => {
      if (get().isCameraFocused || !orbitControlsRef.current) return

      storeOriginalConstraints(orbitControlsRef)
      removeConstraints(orbitControlsRef)

      const tl = gsap.timeline({ 
        ease: "power3.inOut",
        onComplete: () => {
          set({ isCameraFocused: true })
        }
      })
      
      const targetPos = isMobile 
        ? cameraFocusPositions.screen001Focused.target.mobile 
        : cameraFocusPositions.screen001Focused.target.desktop
      
      const cameraPos = isMobile 
        ? cameraFocusPositions.screen001Focused.camera.mobile 
        : cameraFocusPositions.screen001Focused.camera.desktop

      tl.to(orbitControlsRef.current.target, {
        x: targetPos[0], y: targetPos[1], z: targetPos[2], duration: 1,
      })
      .to(camera.position, {
        x: cameraPos[0], y: cameraPos[1], z: cameraPos[2], duration: 1,
      }, "-=1")
    },

    resetCamera: (orbitControlsRef, camera, isMobile, meshRefs) => {
      if (!orbitControlsRef.current) return

      // Show chair BEFORE animation starts
      const chairRef = meshRefs?.current.get('Executive_office_chair_raycaster')
      if (chairRef?.current) {
        chairRef.current.visible = true
      }

      // Set state to false BEFORE animation
      set({ isCameraFocused: false })

      const tl = gsap.timeline({ 
        ease: "power3.inOut",
        onComplete: () => {
          restoreConstraints(orbitControlsRef)
          originalConstraintsRef = null
        }
      })

      const targetPos = isMobile 
        ? cameraFocusPositions.initialTarget.mobile 
        : cameraFocusPositions.initialTarget.desktop
      
      const cameraPos = isMobile 
        ? cameraFocusPositions.initial.mobile 
        : cameraFocusPositions.initial.desktop

      tl.to(orbitControlsRef.current.target, {
        x: targetPos[0], y: targetPos[1], z: targetPos[2], duration: 1.4,
      })
      .to(camera.position, {
        x: cameraPos[0], y: cameraPos[1], z: cameraPos[2], duration: 1.4,
      }, "-=1.4")
    },
  }
})