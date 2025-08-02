import { Html } from "@react-three/drei"
import { useState, useEffect, useRef, useCallback } from "react"

// Types
interface OptimizedIframeScreenProps {
  src: string
  position: [number, number, number]
  rotation: [number, number, number]
  isVisible?: boolean
  onLoad?: () => void
  isMobile?: boolean
  isCameraFocused?: boolean
}

interface LoadingSpinnerProps {
  isIOSDevice: boolean
}

interface ErrorStateProps {
  src: string
}

// Styles
const styles = {
  container: {
    width: "1380px",
    height: "724px",
    position: 'relative' as const,
    backgroundColor: '#000',
    maxWidth: '100%',
    maxHeight: '100%',
    willChange: 'transform',
    backfaceVisibility: 'hidden' as const,
    transformStyle: 'preserve-3d' as const,
  },
  
  iframe: (isLoaded: boolean, isCameraFocused: boolean) => ({
    width: '100%',
    height: '100%',
    border: 'none',
    backgroundColor: '#000',
    transform: 'scaleY(-1) translateZ(0)',
    opacity: isLoaded ? 1 : 0,
    pointerEvents: isCameraFocused ? 'auto' as const : 'none' as const,
    transition: 'opacity 0.3s ease-in-out',
    WebkitTransform: 'scaleY(-1) translateZ(0)',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    WebkitBackfaceVisibility: 'hidden' as const,
    transformStyle: 'preserve-3d' as const,
  }),
  
  loadingContainer: (isIOSDevice: boolean) => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: '#ed0000',
    fontSize: '16px',
    zIndex: 1,
    transform: isIOSDevice ? 'translateY(30%) scaleY(-1)' : 'scaleY(-1)'
  }),
  
  spinner: {
    width: '30px',
    height: '30px',
    border: '2px solid #333',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 8px',
  },
  
  errorContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: '#ffffff',
    fontSize: '14px',
    zIndex: 1
  },
  
  errorButton: {
    marginTop: '8px',
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  }
}

// Utility functions
const isIOSDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// Sub-components
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isIOSDevice }) => (
  <div style={styles.loadingContainer(isIOSDevice)}>
    <div style={{ textAlign: 'center' }}>
      <div style={styles.spinner} />
      <p>Loading...</p>
    </div>
  </div>
)

const ErrorState: React.FC<ErrorStateProps> = ({ src }) => (
  <div style={styles.errorContainer}>
    <div style={{ textAlign: 'center' }}>
      <p>⚠️ Could not load</p>
      <button 
        onClick={() => window.open(src, '_blank')}
        style={styles.errorButton}
      >
        Open in New Tab
      </button>
    </div>
  </div>
)

// CSS Styles
const iOSStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
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
`

// Main Component
export const OptimizedIframeScreen: React.FC<OptimizedIframeScreenProps> = ({ 
  src, 
  position, 
  rotation, 
  isVisible = true,
  onLoad,
  isCameraFocused = false,
}) => {
  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  // Event handlers
  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true)
    setIsLoading(false)
    onLoad?.()
  }, [onLoad])

  const handleIframeError = useCallback(() => {
    setHasError(true)
    setIsLoading(false)
  }, [])

  // Early return if not visible
  if (!isVisible) {
    return null
  }

  const iOSDevice = isIOSDevice()

  return (
    <Html
      transform
      distanceFactor={0.97}
      position={position}
      rotation={rotation}
      occlude="raycast"
      wrapperClass="htmlScreen1"
      zIndexRange={[10, 0]}
    >
      <div ref={containerRef} style={styles.container}>
        {/* Loading State */}
        {isLoading && <LoadingSpinner isIOSDevice={iOSDevice} />}

        {/* Error State */}
        {hasError && <ErrorState src={src} />}

        {/* Iframe */}
        <iframe 
          ref={iframeRef}
          src={src}
          style={styles.iframe(isLoaded, isCameraFocused)}
          title="Lofi Website"
          loading="eager"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* iOS Styles */}
      <style>{iOSStyles}</style>
    </Html>
  )
} 