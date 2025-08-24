"use client"
import Lenis from 'lenis'
import React, { useEffect, useRef } from 'react'
import { useMainGroupRef, useMeshRefs } from '@/stores/useMeshesAnimationStore'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
// Register ScrollTrigger plugin

gsap.registerPlugin(ScrollTrigger)

const ScrollArea = ({ children }: { children: React.ReactNode }) => {
     // Get the main group ref for animation
     const meshRefs = useMeshRefs()
     const mainGroupRef = useMainGroupRef()
     const lenisRef = useRef<Lenis | null>(null)
     const scrollTriggerRef = useRef<{ animation: gsap.core.Tween, animation2: gsap.core.Tween } | null>(null)
     
     useEffect(() => {
          const lenis = new Lenis({
            autoRaf: true,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            duration: 1.2,
          })
          lenisRef.current = lenis
        
          // 🔗 Sync Lenis -> ScrollTrigger
          const onLenisScroll = () => ScrollTrigger.update()
          lenis.on?.('scroll', onLenisScroll)
        
          lenis.start()
        
          return () => {
            lenis.off?.('scroll', onLenisScroll)
            lenis.destroy()
          }
        }, [])
        
        useEffect(() => {
          const pinHeightBody = document.body
          const canvasContainer = document.querySelector('.canvas-container') as HTMLElement | null
          const group = mainGroupRef.current
          const worldMeshRef = meshRefs.get('world')
        
          if (!group || !canvasContainer) return
        
          // --- 2) Tween position theo cuộn (KHÔNG pin ở đây)


          const tween1 = gsap.to(group.position, {
            x: -4,
            y: 0,
            z: 8,
            ease: "none",
            scrollTrigger: {
              trigger: pinHeightBody,
              start: "top+=100 top",
              end: "max",
              scrub: true,
              markers: true,
              invalidateOnRefresh: true,
            },
          })

          const tween2 = gsap.to(worldMeshRef?.current?.material as THREE.Material, {
           opacity: 0,
           duration: 1,
           ease: "none",
           scrollTrigger: {
            trigger: pinHeightBody,
            start: "top+=100 top",
            end: "max",
            scrub: true,
            markers: true,
            invalidateOnRefresh: true,
           },
          })
        
          scrollTriggerRef.current = { animation: tween1, animation2: tween2}
        
          return () => {
            scrollTriggerRef.current?.animation.kill()
            scrollTriggerRef.current = null
          }
        }, [mainGroupRef])
        
     
  return (
    <div className="w-screen h-screen fixed top-0 left-0">
      {children}
    </div>
  )
}

export default ScrollArea