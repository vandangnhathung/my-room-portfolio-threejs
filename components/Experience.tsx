import { Environment, OrbitControls } from "@react-three/drei";
import { MyRoom } from "./MyRoom";
import { Suspense } from "react";


export const Experience = () => {
  
  return (
    <>
    <Suspense fallback={null}>
      <group>
        <Environment preset="city"/>
          <MyRoom />
      </group>
    </Suspense>
    </>
  );
};