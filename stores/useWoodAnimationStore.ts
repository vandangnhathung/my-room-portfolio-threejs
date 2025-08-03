'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import * as THREE from 'three'
import gsap from 'gsap'

interface WoodAnimationStore {
  // Mesh references
  woodMeshRefs: Map<string, React.RefObject<THREE.Mesh | null>>
  
  // Animation state
  isAnimating: boolean
  animationCompleted: boolean
  
  // Actions
  registerWoodMesh: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void
  animateWoodMeshes: () => Promise<void>
  resetAnimation: () => void
}

const WOOD_ANIMATION_ORDER = ['wood_1', 'wood_1001', 'wood_2', 'wood_4', 'wood_3']

export const useWoodAnimationStore = create<WoodAnimationStore>()(
  subscribeWithSelector((set, get) => ({
    woodMeshRefs: new Map(),
    isAnimating: false,
    animationCompleted: false,
    
    registerWoodMesh: (name: string, ref: React.RefObject<THREE.Mesh | null>) => {
      const { woodMeshRefs } = get()
      const newMap = new Map(woodMeshRefs)
      newMap.set(name, ref)
      set({ woodMeshRefs: newMap })
    },
    
    animateWoodMeshes: async () => {
      const { woodMeshRefs, isAnimating } = get()
      
      if (isAnimating) return
      
      set({ isAnimating: true })
      
      return new Promise<void>((resolve) => {
        const timeline = gsap.timeline({
          onComplete: () => {
            set({ isAnimating: false, animationCompleted: true })
            resolve()
          }
        })
        
        // Initially hide all wood meshes
        WOOD_ANIMATION_ORDER.forEach(meshName => {
          const meshRef = woodMeshRefs.get(meshName)
          if (meshRef?.current) {
            gsap.set(meshRef.current.scale, { x: 0, y: 0, z: 0 })
            gsap.set(meshRef.current, { visible: true })
          }
        })
        
        // Animate wood meshes in order with staggered timing
        WOOD_ANIMATION_ORDER.forEach((meshName, index) => {
          const meshRef = woodMeshRefs.get(meshName)
          if (meshRef?.current) {
            timeline.to(meshRef.current.scale, {
              x: 1,
              y: 1, 
              z: 1,
              duration: 0.6,
              ease: "back.out(1.7)",
            }, index * 0.3) // Stagger each animation by 0.3 seconds
          }
        })
      })
    },
    
    resetAnimation: () => {
      set({ isAnimating: false, animationCompleted: false })
    }
  }))
)

// Individual selector hooks to prevent infinite loops
export const useWoodMeshRefs = () => useWoodAnimationStore(state => state.woodMeshRefs)

export const useWoodAnimationState = () => useWoodAnimationStore(
  useShallow(state => ({ 
    isAnimating: state.isAnimating, 
    animationCompleted: state.animationCompleted 
  }))
)

// Individual action selectors to prevent re-renders
export const useRegisterWoodMesh = () => useWoodAnimationStore(state => state.registerWoodMesh)
export const useAnimateWoodMeshes = () => useWoodAnimationStore(state => state.animateWoodMeshes)
export const useResetWoodAnimation = () => useWoodAnimationStore(state => state.resetAnimation)

// Combined actions hook using useShallow for proper comparison
export const useWoodAnimationActions = () => useWoodAnimationStore(
  useShallow(state => ({
    registerWoodMesh: state.registerWoodMesh,
    animateWoodMeshes: state.animateWoodMeshes,
    resetAnimation: state.resetAnimation
  }))
) 