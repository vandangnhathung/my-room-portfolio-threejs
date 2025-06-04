"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { Suspense } from "react";

export default function Home() {
  return (
    <Canvas className="canvas h-full w-full" shadows camera={{ position: [1, 1, 1], fov: 65 }}>
      <color attach="background" args={["#ececec"]} />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
