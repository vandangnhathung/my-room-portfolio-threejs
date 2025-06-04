import { Environment } from "@react-three/drei";
import { MyRoom } from "./MyRoom";
import { Suspense } from "react";


export const Experience = () => {
  
  return (
    <>
    <Suspense fallback={null}>
      <group>
        <Environment preset="apartment" blur={0.8} environmentIntensity={0.8}/>
          <MyRoom />
      </group>
    </Suspense>
    </>
  );
};