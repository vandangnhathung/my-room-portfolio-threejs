// ===== FILE: components/Experience.tsx (REPLACE EXISTING) =====
'use client'

import { Environment } from "@react-three/drei";
import { MyRoom } from "./MyRoom";
import { Suspense } from "react";
import { ThreeEvent } from '@react-three/fiber'

// Define proper event handler types
type PointerEventHandler = (event: ThreeEvent<PointerEvent>) => void

interface HoverHandlers {
  onPointerEnter: PointerEventHandler
  onPointerLeave: PointerEventHandler
  onPointerMove?: PointerEventHandler
  style: { cursor: string }
}

interface ExperienceProps {
  hoveredMesh: string | null
  createHoverHandlers: (meshName: string) => HoverHandlers
}

export const Experience: React.FC<ExperienceProps> = ({ hoveredMesh, createHoverHandlers }) => {
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
          <MyRoom 
            hoveredMesh={hoveredMesh}
            createHoverHandlers={createHoverHandlers}
          />
        </group>
      </Suspense>
    </>
  );
};