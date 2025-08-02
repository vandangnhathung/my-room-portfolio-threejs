// hooks/use-loading-manager.ts
'use client'

import * as THREE from 'three'
import { useState, useRef, useCallback } from 'react'

export interface LoadingManagerState {
  progress: number
  loaded: number
  total: number
  isLoading: boolean
  currentUrl: string
  errors: string[]
}

export interface LoadingManagerHook {
  manager: THREE.LoadingManager
  state: LoadingManagerState
  reset: () => void
}

// Move initial state outside component to prevent recreation on every render
const initialState: LoadingManagerState = {
  progress: 0,
  loaded: 0,
  total: 0,
  isLoading: false,
  currentUrl: '',
  errors: []
}

export function useLoadingManager(): LoadingManagerHook {
  const [state, setState] = useState<LoadingManagerState>(initialState)

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  // Create manager once with useRef
  const managerRef = useRef<THREE.LoadingManager | null>(null)
  const isInitialized = useRef(false)
  
  // Stable callback functions using useCallback
  const onStart = useCallback((url: string, itemsLoaded: number, itemsTotal: number) => {
    if (isInitialized.current) return; // Prevent multiple initializations
    
    console.log(`🚀 Loading started: ${url}`)
    console.log(`📊 Progress: ${itemsLoaded}/${itemsTotal}`)
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      currentUrl: url,
      loaded: itemsLoaded,
      total: itemsTotal,
      progress: itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0
    }))
  }, [])

  const onLoad = useCallback(() => {
    console.log('✅ All loading completed!')
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      progress: 100,
      currentUrl: ''
    }))
    isInitialized.current = true; // Mark as initialized after first complete load
  }, [])

  const onProgress = useCallback((url: string, itemsLoaded: number, itemsTotal: number) => {
    const progress = itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0
    
    // Throttle progress updates to prevent excessive re-renders
    setState(prev => {
      // Only update if progress change is significant (more than 2%)
      if (Math.abs(prev.progress - progress) > 2) {
        return {
          ...prev,
          currentUrl: url,
          loaded: itemsLoaded,
          total: itemsTotal,
          progress
        }
      }
      return prev
    })
  }, [])

  const onError = useCallback((url: string) => {
    console.error(`❌ Loading error: ${url}`)
    
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, url],
      currentUrl: url
    }))
  }, [])

  // Create manager only once - avoid useEffect completely
  if (!managerRef.current) {
    const manager = new THREE.LoadingManager()
    
    // Set the stable callbacks
    manager.onStart = onStart
    manager.onLoad = onLoad
    manager.onProgress = onProgress
    manager.onError = onError

    managerRef.current = manager
  }

  return { 
    manager: managerRef.current!, 
    state, 
    reset 
  }
} 