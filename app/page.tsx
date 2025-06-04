"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { Suspense } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraLogger() {
  const { camera } = useThree();
  
  useFrame(() => {
    const isPerspectiveCamera = camera instanceof THREE.PerspectiveCamera;
    console.log('Camera Details:', {
      position: {
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2)
      },
      rotation: {
        x: camera.rotation.x.toFixed(2),
        y: camera.rotation.y.toFixed(2),
        z: camera.rotation.z.toFixed(2)
      },
      ...(isPerspectiveCamera && { fov: (camera as THREE.PerspectiveCamera).fov }),
      zoom: camera.zoom
    });
  });

  return null;
}

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
