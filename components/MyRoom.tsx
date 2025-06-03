import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {[key: string]: THREE.Material}
}

type MyRoomProps = React.JSX.IntrinsicElements['group']

export function MyRoom(props: MyRoomProps) {
  // Cast to unknown first, then to GLTFResult to handle type incompatibility
  const { nodes, materials } = useGLTF('/models/Room_Portfolio.glb') as unknown as GLTFResult;
  
  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="World"
          castShadow
          receiveShadow
          geometry={nodes.World.geometry as THREE.BufferGeometry}
          material={nodes.World.material}
          position={[4.708, 28.521, -1.236]}
          scale={-28.087}
        />
        <mesh
          name="Cylinder036"
          castShadow
          receiveShadow
          geometry={nodes.Cylinder036.geometry as THREE.BufferGeometry}
          material={nodes.Cylinder036.material}
          position={[1.102, 11.241, -1.992]}
          rotation={[0, 0, Math.PI]}
          scale={0.97}
        />
        <mesh
          name="room"
          castShadow
          receiveShadow
          geometry={nodes.room.geometry as THREE.BufferGeometry}
          material={nodes.room.material}
          position={[-4.857, 4.109, 3.491]}
          rotation={[1.158, 1.511, -1.09]}
          scale={0.327}
        />
        <mesh
          name="player_button"
          castShadow
          receiveShadow
          geometry={nodes.player_button.geometry as THREE.BufferGeometry}
          material={nodes.player_button.material}
          position={[-1.952, 4.711, 2.358]}
          scale={0.23}
        />
        <mesh
          name="Plane007"
          castShadow
          receiveShadow
          geometry={nodes.Plane007.geometry as THREE.BufferGeometry}
          material={nodes.Plane007.material}
          position={[4.034, 4.149, 0.89]}
          rotation={[0, 0, 0.002]}
          scale={[0.283, 0.287, 0.271]}
        />
        <mesh
          name="Cube062"
          castShadow
          receiveShadow
          geometry={nodes.Cube062.geometry as THREE.BufferGeometry}
          material={nodes.Cube062.material}
          position={[4.264, 4.152, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube063"
          castShadow
          receiveShadow
          geometry={nodes.Cube063.geometry as THREE.BufferGeometry}
          material={nodes.Cube063.material}
          position={[4.264, 4.152, 0.731]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube066"
          castShadow
          receiveShadow
          geometry={nodes.Cube066.geometry as THREE.BufferGeometry}
          material={nodes.Cube066.material}
          position={[4.264, 4.152, 0.795]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube068"
          castShadow
          receiveShadow
          geometry={nodes.Cube068.geometry as THREE.BufferGeometry}
          material={nodes.Cube068.material}
          position={[4.264, 4.152, 0.858]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube069"
          castShadow
          receiveShadow
          geometry={nodes.Cube069.geometry as THREE.BufferGeometry}
          material={nodes.Cube069.material}
          position={[4.264, 4.152, 0.922]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube070"
          castShadow
          receiveShadow
          geometry={nodes.Cube070.geometry as THREE.BufferGeometry}
          material={nodes.Cube070.material}
          position={[4.264, 4.152, 0.985]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube071"
          castShadow
          receiveShadow
          geometry={nodes.Cube071.geometry as THREE.BufferGeometry}
          material={nodes.Cube071.material}
          position={[4.264, 4.152, 1.049]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube072"
          castShadow
          receiveShadow
          geometry={nodes.Cube072.geometry as THREE.BufferGeometry}
          material={nodes.Cube072.material}
          position={[4.264, 4.152, 1.112]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube073"
          castShadow
          receiveShadow
          geometry={nodes.Cube073.geometry as THREE.BufferGeometry}
          material={nodes.Cube073.material}
          position={[4.264, 4.152, 1.176]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube074"
          castShadow
          receiveShadow
          geometry={nodes.Cube074.geometry as THREE.BufferGeometry}
          material={nodes.Cube074.material}
          position={[4.264, 4.152, 1.239]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube075"
          castShadow
          receiveShadow
          geometry={nodes.Cube075.geometry as THREE.BufferGeometry}
          material={nodes.Cube075.material}
          position={[4.264, 4.152, 1.303]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube076"
          castShadow
          receiveShadow
          geometry={nodes.Cube076.geometry as THREE.BufferGeometry}
          material={nodes.Cube076.material}
          position={[4.264, 4.152, 1.366]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube077"
          castShadow
          receiveShadow
          geometry={nodes.Cube077.geometry as THREE.BufferGeometry}
          material={nodes.Cube077.material}
          position={[4.264, 4.152, 1.43]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube078"
          castShadow
          receiveShadow
          geometry={nodes.Cube078.geometry as THREE.BufferGeometry}
          material={nodes.Cube078.material}
          position={[4.264, 4.152, 1.493]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube079"
          castShadow
          receiveShadow
          geometry={nodes.Cube079.geometry as THREE.BufferGeometry}
          material={nodes.Cube079.material}
          position={[4.264, 4.152, 1.557]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube080"
          castShadow
          receiveShadow
          geometry={nodes.Cube080.geometry as THREE.BufferGeometry}
          material={nodes.Cube080.material}
          position={[4.264, 4.152, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube081"
          castShadow
          receiveShadow
          geometry={nodes.Cube081.geometry as THREE.BufferGeometry}
          material={nodes.Cube081.material}
          position={[4.201, 4.151, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube082"
          castShadow
          receiveShadow
          geometry={nodes.Cube082.geometry as THREE.BufferGeometry}
          material={nodes.Cube082.material}
          position={[4.201, 4.151, 0.731]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube083"
          castShadow
          receiveShadow
          geometry={nodes.Cube083.geometry as THREE.BufferGeometry}
          material={nodes.Cube083.material}
          position={[4.201, 4.151, 0.795]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube084"
          castShadow
          receiveShadow
          geometry={nodes.Cube084.geometry as THREE.BufferGeometry}
          material={nodes.Cube084.material}
          position={[4.201, 4.151, 0.858]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube085"
          castShadow
          receiveShadow
          geometry={nodes.Cube085.geometry as THREE.BufferGeometry}
          material={nodes.Cube085.material}
          position={[4.201, 4.151, 0.922]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube086"
          castShadow
          receiveShadow
          geometry={nodes.Cube086.geometry as THREE.BufferGeometry}
          material={nodes.Cube086.material}
          position={[4.201, 4.151, 0.985]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube087"
          castShadow
          receiveShadow
          geometry={nodes.Cube087.geometry as THREE.BufferGeometry}
          material={nodes.Cube087.material}
          position={[4.201, 4.151, 1.049]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube088"
          castShadow
          receiveShadow
          geometry={nodes.Cube088.geometry as THREE.BufferGeometry}
          material={nodes.Cube088.material}
          position={[4.201, 4.151, 1.112]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube089"
          castShadow
          receiveShadow
          geometry={nodes.Cube089.geometry as THREE.BufferGeometry}
          material={nodes.Cube089.material}
          position={[4.201, 4.151, 1.176]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube090"
          castShadow
          receiveShadow
          geometry={nodes.Cube090.geometry as THREE.BufferGeometry}
          material={nodes.Cube090.material}
          position={[4.201, 4.151, 1.239]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube091"
          castShadow
          receiveShadow
          geometry={nodes.Cube091.geometry as THREE.BufferGeometry}
          material={nodes.Cube091.material}
          position={[4.201, 4.151, 1.303]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube092"
          castShadow
          receiveShadow
          geometry={nodes.Cube092.geometry as THREE.BufferGeometry}
          material={nodes.Cube092.material}
          position={[4.201, 4.151, 1.366]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube093"
          castShadow
          receiveShadow
          geometry={nodes.Cube093.geometry as THREE.BufferGeometry}
          material={nodes.Cube093.material}
          position={[4.201, 4.151, 1.43]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube094"
          castShadow
          receiveShadow
          geometry={nodes.Cube094.geometry as THREE.BufferGeometry}
          material={nodes.Cube094.material}
          position={[4.201, 4.151, 1.493]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube096"
          castShadow
          receiveShadow
          geometry={nodes.Cube096.geometry as THREE.BufferGeometry}
          material={nodes.Cube096.material}
          position={[4.201, 4.151, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube095"
          castShadow
          receiveShadow
          geometry={nodes.Cube095.geometry as THREE.BufferGeometry}
          material={nodes.Cube095.material}
          position={[4.139, 4.15, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube097"
          castShadow
          receiveShadow
          geometry={nodes.Cube097.geometry as THREE.BufferGeometry}
          material={nodes.Cube097.material}
          position={[4.139, 4.15, 0.749]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube098"
          castShadow
          receiveShadow
          geometry={nodes.Cube098.geometry as THREE.BufferGeometry}
          material={nodes.Cube098.material}
          position={[4.139, 4.15, 0.813]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube099"
          castShadow
          receiveShadow
          geometry={nodes.Cube099.geometry as THREE.BufferGeometry}
          material={nodes.Cube099.material}
          position={[4.139, 4.15, 0.876]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube100"
          castShadow
          receiveShadow
          geometry={nodes.Cube100.geometry as THREE.BufferGeometry}
          material={nodes.Cube100.material}
          position={[4.139, 4.15, 0.94]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube101"
          castShadow
          receiveShadow
          geometry={nodes.Cube101.geometry as THREE.BufferGeometry}
          material={nodes.Cube101.material}
          position={[4.139, 4.15, 1.003]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube102"
          castShadow
          receiveShadow
          geometry={nodes.Cube102.geometry as THREE.BufferGeometry}
          material={nodes.Cube102.material}
          position={[4.139, 4.15, 1.067]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube103"
          castShadow
          receiveShadow
          geometry={nodes.Cube103.geometry as THREE.BufferGeometry}
          material={nodes.Cube103.material}
          position={[4.139, 4.15, 1.13]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube104"
          castShadow
          receiveShadow
          geometry={nodes.Cube104.geometry as THREE.BufferGeometry}
          material={nodes.Cube104.material}
          position={[4.139, 4.15, 1.194]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube105"
          castShadow
          receiveShadow
          geometry={nodes.Cube105.geometry as THREE.BufferGeometry}
          material={nodes.Cube105.material}
          position={[4.139, 4.15, 1.257]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube106"
          castShadow
          receiveShadow
          geometry={nodes.Cube106.geometry as THREE.BufferGeometry}
          material={nodes.Cube106.material}
          position={[4.139, 4.15, 1.321]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube107"
          castShadow
          receiveShadow
          geometry={nodes.Cube107.geometry as THREE.BufferGeometry}
          material={nodes.Cube107.material}
          position={[4.139, 4.15, 1.384]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube108"
          castShadow
          receiveShadow
          geometry={nodes.Cube108.geometry as THREE.BufferGeometry}
          material={nodes.Cube108.material}
          position={[4.139, 4.15, 1.448]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube109"
          castShadow
          receiveShadow
          geometry={nodes.Cube109.geometry as THREE.BufferGeometry}
          material={nodes.Cube109.material}
          position={[4.139, 4.15, 1.493]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube110"
          castShadow
          receiveShadow
          geometry={nodes.Cube110.geometry as THREE.BufferGeometry}
          material={nodes.Cube110.material}
          position={[4.139, 4.15, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube111"
          castShadow
          receiveShadow
          geometry={nodes.Cube111.geometry as THREE.BufferGeometry}
          material={nodes.Cube111.material}
          position={[4.077, 4.149, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube112"
          castShadow
          receiveShadow
          geometry={nodes.Cube112.geometry as THREE.BufferGeometry}
          material={nodes.Cube112.material}
          position={[4.077, 4.149, 0.788]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube113"
          castShadow
          receiveShadow
          geometry={nodes.Cube113.geometry as THREE.BufferGeometry}
          material={nodes.Cube113.material}
          position={[4.077, 4.149, 0.852]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube114"
          castShadow
          receiveShadow
          geometry={nodes.Cube114.geometry as THREE.BufferGeometry}
          material={nodes.Cube114.material}
          position={[4.077, 4.149, 0.915]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube115"
          castShadow
          receiveShadow
          geometry={nodes.Cube115.geometry as THREE.BufferGeometry}
          material={nodes.Cube115.material}
          position={[4.077, 4.149, 0.979]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube116"
          castShadow
          receiveShadow
          geometry={nodes.Cube116.geometry as THREE.BufferGeometry}
          material={nodes.Cube116.material}
          position={[4.077, 4.149, 1.042]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube117"
          castShadow
          receiveShadow
          geometry={nodes.Cube117.geometry as THREE.BufferGeometry}
          material={nodes.Cube117.material}
          position={[4.077, 4.149, 1.106]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube118"
          castShadow
          receiveShadow
          geometry={nodes.Cube118.geometry as THREE.BufferGeometry}
          material={nodes.Cube118.material}
          position={[4.077, 4.149, 1.169]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube119"
          castShadow
          receiveShadow
          geometry={nodes.Cube119.geometry as THREE.BufferGeometry}
          material={nodes.Cube119.material}
          position={[4.077, 4.149, 1.233]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube120"
          castShadow
          receiveShadow
          geometry={nodes.Cube120.geometry as THREE.BufferGeometry}
          material={nodes.Cube120.material}
          position={[4.077, 4.149, 1.296]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube121"
          castShadow
          receiveShadow
          geometry={nodes.Cube121.geometry as THREE.BufferGeometry}
          material={nodes.Cube121.material}
          position={[4.077, 4.149, 1.36]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube122"
          castShadow
          receiveShadow
          geometry={nodes.Cube122.geometry as THREE.BufferGeometry}
          material={nodes.Cube122.material}
          position={[4.077, 4.149, 1.423]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube124"
          castShadow
          receiveShadow
          geometry={nodes.Cube124.geometry as THREE.BufferGeometry}
          material={nodes.Cube124.material}
          position={[4.077, 4.149, 1.493]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube125"
          castShadow
          receiveShadow
          geometry={nodes.Cube125.geometry as THREE.BufferGeometry}
          material={nodes.Cube125.material}
          position={[4.077, 4.149, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube123"
          castShadow
          receiveShadow
          geometry={nodes.Cube123.geometry as THREE.BufferGeometry}
          material={nodes.Cube123.material}
          position={[4.015, 4.148, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube126"
          castShadow
          receiveShadow
          geometry={nodes.Cube126.geometry as THREE.BufferGeometry}
          material={nodes.Cube126.material}
          position={[4.015, 4.148, 0.817]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube127"
          castShadow
          receiveShadow
          geometry={nodes.Cube127.geometry as THREE.BufferGeometry}
          material={nodes.Cube127.material}
          position={[4.015, 4.148, 0.881]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube128"
          castShadow
          receiveShadow
          geometry={nodes.Cube128.geometry as THREE.BufferGeometry}
          material={nodes.Cube128.material}
          position={[4.015, 4.148, 0.944]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube129"
          castShadow
          receiveShadow
          geometry={nodes.Cube129.geometry as THREE.BufferGeometry}
          material={nodes.Cube129.material}
          position={[4.015, 4.148, 1.008]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube130"
          castShadow
          receiveShadow
          geometry={nodes.Cube130.geometry as THREE.BufferGeometry}
          material={nodes.Cube130.material}
          position={[4.015, 4.148, 1.071]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube131"
          castShadow
          receiveShadow
          geometry={nodes.Cube131.geometry as THREE.BufferGeometry}
          material={nodes.Cube131.material}
          position={[4.015, 4.148, 1.135]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube132"
          castShadow
          receiveShadow
          geometry={nodes.Cube132.geometry as THREE.BufferGeometry}
          material={nodes.Cube132.material}
          position={[4.015, 4.148, 1.198]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube133"
          castShadow
          receiveShadow
          geometry={nodes.Cube133.geometry as THREE.BufferGeometry}
          material={nodes.Cube133.material}
          position={[4.015, 4.148, 1.262]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube134"
          castShadow
          receiveShadow
          geometry={nodes.Cube134.geometry as THREE.BufferGeometry}
          material={nodes.Cube134.material}
          position={[4.015, 4.148, 1.325]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube135"
          castShadow
          receiveShadow
          geometry={nodes.Cube135.geometry as THREE.BufferGeometry}
          material={nodes.Cube135.material}
          position={[4.015, 4.148, 1.389]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube137"
          castShadow
          receiveShadow
          geometry={nodes.Cube137.geometry as THREE.BufferGeometry}
          material={nodes.Cube137.material}
          position={[4.015, 4.148, 1.43]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube138"
          castShadow
          receiveShadow
          geometry={nodes.Cube138.geometry as THREE.BufferGeometry}
          material={nodes.Cube138.material}
          position={[4.015, 4.148, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube136"
          castShadow
          receiveShadow
          geometry={nodes.Cube136.geometry as THREE.BufferGeometry}
          material={nodes.Cube136.material}
          position={[4.015, 4.148, 1.556]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube149"
          castShadow
          receiveShadow
          geometry={nodes.Cube149.geometry as THREE.BufferGeometry}
          material={nodes.Cube149.material}
          position={[3.952, 4.147, 1.303]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube139"
          castShadow
          receiveShadow
          geometry={nodes.Cube139.geometry as THREE.BufferGeometry}
          material={nodes.Cube139.material}
          position={[3.952, 4.147, 0.668]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube140"
          castShadow
          receiveShadow
          geometry={nodes.Cube140.geometry as THREE.BufferGeometry}
          material={nodes.Cube140.material}
          position={[3.952, 4.147, 0.746]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube141"
          castShadow
          receiveShadow
          geometry={nodes.Cube141.geometry as THREE.BufferGeometry}
          material={nodes.Cube141.material}
          position={[3.952, 4.147, 0.824]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube142"
          castShadow
          receiveShadow
          geometry={nodes.Cube142.geometry as THREE.BufferGeometry}
          material={nodes.Cube142.material}
          position={[3.952, 4.147, 0.903]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube143"
          castShadow
          receiveShadow
          geometry={nodes.Cube143.geometry as THREE.BufferGeometry}
          material={nodes.Cube143.material}
          position={[3.953, 4.147, 1.366]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube144"
          castShadow
          receiveShadow
          geometry={nodes.Cube144.geometry as THREE.BufferGeometry}
          material={nodes.Cube144.material}
          position={[3.953, 4.147, 1.429]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube145"
          castShadow
          receiveShadow
          geometry={nodes.Cube145.geometry as THREE.BufferGeometry}
          material={nodes.Cube145.material}
          position={[3.953, 4.147, 1.493]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube146"
          castShadow
          receiveShadow
          geometry={nodes.Cube146.geometry as THREE.BufferGeometry}
          material={nodes.Cube146.material}
          position={[3.953, 4.147, 1.556]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="Cube147"
          castShadow
          receiveShadow
          geometry={nodes.Cube147.geometry as THREE.BufferGeometry}
          material={nodes.Cube147.material}
          position={[3.953, 4.147, 1.62]}
          rotation={[0, 0, 0.018]}
        />
        <mesh
          name="headphone"
          castShadow
          receiveShadow
          geometry={nodes.headphone.geometry as THREE.BufferGeometry}
          material={nodes.headphone.material}
          position={[4.97, 4.326, 0.103]}
          rotation={[0, 0.4, -Math.PI]}
          scale={[0.135, 0.158, 0.135]}
        />
        <mesh
          name="bulb"
          castShadow
          receiveShadow
          geometry={nodes.bulb.geometry as THREE.BufferGeometry}
          material={nodes.bulb.material}
          position={[1.123, 10.81, -1.984]}
          scale={0.093}
        />
        <mesh
          name="led_bulb"
          castShadow
          receiveShadow
          geometry={nodes.led_bulb.geometry as THREE.BufferGeometry}
          material={nodes.led_bulb.material}
          position={[6.646, 5.626, 1.613]}
          rotation={[0, 0, 1.578]}
        />
        <mesh
          name="workspace"
          castShadow
          receiveShadow
          geometry={nodes.workspace.geometry as THREE.BufferGeometry}
          material={nodes.workspace.material}
          position={[5.884, 4.22, -0.896]}
          scale={0.01}
        />
        <mesh
          name="guitar"
          castShadow
          receiveShadow
          geometry={nodes.guitar.geometry as THREE.BufferGeometry}
          material={nodes.guitar.material}
          position={[3.849, 4.601, -6.452]}
          rotation={[1.735, -0.324, 2.095]}
          scale={[0.148, 0.357, 1.369]}
        />
        <mesh
          name="camera"
          castShadow
          receiveShadow
          geometry={nodes.camera.geometry as THREE.BufferGeometry}
          material={nodes.camera.material}
          position={[5.437, 4.351, 3.307]}
          rotation={[0, 0.425, 0]}
          scale={0.344}
        />
        <mesh
          name="sofa"
          castShadow
          receiveShadow
          geometry={nodes.sofa.geometry as THREE.BufferGeometry}
          material={nodes.sofa.material}
          position={[7.448, 2.556, -4.774]}
          rotation={[-0.078, -0.158, -0.46]}
          scale={1.384}
        />
        <mesh
          name="screen_0"
          castShadow
          receiveShadow
          geometry={nodes.screen_0.geometry as THREE.BufferGeometry}
          material={nodes.screen_0.material}
          position={[5.978, 4.22, -0.896]}
          scale={0.01}
        />
        <mesh
          name="screen_1"
          castShadow
          receiveShadow
          geometry={nodes.screen_1.geometry as THREE.BufferGeometry}
          material={nodes.screen_1.material}
          position={[5.971, 4.22, -0.896]}
          rotation={[0, -0.005, 0]}
          scale={0.01}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/models/Room_Portfolio.glb')