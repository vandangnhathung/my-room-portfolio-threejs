import { useVideoTexture } from '@/hooks/videos/use-video-texture'

export const useVideoMaterials = () => {
  const screenVideoMaterial = useVideoTexture({
    src: '/textures/videos/video-1.mp4',
    autoPlay: true,
    loop: true,
    muted: true
  })

  const screen001VideoMaterial = useVideoTexture({
    src: '/textures/videos/video-1.mp4',
    autoPlay: true,
    loop: true,
    muted: true
  })

  return { screenVideoMaterial, screen001VideoMaterial }
} 