import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'

interface VideoTextureConfig {
  src: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  crossOrigin?: string
}

export const useVideoTexture = (config: VideoTextureConfig) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const textureRef = useRef<THREE.VideoTexture | null>(null)

  // Create video element
  useEffect(() => {
    const video = document.createElement('video')
    video.src = config.src
    video.loop = config.loop ?? true
    video.muted = config.muted ?? true
    video.playsInline = true
    video.autoplay = config.autoPlay ?? true
    
    // Set video properties
    video.style.display = 'none'
    document.body.appendChild(video)
    
    videoRef.current = video
    
    // Load and play video automatically
    video.load()
    video.play().catch(error => {
      console.warn('Video autoplay failed:', error)
    })

    return () => {
      if (video.parentNode) {
        video.parentNode.removeChild(video)
      }
    }
  }, [config.src, config.autoPlay, config.loop, config.muted, config.crossOrigin])

  // Create material with video texture
  const material = useMemo(() => {
    if (!videoRef.current) return null

    // Create video texture
    const texture = new THREE.VideoTexture(videoRef.current)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat
    texture.colorSpace = THREE.SRGBColorSpace
    
    textureRef.current = texture
    
    // Create material with video texture - only render on front side
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide // Only front side
    })
    
    return material
  }, [videoRef.current])

  return material
} 