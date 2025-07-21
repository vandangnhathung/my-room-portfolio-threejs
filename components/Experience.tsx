// ===== FILE: components/Experience.tsx (REPLACE EXISTING) =====
'use client'

import { Environment } from "@react-three/drei";
import { MyRoom } from "./MyRoom";
import { Suspense } from "react";

export const Experience: React.FC = () => {
  return (
    <>
      <Suspense fallback={null}>
        <color attach="background" args={['#000000']} />
        
        <group>
          <Environment 
            preset="apartment" 
            blur={0.8} 
            environmentIntensity={1.3}
            background={false}
          />
          <MyRoom />
        </group>
      </Suspense>
    </>
  );
};