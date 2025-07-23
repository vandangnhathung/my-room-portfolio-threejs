import { Html } from "@react-three/drei"
import { useState, useEffect } from "react"

interface OptimizedIframeScreenProps {
  src: string
  position: [number, number, number]
  rotation: [number, number, number]
  isVisible?: boolean
  onLoad?: () => void
}

export const OptimizedIframeScreen: React.FC<OptimizedIframeScreenProps> = ({ 
  src, 
  position, 
  rotation, 
  isVisible = true,
  onLoad 
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

  return (
    <Html
      transform
      distanceFactor={0.97}
      position={position}
      rotation={rotation}
      occlude="blending"
      wrapperClass="htmlScreen"
      zIndexRange={[10, 0]}
    >
      <div style={{
        width: '1385px',
        height: '754px',
        position: 'relative',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
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
            zIndex: 1
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #333', 
                borderTop: '3px solid #fff', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
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
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#000',
            transform: 'scaleY(-1)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          title="Lofi Website"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Html>
  )
} 