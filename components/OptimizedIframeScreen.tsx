import { Html } from "@react-three/drei"
import { useState, useEffect } from "react"

interface OptimizedIframeScreenProps {
  src: string
  position: [number, number, number]
  rotation: [number, number, number]
  isVisible?: boolean
  onLoad?: () => void
  isMobile?: boolean // Add mobile prop
}

export const OptimizedIframeScreen: React.FC<OptimizedIframeScreenProps> = ({ 
  src, 
  position, 
  rotation, 
  isVisible = true,
  onLoad,
  isMobile = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleIframeLoad = () => {
    setIsLoaded(true)
    setIsLoading(false)
    onLoad?.()
  }

  const handleIframeError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  // Responsive container styles
  const containerStyle = {
    width: isMobile ? '100vw' : '1380px',
    height: isMobile ? '100vh' : '724px',
    position: 'relative' as const,
    backgroundColor: '#000',
    maxWidth: isMobile ? '100%' : 'none',
    maxHeight: isMobile ? '100%' : 'none',
  }

  // Responsive iframe styles
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#000',
    transform: 'scaleY(-1)',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    // iOS Safari specific fixes
    WebkitTransform: 'scaleY(-1)',
    WebkitOverflowScrolling: 'touch' as const,
  }

  return (
    <Html
      transform
      distanceFactor={isMobile ? 1.2 : 0.97} // Adjust for mobile
      position={position}
      rotation={rotation}
      occlude="blending"
      wrapperClass="htmlScreen"
      zIndexRange={[10, 0]}
    >
      <div style={containerStyle}>
        {/* Loading Placeholder */}
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
            fontSize: '18px',
            zIndex: 1,
            transform: 'scaleY(-1)'
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
              <p>Loading Website...</p>
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
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe 
          src={src}
          style={iframeStyle}
          title="Lofi Website"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* CSS for loading animation and mobile fixes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .htmlScreen {
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          
          .htmlScreen iframe {
            width: 100% !important;
            height: 100% !important;
            -webkit-transform: scaleY(-1) !important;
            transform: scaleY(-1) !important;
            -webkit-overflow-scrolling: touch !important;
          }
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .htmlScreen {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100% !important;
          }
          
          .htmlScreen iframe {
            width: 100% !important;
            height: 100% !important;
            -webkit-transform: scaleY(-1) !important;
            transform: scaleY(-1) !important;
          }
        }
      `}</style>
    </Html>
  )
} 