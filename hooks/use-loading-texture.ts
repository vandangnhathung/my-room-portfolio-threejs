'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

export const useLoadingTexture = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const animationRef = useRef<number | undefined>(undefined)

  const loadingTexture = useMemo(() => {
    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    canvasRef.current = canvas

    // Create texture
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    textureRef.current = texture

    return texture
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rotation = 0

    const drawLoadingSpinner = () => {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 40

      // Save context
      ctx.save()

      // Move to center and rotate
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw spinner (dotted circle)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'

      const dots = 12
      for (let i = 0; i < dots; i++) {
        const angle = (i / dots) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        // Fade effect - dots get lighter as they go around
        const opacity = 1 - (i / dots) * 0.8
        ctx.globalAlpha = opacity
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Restore context
      ctx.restore()

      // Add "Loading..." text
      ctx.fillStyle = '#666666'
      ctx.font = '24px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Loading...', centerX, centerY + radius + 40)

      // Update texture
      if (textureRef.current) {
        textureRef.current.needsUpdate = true
      }

      // Update rotation for next frame
      rotation += 0.1

      // Continue animation
      animationRef.current = requestAnimationFrame(drawLoadingSpinner)
    }

    // Start animation
    drawLoadingSpinner()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [])

  const loadingMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: loadingTexture,
      transparent: false
    })
  }, [loadingTexture])

  return {
    loadingTexture,
    loadingMaterial
  }
} 