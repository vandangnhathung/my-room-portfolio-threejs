import { Html } from "@react-three/drei"
import { useState, useEffect, useRef, useCallback } from "react"
import { useIframePerformance } from "@/hooks/use-iframe-performance"

interface OptimizedIframeScreenProps {
  src: string
  position: [number, number, number]
  rotation: [number, number, number]
  isVisible?: boolean
  onLoad?: () => void
  isMobile?: boolean
}

export const OptimizedIframeScreen: React.FC<OptimizedIframeScreenProps> = ({ 
  src, 
  position, 
  rotation, 
  isVisible = true,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true) // Start loading immediately
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(true) // Always load immediately
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Performance monitoring hook
  const {
    metrics,
    startLoading,
    handleLoadSuccess,
    handleLoadError,
    retry
  } = useIframePerformance({
    maxRetries: 3,
    timeoutMs: 10000,
    enableLogging: true
  })

  const isIOSDevice = () => {
    if (typeof window === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  }

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false)
    setIsLoading(true) // Start loading immediately
    setHasError(false)
    setShouldLoad(true) // Always load immediately
  }, [src])

  // Start loading immediately when component mounts
  useEffect(() => {
    if (shouldLoad && !isLoaded && !hasError) {
      setIsLoading(true)
      startLoading()
    }
  }, [shouldLoad, isLoaded, hasError, startLoading])

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true)
    setIsLoading(false)
    handleLoadSuccess()
    onLoad?.()
  }, [handleLoadSuccess, onLoad])

  const handleIframeError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
    handleLoadError()
  }, [handleLoadError])

  // Start loading when shouldLoad becomes true
  useEffect(() => {
    if (shouldLoad && !isLoaded && !isLoading && !hasError) {
      setIsLoading(true)
      startLoading()
    }
  }, [shouldLoad, isLoaded, isLoading, hasError, startLoading])

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  // Responsive container styles
  const containerStyle = {
    width: "1380px",
    height: "724px",
    position: 'relative' as const,
    backgroundColor: '#000',
    maxWidth: '100%',
    maxHeight: '100%',
  }

  // Responsive iframe styles with IMMEDIATE iOS transform
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#000',
    // Desktop transform only - iOS handled by CSS
    transform: 'scaleY(-1)',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    WebkitTransform: 'scaleY(-1)',
  }

  return (
    <Html
      transform
      distanceFactor={0.97}
      position={position}
      rotation={rotation}
      occlude="blending"
      wrapperClass="htmlScreen1"
      zIndexRange={[10, 0]}
    >
      <div ref={containerRef} style={containerStyle}>
        {/* Loading Placeholder */}
        {(!shouldLoad || isLoading) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '18px',
            zIndex: 1,
            transform: isIOSDevice() ? 'translateY(30%) scaleY(-1)' : 'scaleY(-1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #333', 
                borderTop: '3px solid #fff', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px',
              }} />
              <p>{!shouldLoad ? 'Waiting to load...' : 'Loading Website...'}</p>
              {metrics.loadDuration && (
                <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                  Loaded in {Math.round(metrics.loadDuration)}ms
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '16px',
            zIndex: 1
          }}>
            <div style={{ textAlign: 'center' }}>
              <p>⚠️ Website could not be loaded</p>
              <button 
                onClick={() => window.open(src, '_blank')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Open in New Tab
              </button>
              {metrics.retryCount < 3 && (
                <button 
                  onClick={() => retry()}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {/* Iframe - Only render when shouldLoad is true */}
        {shouldLoad && (
          <iframe 
            ref={iframeRef}
            src={src}
            style={iframeStyle}
            title="Lofi Website"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>

      {/* Optimized CSS - IMMEDIATE iOS transform */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* IMMEDIATE iOS transform application */
        @supports (-webkit-touch-callout: none) {
          .htmlScreen1 {
            position: fixed !important;
            top:-10%!important;
          }

          .htmlScreen1 iframe {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            -webkit-transform: scaleY(-1) !important;
            transform: scaleY(-1) !important;
            -webkit-overflow-scrolling: touch !important;
          }
        }
      `}</style>
    </Html>
  )
} 