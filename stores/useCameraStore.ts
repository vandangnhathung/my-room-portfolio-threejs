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

interface CameraStore {
  isCameraFocused: boolean
  setIsCameraFocused: (focused: boolean) => void
  focusOnScreen: (orbitControlsRef: OrbitControlsRef, camera: THREE.Camera, isMobile: boolean, meshRefs?: MeshRefs) => void
  focusOnCertificate: (orbitControlsRef: OrbitControlsRef, camera: THREE.Camera, isMobile: boolean) => void
  resetCamera: (shouldReset: boolean) => void
  setPointerDisableCallback: (callback: (() => void) | null) => void
}

export const useCameraStore = create<CameraStore>((set, get) => {
  let originalConstraintsRef: ConstraintsState | null = null
  let storedOrbitControlsRef: OrbitControlsRef | null = null
  let cameraRef: THREE.Camera | null = null
  let isMobileRef: boolean = false
  let meshRefsRef: MeshRefs | null = null
  let pointerDisableCallback: (() => void) | null = null

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
    
    focusOnScreen: (orbitControlsRef, camera, isMobile, meshRefs) => {
      if (get().isCameraFocused || !orbitControlsRef.current) return

      // Disable pointer immediately when focusOnScreen is called
      if (pointerDisableCallback) {
        pointerDisableCallback()
      }

      // Store references for resetCamera
      storedOrbitControlsRef = orbitControlsRef
      cameraRef = camera
      isMobileRef = isMobile
      meshRefsRef = meshRefs || null

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

    focusOnCertificate: (orbitControlsRef, camera, isMobile) => {
      if (get().isCameraFocused || !orbitControlsRef.current) return

      // Store references for resetCamera
      storedOrbitControlsRef = orbitControlsRef
      cameraRef = camera
      isMobileRef = isMobile

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
    },

    resetCamera: (shouldReset: boolean) => {
      if (!shouldReset || !storedOrbitControlsRef?.current || !cameraRef) return

      // Show chair BEFORE animation starts
      const chairRef = meshRefsRef?.current.get('Executive_office_chair_raycaster')
      if (chairRef?.current) {
        chairRef.current.visible = true
      }

      // Set state to false BEFORE animation
      set({ isCameraFocused: false })

      const tl = gsap.timeline({ 
        ease: "power3.inOut",
        onComplete: () => {
          restoreConstraints(storedOrbitControlsRef!)
          originalConstraintsRef = null
        }
      })

      const targetPos = isMobileRef 
        ? cameraFocusPositions.initialTarget.mobile 
        : cameraFocusPositions.initialTarget.desktop
      
      const cameraPos = isMobileRef 
        ? cameraFocusPositions.initial.mobile 
        : cameraFocusPositions.initial.desktop

      tl.to(storedOrbitControlsRef.current.target, {
        x: targetPos[0], y: targetPos[1], z: targetPos[2], duration: 1.4,
      })
      .to(cameraRef.position, {
        x: cameraPos[0], y: cameraPos[1], z: cameraPos[2], duration: 1.4,
      }, "-=1.4")
    },

    setPointerDisableCallback: (callback: (() => void) | null) => {
      pointerDisableCallback = callback
    },
  }
})