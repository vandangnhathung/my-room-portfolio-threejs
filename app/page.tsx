"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { Suspense, useEffect } from "react";
import * as THREE from "three";

// Resize handler component that runs inside the Canvas
function ResizeHandler() {
  const { camera, gl, size } = useThree();

  useEffect(() => {
    const handleResize = () => {
      // Update sizes
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Update Camera
      (camera as THREE.PerspectiveCamera).aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Update renderer
      gl.setSize(width, height);
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [camera, gl]);

  console.log(camera)
  return null; // This component doesn't render anything
}

export default function Home() {
  return (
    <Canvas 
      className="canvas h-full w-full" 
      camera={{ 
        position: [-2.74, 9.25, -3.10], 
        rotation: [-2.39, -0.82, -2.54], 
        fov: 75, 
        near: 0.1, 
        far: 1000, 
        zoom: 1 
      }}
    >
      <color attach="background" args={["#ececec"]} />
      <ResizeHandler />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}