import React, { useRef } from 'react'
import { MyRoom } from './MyRoom'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import { useCameraStore } from '../stores/useCameraStore'

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
  pointerRef: React.RefObject<{ x: number, y: number }>
  disablePointerRef: React.RefObject<(() => void) | null>
}    

const Scene = ({ orbitControlsRef, pointerRef, disablePointerRef }: SceneProps) => {
     
     const groupRef = useRef<THREE.Group>(null)
     const groupRotationRef = useRef<number>(0)
     const isPointerDisabled = useRef<boolean>(false)
     
     const { isCameraFocused, setPointerDisableCallback } = useCameraStore()

     // Create disable function and assign to ref and store
     React.useEffect(() => {
       const disableFunction = () => {
         isPointerDisabled.current = true
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
     }, [disablePointerRef, setPointerDisableCallback])

     // Re-enable pointer when camera focus is reset
     React.useEffect(() => {
       if (!isCameraFocused) {
         isPointerDisabled.current = false
       }
     }, [isCameraFocused])

     useFrame(() => {
          if(!groupRef.current) return;
          
          // Disable pointer rotation when disabled flag is set
          if (isPointerDisabled.current) return;

          console.log(pointerRef)

          const targetRotation = pointerRef.current.x * Math.PI * 0.25
        
          groupRotationRef.current = THREE.MathUtils.lerp(groupRotationRef.current, targetRotation, 0.1)

          if (groupRef.current) {
               groupRef.current.rotation.y = groupRotationRef.current
          }
     })

  return (
     <group ref={groupRef}>
       <MyRoom orbitControlsRef={orbitControlsRef} disablePointerRef={disablePointerRef} />
     </group>
   )
}

export default Scene