import { Environment, OrbitControls } from "@react-three/drei";
import { MyRoom } from "./MyRoom";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <group>
      <Environment preset="sunset" />
      <mesh>
        <MyRoom />
      </mesh>
    </group>
    </>
  );
};