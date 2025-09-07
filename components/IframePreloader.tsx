import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useCameraStore } from '@/stores/useCameraStore'

interface IframePreloaderProps {
  src: string
  onPreloadComplete?: () => void
  preloadDistance?: number
  enablePredictivePreloading?: boolean
}

const isIOSDevice = () =>
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

export const IframePreloader: React.FC<IframePreloaderProps> = ({
  src,
  onPreloadComplete,
  enablePredictivePreloading = true
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false)
  const [preloadStartTime, setPreloadStartTime] = useState<number | null>(null)
  const hiddenIframeRef = useRef<HTMLIFrameElement>(null)
  const { isCameraFocused } = useCameraStore()

  // Detect iOS once
  const isIOS = useMemo(() => isIOSDevice(), [])

  const startPreload = useCallback(() => {
    if (isPreloaded || preloadStartTime) return

    setPreloadStartTime(performance.now())
    console.log('🚀 Starting predictive iframe preload:', src)

    // Create hidden iframe for preloading
    if (hiddenIframeRef.current) {
      hiddenIframeRef.current.src = src
    }
  }, [isPreloaded, preloadStartTime, src])

  // Predictive preloading based on camera focus (skip on iOS)
  useEffect(() => {
    if (isIOS) return
    if (!enablePredictivePreloading || isPreloaded) return
    if (isCameraFocused) {
      startPreload()
    }
  }, [isIOS, isCameraFocused, enablePredictivePreloading, isPreloaded, startPreload])

  const handlePreloadComplete = () => {
    const endTime = performance.now()
    const duration = preloadStartTime ? endTime - preloadStartTime : null

    setIsPreloaded(true)

    console.log('✅ Iframe preload completed:', {
      src,
      duration: duration ? `${duration}ms` : 'N/A',
      timestamp: new Date().toISOString()
    })

    // Actively release resources
    if (hiddenIframeRef.current) {
      try { hiddenIframeRef.current.src = 'about:blank' } catch {}
    }

    onPreloadComplete?.()
  }

  const handlePreloadError = () => {
    console.warn('⚠️ Iframe preload failed:', src)
    // The main iframe will handle its own loading
  }

  // Cleanup on unmount – release hidden iframe memory
  useEffect(() => {
    return () => {
      const iframe = hiddenIframeRef.current
      if (iframe) {
        try { iframe.src = 'about:blank' } catch {}
      }
    }
  }, [])

  // Don't render the hidden preloader on iOS at all
  if (isIOS) return null

  return (
    <div style={{ display: 'none' }}>
      {/* Hidden iframe for preloading - only render while preloading */}
      {preloadStartTime && !isPreloaded && (
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