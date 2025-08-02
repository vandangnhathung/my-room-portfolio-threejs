// ===== FILE: components/Experience.tsx (REPLACE EXISTING) =====
'use client'

import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import Scene from "./Scene";

export const Experience: React.FC = () => {
  return (
    <>
      <Suspense fallback={null}>
        <color attach="background" args={['#000000']} />
        <Environment 
            preset="apartment" 
            blur={0.8} 
            environmentIntensity={1.3}
            background={false}
          />
          <Scene />
      </Suspense>
    </>
  );
};