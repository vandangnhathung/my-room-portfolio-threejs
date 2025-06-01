"use client";

import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";

export default function Home() {
  return (
    <Canvas className="canvas h-full w-full" shadows camera={{ position: [3, 3, 3], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
}
