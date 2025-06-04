"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { Suspense } from "react";

export default function Home() {
  return (
    <Canvas className="canvas h-full w-full" camera={{ position: [-2.74, 9.25, -3.10], rotation: [-2.39, -0.82, -2.54], fov: 75, near: 0.1, far: 1000, zoom: 1 }}>
      <color attach="background" args={["#ececec"]} />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
