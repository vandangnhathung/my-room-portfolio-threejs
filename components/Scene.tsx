import React, { useRef, useCallback } from 'react'
import { MyRoom } from './MyRoom'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useCameraStore } from '../stores/useCameraStore'
import { usePointerX, useSetPointerDisabled } from '../stores/usePointerStore'

interface SceneProps {
  orbitControlsRef: React.RefObject<{ 
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  } | null>
  disablePointerRef: React.RefObject<(() => void) | null>
}    

const SceneComponent = ({ orbitControlsRef, disablePointerRef }: SceneProps) => {
     
     const groupRef = useRef<THREE.Group>(null)
     const groupRotationRef = useRef<number>(0)
     const isPointerDisabled = useRef<boolean>(false)
     
     // Use optimized pointer store
     const pointerX = usePointerX()
     const setDisabled = useSetPointerDisabled()
     
     const { isCameraFocused, setPointerDisableCallback } = useCameraStore()

     // Create disable function and assign to ref and store
     React.useEffect(() => {
       const disableFunction = () => {
         isPointerDisabled.current = true
         setDisabled(true)
         // Reset group rotation to 0 when focusing on screen
         if (groupRef.current) {
           groupRef.current.rotation.y = 0
           groupRotationRef.current = 0
         }
       }
       
       if (disablePointerRef.current) {
         disablePointerRef.current = disableFunction
       }
       
       // Set the callback in the camera store
       setPointerDisableCallback(disableFunction)
       
       return () => {
         setPointerDisableCallback(null)
       }
     }, [disablePointerRef, setPointerDisableCallback, setDisabled])

     // Re-enable pointer when camera focus is reset
     React.useEffect(() => {
       if (!isCameraFocused) {
         isPointerDisabled.current = false
         setDisabled(false)
       }
     }, [isCameraFocused, setDisabled])

     // Stable useFrame callback - only recreated if dependencies change
     const animationCallback = useCallback(() => {
       if (!groupRef.current) return;
       
       // Disable pointer rotation when disabled flag is set
       if (isPointerDisabled.current) return;

       // Use optimized zustand store value
       const targetRotation = pointerX * Math.PI * 0.25
     
       // CAUTION: > 0.025 causing lag with the iframe
       groupRotationRef.current = THREE.MathUtils.lerp(groupRotationRef.current, targetRotation, 0.02)

       groupRef.current.rotation.y = groupRotationRef.current
     }, [pointerX]) // Only recreate when pointerX changes

     useFrame(animationCallback)

  return (
    <group ref={groupRef}>
      <MyRoom orbitControlsRef={orbitControlsRef} disablePointerRef={disablePointerRef} />
    </group>
  )
}

export default React.memo(SceneComponent, (prev, next) => {
  return prev.orbitControlsRef === next.orbitControlsRef && prev.disablePointerRef === next.disablePointerRef
})