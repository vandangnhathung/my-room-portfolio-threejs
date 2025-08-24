import { useMemo, useRef } from "react"
import * as THREE from "three"
import { TextureConfig } from "@/types/type"
import { useLoadingManagerContext } from '@/components/LoadingSystem';

export const useOptimizedTexture = (config: TextureConfig & { transparent?: boolean }): THREE.MeshStandardMaterial => {
  const manager = useLoadingManagerContext();
  const textureRef = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  
  return useMemo(() => {
    // Create a cache key for this texture configuration
    const cacheKey = `${config.path}-${config.colorSpace}-${config.flipY}-${config.generateMipmaps}-${config.transparent}`;
    
    // If we already have a material for this exact configuration, return it
    if (materialRef.current && materialRef.current.userData.cacheKey === cacheKey) {
      return materialRef.current;
    }
    
    // Only create new texture if we don't have one for this path
    if (!textureRef.current || textureRef.current.userData.path !== config.path) {
      const loader = new THREE.TextureLoader(manager);
      textureRef.current = loader.load(config.path);
      textureRef.current.userData.path = config.path; // Mark the texture with its path
    }
    
    // Configure texture properties
    textureRef.current.flipY = config.flipY;
    textureRef.current.colorSpace = config.colorSpace;
    textureRef.current.minFilter = THREE.NearestFilter;
    textureRef.current.magFilter = THREE.NearestFilter;
    textureRef.current.generateMipmaps = config.generateMipmaps;
    
    // Create new material with the texture and transparency support
    const material = new THREE.MeshStandardMaterial({ 
      map: textureRef.current,
      transparent: config.transparent || false,
      opacity: 1
    });
    material.userData.cacheKey = cacheKey;
    
    materialRef.current = material;
    return material;
  }, [config.path, config.colorSpace, config.flipY, config.generateMipmaps, config.transparent, manager]);
}
