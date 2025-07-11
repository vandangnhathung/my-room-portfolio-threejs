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

export function useLoadingManager(): LoadingManagerHook {
  const [state, setState] = useState<LoadingManagerState>({
    progress: 0,
    loaded: 0,
    total: 0,
    isLoading: false,
    currentUrl: '',
    errors: []
  })

  const reset = useCallback(() => {
    setState({
      progress: 0,
      loaded: 0,
      total: 0,
      isLoading: false,
      currentUrl: '',
      errors: []
    })
  }, [])

  // Create manager once with useRef and define callbacks directly
  const managerRef = useRef<THREE.LoadingManager | null>(null)
  const isInitialized = useRef(false)
  
  if (!managerRef.current) {
    const manager = new THREE.LoadingManager()
    
    // Use setTimeout to avoid calling setState during render
    manager.onStart = (url: string, itemsLoaded: number, itemsTotal: number) => {
      if (isInitialized.current) return; // Prevent multiple initializations
      
      console.log(`🚀 Loading started: ${url}`)
      console.log(`📊 Progress: ${itemsLoaded}/${itemsTotal}`)
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLoading: true,
          currentUrl: url,
          loaded: itemsLoaded,
          total: itemsTotal,
          progress: itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0
        }))
      }, 0)
    }

    manager.onLoad = () => {
      console.log('✅ All loading completed!')
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isLoading: false,
          progress: 100,
          currentUrl: ''
        }))
        isInitialized.current = true; // Mark as initialized after first complete load
      }, 0)
    }

    manager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
      const progress = itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0
      
      console.log(`📈 Loading progress: ${url}`)
      console.log(`📊 Progress: ${itemsLoaded}/${itemsTotal} (${Math.round(progress)}%)`)
      
      // Throttle progress updates to avoid too many state updates
      setTimeout(() => {
        setState(prev => {
          // Only update if progress has actually changed significantly
          if (Math.abs(prev.progress - progress) > 5) {
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
      }, 0)
    }

    manager.onError = (url: string) => {
      console.error(`❌ Loading error: ${url}`)
      
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          errors: [...prev.errors, url],
          currentUrl: url
        }))
      }, 0)
    }

    managerRef.current = manager
  }

  return { manager: managerRef.current, state, reset }
} 