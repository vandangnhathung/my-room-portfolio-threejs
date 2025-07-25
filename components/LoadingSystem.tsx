// components/LoadingSystem.tsx
'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useLoadingManager, LoadingManagerState } from '@/hooks/use-loading-manager';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Context for sharing LoadingManager
const LoadingManagerContext = createContext<THREE.LoadingManager | null>(null);

export const useLoadingManagerContext = () => {
  const context = useContext(LoadingManagerContext);
  if (!context) {
    throw new Error('useLoadingManagerContext must be used within LoadingSystem');
  }
  return context;
};

// Types
export interface LoadingSystemProps {
  onComplete: () => void;
  children: React.ReactNode;
  customMessages?: Partial<LoadingMessages>;
  theme?: ThemeType;
}

export type LoadingPhase = 'initializing' | 'loading' | 'ready' | 'entering' | 'complete';
export type ThemeType = 'cozy' | 'modern' | 'dark';

interface LoadingMessages {
  initializing: string;
  loading: string;
  ready: string;
  entering: string;
}

interface ThemeConfig {
  background: string;
  overlayPattern: string;
  cardBackground: string;
  textColor: string;
  accentColor: string;
  buttonGradient: string;
  shadowColor: string;
}

// Theme configurations (keeping your existing themes)
const themes: Record<ThemeType, ThemeConfig> = {
  cozy: {
    background: 'linear-gradient(145deg, #f4f1eb 0%, #e8dcc6 30%, #d4c4a8 100%)',
    overlayPattern: `
      radial-gradient(circle at 20% 30%, rgba(139, 115, 85, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(160, 142, 122, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(101, 84, 64, 0.05) 0%, transparent 40%)
    `,
    cardBackground: 'rgba(255, 255, 255, 0.85)',
    textColor: '#5d4e37',
    accentColor: '#8b7355',
    buttonGradient: 'linear-gradient(135deg, #8b7355 0%, #a0856b 100%)',
    shadowColor: 'rgba(139, 115, 85, 0.3)'
  },
  modern: {
    background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
    overlayPattern: `
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
    `,
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    textColor: '#333333',
    accentColor: '#667eea',
    buttonGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadowColor: 'rgba(102, 126, 234, 0.3)'
  },
  dark: {
    background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
    overlayPattern: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
    `,
    cardBackground: 'rgba(40, 40, 40, 0.9)',
    textColor: '#ffffff',
    accentColor: '#888888',
    buttonGradient: 'linear-gradient(135deg, #444444 0%, #666666 100%)',
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  }
};

// Loading Overlay Component
interface LoadingOverlayProps {
  theme: ThemeConfig;
  themeType: ThemeType;
  loadingPhase: LoadingPhase;
  loadingText: string;
  isEnterEnabled: boolean;
  onEnterClick: () => void;
  loadingState: LoadingManagerState;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  theme,
  themeType,
  loadingPhase,
  loadingText,
  isEnterEnabled,
  onEnterClick,
  loadingState
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Handle enter button animation
  useEffect(() => {
    if (loadingPhase === 'ready' && enterButtonRef.current) {
      gsap.fromTo(enterButtonRef.current!, 
        { scale: 0, opacity: 0, rotation: -10 },
        { 
          scale: 1, 
          opacity: 1, 
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3
        }
      );
    }
  }, [loadingPhase]);

  // Handle exit animation
  const handleExitAnimation = useCallback(async () => {
    return new Promise<void>((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
            overlayRef.current.style.pointerEvents = 'none';
          }
          resolve();
        }
      });

      timeline
        .to(loadingTextRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.4,
          ease: "power2.in"
        })
        .to(enterButtonRef.current, {
          opacity: 0,
          scale: 0.7,
          y: -20,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.2")
        .to(overlayRef.current, {
          clipPath: "inset(100% 0 0 0)",
          duration: 1.2,
          ease: "power3.inOut"
        }, "-=0.1");
    });
  }, []);

  // Handle enter click
  const handleEnterClickInternal = useCallback(async () => {
    if (!isEnterEnabled || !enterButtonRef.current) return;
    
    enterButtonRef.current.textContent = 'Entering...';
    
    await handleExitAnimation();
    onEnterClick();
  }, [isEnterEnabled, onEnterClick, handleExitAnimation]);

  const getThemeIcon = (theme: ThemeType): string => {
    switch (theme) {
      case 'cozy': return '🏠';
      case 'modern': return '⚡';
      case 'dark': return '🌙';
      default: return '🏠';
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: 'hidden',
        pointerEvents: loadingPhase === 'complete' ? 'none' : 'auto'
      }}
    >
      {/* Background */}
      <div
        ref={backgroundRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: theme.background,
          zIndex: -1
        }}
      />
      
      {/* Overlay Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: theme.overlayPattern,
          zIndex: -1
        }}
      />
      
      {/* Loading Content */}
      <div
        style={{
          textAlign: 'center',
          color: theme.textColor,
          maxWidth: '420px',
          padding: '40px',
          backgroundColor: theme.cardBackground,
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 20px 60px ${theme.shadowColor}`,
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: loadingPhase === 'loading' ? 'gentlePulse 2s ease-in-out infinite' : 'none'
          }}
        >
          {getThemeIcon(themeType)}
        </div>

        {/* Loading Text */}
        <div
          ref={loadingTextRef}
          style={{
            fontSize: '20px',
            fontWeight: '500',
            marginBottom: '20px',
            letterSpacing: '0.5px',
            lineHeight: '1.4'
          }}
        >
          {loadingText}
        </div>

        {/* Real-time Progress Bar */}
        {loadingPhase === 'loading' && (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              <div
                style={{
                  width: `${loadingState.progress}%`,
                  height: '100%',
                  backgroundColor: theme.accentColor,
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                  boxShadow: `0 0 10px ${theme.accentColor}50`
                }}
              />
            </div>
            <div style={{ 
              fontSize: '14px', 
              opacity: 0.8,
              color: theme.accentColor,
              marginBottom: '8px'
            }}>
              {Math.round(loadingState.progress)}% • {loadingState.loaded}/{loadingState.total}
            </div>
            {loadingState.currentUrl && (
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.6,
                color: theme.textColor,
                wordBreak: 'break-word'
              }}>
                {loadingState.currentUrl.split('/').pop()}
              </div>
            )}
          </div>
        )}

        {/* Enter Button */}
        <button
          ref={enterButtonRef}
          onClick={handleEnterClickInternal}
          disabled={!isEnterEnabled}
          style={{
            padding: '16px 40px',
            fontSize: '16px',
            fontWeight: '600',
            color: isEnterEnabled ? '#ffffff' : '#999',
            background: isEnterEnabled 
              ? theme.buttonGradient
              : 'linear-gradient(135deg, #ccc 0%, #bbb 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: isEnterEnabled ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
            textTransform: 'none',
            letterSpacing: '0.5px',
            boxShadow: isEnterEnabled 
              ? `0 8px 25px ${theme.shadowColor}`
              : '0 4px 15px rgba(0,0,0,0.1)',
            transform: isEnterEnabled ? 'scale(1)' : 'scale(0)',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (isEnterEnabled) {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1.05)';
              target.style.boxShadow = `0 12px 35px ${theme.shadowColor}`;
            }
          }}
          onMouseLeave={(e) => {
            if (isEnterEnabled) {
              const target = e.target as HTMLElement;
              target.style.transform = 'scale(1)';
              target.style.boxShadow = `0 8px 25px ${theme.shadowColor}`;
            }
          }}
        >
          Enter Your Space
        </button>

        {/* Loading Instructions */}
        {loadingPhase === 'ready' && (
          <div
            style={{
              marginTop: '25px',
              fontSize: '13px',
              opacity: 0.7,
              color: theme.accentColor,
              animation: 'fadeInUp 0.8s ease-out 0.5s both',
              textAlign: 'center'
            }}
          >
            Use mouse to explore • Click objects to interact
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 0.7; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Main LoadingSystem Component
export const LoadingSystem: React.FC<LoadingSystemProps> = ({
  onComplete,
  children,
  customMessages = {},
  theme = 'cozy'
}) => {
  const { manager, state: loadingState, reset } = useLoadingManager();
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('initializing');
  const [loadingText, setLoadingText] = useState<string>('');
  const [isEnterEnabled, setIsEnterEnabled] = useState<boolean>(false);

  // Default messages
  const defaultMessages: LoadingMessages = {
    initializing: 'Preparing Hung space...',
    loading: 'Loading assets...',
    ready: 'Welcome!',
    entering: 'Entering...'
  };
  
  // Memoize the messages object to prevent infinite re-renders
  const messages = useMemo(() => ({
    ...defaultMessages,
    ...customMessages
  }), [customMessages]);

  // Handle loading phases based on actual progress
  useEffect(() => {
    if (loadingState.progress === 0 && !loadingState.isLoading) {
      setLoadingPhase('initializing');
      setLoadingText(messages.initializing);
      setIsEnterEnabled(false);
    } else if (loadingState.isLoading && loadingState.progress < 100) {
      setLoadingPhase('loading');
      setLoadingText(messages.loading);
      setIsEnterEnabled(false);
    } else if (loadingState.progress === 100 && !loadingState.isLoading) {
      setLoadingPhase('ready');
      setLoadingText(messages.ready);
      setIsEnterEnabled(true);
    }
  }, [loadingState.progress, loadingState.isLoading, messages]);

  const handleLoadingComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // Reset loading state when component unmounts
  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <LoadingManagerContext.Provider value={manager}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Canvas with 3D Scene */}
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 200, position: [3, 2, 6] }}
          style={{ width: '100%', height: '100%' }}
        >        
          <Preload all />
          
          <React.Suspense fallback={null}>
            {children}
          </React.Suspense>
        </Canvas>

        {/* Loading Overlay */}
        <LoadingOverlay
          theme={themes[theme]}
          themeType={theme}
          loadingPhase={loadingPhase}
          loadingText={loadingText}
          isEnterEnabled={isEnterEnabled}
          onEnterClick={handleLoadingComplete}
          loadingState={loadingState}
        />
      </div>
    </LoadingManagerContext.Provider>
  );
};

export default LoadingSystem;