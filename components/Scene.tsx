import React, { useRef } from 'react'
import { MyRoom } from './MyRoom'
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'

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
}    

const Scene = ({ orbitControlsRef, pointerRef }: SceneProps) => {
     
     const groupRef = useRef<THREE.Group>(null)
     const groupRotationRef = useRef<number>(0)

     useFrame(() => {
          if(!groupRef.current) return;

          console.log(pointerRef)

          const targetRotation = pointerRef.current.x * Math.PI * 0.25
        
          groupRotationRef.current = THREE.MathUtils.lerp(groupRotationRef.current, targetRotation, 0.1)

          if (groupRef.current) {
               groupRef.current.rotation.y = groupRotationRef.current
          }
     })


  return (
     <group ref={groupRef}>
      <MyRoom orbitControlsRef={orbitControlsRef} />
     </group>
  )
}

export default Scene