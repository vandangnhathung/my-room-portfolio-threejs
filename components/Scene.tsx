import React from 'react'
import { MyRoom } from './MyRoom'
import { useFrame } from '@react-three/fiber'

const Scene = (camera: any) => {

     useFrame(() => {
          console.log(camera.current.position)
          console.log(camera.current.rotation)
     })
  return (
     <MyRoom />
  )
}

export default Scene