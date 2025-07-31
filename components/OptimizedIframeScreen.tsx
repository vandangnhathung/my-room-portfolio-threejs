import { Html } from "@react-three/drei"
import { useState, useEffect, useRef, useCallback } from "react"

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
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
  }, [src])

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true)
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleIframeError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
  }, [])

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
        {/* Minimal Loading Placeholder - Only show briefly */}
        {isLoading && (
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
            fontSize: '16px',
            zIndex: 1,
            transform: isIOSDevice() ? 'translateY(30%) scaleY(-1)' : 'scaleY(-1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                border: '2px solid #333', 
                borderTop: '2px solid #fff', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 8px',
              }} />
              <p>Loading...</p>
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
            fontSize: '14px',
            zIndex: 1
          }}>
            <div style={{ textAlign: 'center' }}>
              <p>⚠️ Could not load</p>
              <button 
                onClick={() => window.open(src, '_blank')}
                style={{
                  marginTop: '8px',
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Open in New Tab
              </button>
            </div>
          </div>
        )}

        {/* Iframe - Load immediately */}
        <iframe 
          ref={iframeRef}
          src={src}
          style={iframeStyle}
          title="Lofi Website"
          loading="eager" // Force immediate loading
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
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