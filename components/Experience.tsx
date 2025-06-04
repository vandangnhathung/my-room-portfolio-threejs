import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { MyRoom } from "./MyRoom";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <PerspectiveCamera 
        makeDefault 
        position={[5, 5, 5]} 
        fov={45}
        near={0.1}
        far={1000}
      />
      <group>
        <Environment preset="sunset" />
        <mesh>
          <MyRoom />
        </mesh>
      </group>
    </>
  );
};