"use client"
import Lenis from "lenis"
import React, { useEffect, useRef } from "react"
import { useMainGroupRef, useMeshRefs } from "@/stores/useMeshesAnimationStore"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"

gsap.registerPlugin(ScrollTrigger)

export default function ScrollArea({ children }: { children: React.ReactNode }) {
  const mainGroupRef = useMainGroupRef()
  const meshRefs = useMeshRefs()

  const lenisRef = useRef<Lenis | null>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const pinRef = useRef<ScrollTrigger | null>(null)

  // 1) Lenis + ScrollTrigger sync
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      duration: 1.2,
    })
    lenisRef.current = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on?.("scroll", onScroll)
    lenis.start()

    return () => {
      lenis.off?.("scroll", onScroll)
      lenis.destroy()
    }
  }, [])

  // 2) Pin (nếu bạn muốn canvas cố định khi cuộn) — có thể bỏ nếu không cần
  useEffect(() => {
    const canvasContainer = document.querySelector(".canvas-container") as HTMLElement | null
    if (!canvasContainer || pinRef.current) return

    pinRef.current = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "max",
      pin: canvasContainer,
      // pinSpacing: false, // bật nếu không muốn chèn khoảng trống
      invalidateOnRefresh: true,
    })

    return () => {
      pinRef.current?.kill()
      pinRef.current = null
    }
  }, [])

  // 3) Timeline: tween 1 + tween 2 chạy cùng lúc
  useEffect(() => {
    const group = mainGroupRef.current
    const worldMeshRef = meshRefs.get("world")

    if (!group || !worldMeshRef?.current) return

    // Bảo đảm material có thể fade
    const mat = worldMeshRef.current.material as THREE.Material & { transparent?: boolean; opacity?: number }
    if ("transparent" in mat) mat.transparent = true

    // Cleanup timeline cũ nếu có (khi effect rerun)
    tlRef.current?.kill()

    const tl = gsap.timeline({
     // paused is optional here; ScrollTrigger will call play/reverse for you
     defaults: { ease: "power3.out", duration: 1.2 },
     scrollTrigger: {
       trigger: document.body,
       start: "top+=100 top",
       toggleActions: "play none none reverse", // 👈 play on down, reverse on up
       // markers: true,
       invalidateOnRefresh: true,
     },
   })
   
   tl.to(group.position, { x: -4, y: 0, z: 8 }, 0)
   tl.to(mat, { opacity: 0 }, 0)

    tlRef.current = tl

    return () => {
      tlRef.current?.kill()
      tlRef.current = null
    }
  }, [mainGroupRef, meshRefs])

  return <div className="w-screen h-screen fixed top-0 left-0">{children}</div>
}
