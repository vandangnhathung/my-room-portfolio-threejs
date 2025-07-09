'use client'

import { Environment } from "@react-three/drei";
import { MyRoom } from "./MyRoom";
import { Suspense } from "react";

export const Experience = () => {
  return (
    <>
      <Suspense fallback={null}>
        {/* Add black background */}
        <color attach="background" args={['#000000']} />
        
        <group>
          <Environment 
            preset="apartment" 
            blur={0.8} 
            environmentIntensity={0.8}
            background={false} // Disable environment background
          />
          <MyRoom />
        </group>
      </Suspense>
    </>
  );
};