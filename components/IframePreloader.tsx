import { useEffect, useRef, useState } from 'react'
import { useCameraStore } from '@/stores/useCameraStore'

interface IframePreloaderProps {
  src: string
  onPreloadComplete?: () => void
  preloadDistance?: number
  enablePredictivePreloading?: boolean
}

export const IframePreloader: React.FC<IframePreloaderProps> = ({
  src,
  onPreloadComplete,
  enablePredictivePreloading = true
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false)
  const [preloadStartTime, setPreloadStartTime] = useState<number | null>(null)
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null)
  const { isCameraFocused } = useCameraStore()

  // Predictive preloading based on camera focus
  useEffect(() => {
    if (!enablePredictivePreloading || isPreloaded) return

    // If camera is focused, it might indicate user interest in the iframe
    if (isCameraFocused) {
      startPreload()
    }
  }, [isCameraFocused, enablePredictivePreloading, isPreloaded])

  const startPreload = () => {
    if (isPreloaded || preloadStartTime) return

    setPreloadStartTime(performance.now())
    console.log('🚀 Starting predictive iframe preload:', src)

    // Create hidden iframe for preloading
    if (hiddenIframeRef.current) {
      hiddenIframeRef.current.src = src
    }
  }

  const handlePreloadComplete = () => {
    const endTime = performance.now()
    const duration = preloadStartTime ? endTime - preloadStartTime : null

    setIsPreloaded(true)

    console.log('✅ Iframe preload completed:', {
      src,
      duration: duration ? `${duration}ms` : 'N/A',
      timestamp: new Date().toISOString()
    })

    onPreloadComplete?.()
  }

  const handlePreloadError = () => {
    console.warn('⚠️ Iframe preload failed:', src)
    // Don't mark as failed, just log the warning
    // The main iframe will handle its own loading
  }

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden iframe for preloading - only render when preloading starts */}
      {preloadStartTime && (
        <iframe
          ref={hiddenIframeRef}
          src={src}
          onLoad={handlePreloadComplete}
          onError={handlePreloadError}
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
} 