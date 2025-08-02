import React from 'react'
import { MyRoom } from './MyRoom'

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
}

const Scene = ({ orbitControlsRef }: SceneProps) => {
  return (
    <MyRoom orbitControlsRef={orbitControlsRef} />
  )
}

export default Scene