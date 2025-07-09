import { useSpring } from "@react-spring/three"

export const useHoverAnimation = (meshName: string, originalScale: number | [number, number, number], hoveredMesh: string | null) => {
    return useSpring({
      scale: hoveredMesh === meshName 
        ? (Array.isArray(originalScale) 
            ? originalScale.map((s: number) => s * 1.2) 
            : originalScale * 1.2) 
        : originalScale,
      config: { tension: 300, friction: 20 }
    })
  }