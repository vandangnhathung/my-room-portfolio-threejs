import React, { useEffect, useRef, useState } from 'react'
import { PopupConfig, usePopupFinishCloseAnimation } from '@/stores/usePopupStore'
import { gsap } from 'gsap'

interface PopupContainerProps {
  isOpen: boolean
  isLoading: boolean
  isAnimating: boolean
  config: PopupConfig | null
  onClose: () => void
  onOutsideClick: () => void
}

export const PopupContainer: React.FC<PopupContainerProps> = ({
  isOpen,
  isLoading,
  isAnimating,
  config,
  onClose,
  onOutsideClick
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  
  const [shouldRender, setShouldRender] = useState(false)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishCloseAnimation = usePopupFinishCloseAnimation()

  // GSAP Animation Functions
  const animateIn = () => {
    if (!overlayRef.current || !contentRef.current) return

    // Kill any existing animations
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create new timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Execute afterOpen callback if available
        if (config?.afterOpen) {
          setTimeout(() => config.afterOpen?.(), 50)
        }
      }
    })

    // Set initial states
    gsap.set(overlayRef.current, { opacity: 0 })
    gsap.set(contentRef.current, { 
      scale: 0.8, 
      y: 40, 
      opacity: 0,
      rotationX: -15
    })
    
    if (headerRef.current) {
      gsap.set(headerRef.current, { y: -20, opacity: 0 })
    }
    if (bodyRef.current) {
      gsap.set(bodyRef.current, { y: 20, opacity: 0 })
    }
    if (footerRef.current) {
      gsap.set(footerRef.current, { y: 20, opacity: 0 })
    }

    // Animate in sequence
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(contentRef.current, {
      scale: 1,
      y: 0,
      opacity: 1,
      rotationX: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.1")
    .to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out"
    }, "-=0.3")
    .to(bodyRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out"
    }, "-=0.25")
    .to(footerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out"
    }, "-=0.2")

    timelineRef.current = tl
  }

  const animateOut = () => {
    return new Promise<void>((resolve) => {
      if (!overlayRef.current || !contentRef.current) {
        resolve()
        return
      }

      // Kill any existing animations
      if (timelineRef.current) {
        timelineRef.current.kill()
      }

      // Create exit timeline with slower, more visible animations
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false)
          finishCloseAnimation() // This will set isOpen to false in the store
          resolve()
        }
      })

      // Animate out with more pronounced effects and better timing
      tl.to([footerRef.current, bodyRef.current], {
        y: 30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.1
      })
      .to(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.3")
      .to(contentRef.current, {
        scale: 0.8,
        y: 50,
        opacity: 0,
        rotationX: -20,
        duration: 0.5,
        ease: "power2.in"
      }, "-=0.3")
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.3")

      timelineRef.current = tl
    })
  }

  // Handle animation states
  useEffect(() => {
    if (isOpen && config && !isAnimating) {
      // Execute beforeOpen callback if available
      if (config.beforeOpen) {
        config.beforeOpen()
      }
      
      setShouldRender(true)
      // Start entrance animation after DOM update
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animateIn()
        })
      })
    } else if (isAnimating && shouldRender) {
      // Start exit animation when isAnimating becomes true
      animateOut()
    }

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [isOpen, config, isAnimating, shouldRender])

  // Loading animation
  useEffect(() => {
    if (!loadingRef.current) return

    if (isLoading) {
      gsap.to(loadingRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    } else {
      gsap.to(loadingRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in"
      })
    }
  }, [isLoading])

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClick = (event: MouseEvent) => {
      if (
        overlayRef.current && 
        contentRef.current &&
        overlayRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        onOutsideClick()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onOutsideClick])

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Keep popup visible during animation or when open
  if (!shouldRender || !config) {
    return null
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      style={{ 
        zIndex: 999999,
        pointerEvents: (isOpen || isAnimating) ? 'auto' : 'none'
      }}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl"
        style={{
          transformOrigin: 'center center',
          pointerEvents: isLoading ? 'none' : 'auto'
        }}
      >
        {/* Loading Overlay with GSAP Animation */}
        <div 
          ref={loadingRef}
          className="absolute inset-0 bg-white/90 rounded-xl flex items-center justify-center z-10"
          style={{
            opacity: 0,
            pointerEvents: isLoading ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 border-3 border-blue-200 rounded-full"></div>
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <span className="text-gray-700 font-medium text-lg">Loading...</span>
          </div>
        </div>

        {/* Header with brown/tan styling */}
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-6 bg-amber-900 text-white border-b border-amber-800 rounded-t-xl"
        >
          <h2 className="text-2xl font-bold text-white">
            {config.title || 'Popup'}
          </h2>
          
          {config.showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-amber-800 hover:bg-amber-700 transition-colors duration-200 text-white hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
              aria-label="Close popup"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.1,
                  duration: 0.2,
                  ease: "power2.out"
                })
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.2,
                  ease: "power2.out"
                })
              }}
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Content with white background */}
        <div 
          ref={bodyRef}
          className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] bg-white text-gray-800"
        >
          {config.content || (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-700">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">No content provided</p>
            </div>
          )}
        </div>

        {/* Footer with light beige/tan background like status section */}
        <div 
          ref={footerRef}
          className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-amber-50 rounded-b-xl"
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-amber-300 text-amber-800 bg-white hover:bg-amber-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 font-medium"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                y: -2,
                boxShadow: "0 4px 12px rgba(180, 83, 9, 0.15)",
                duration: 0.2,
                ease: "power2.out"
              })
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                y: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                duration: 0.2,
                ease: "power2.out"
              })
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 