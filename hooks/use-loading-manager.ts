// hooks/use-loading-manager.ts
'use client'

import * as THREE from 'three'
import { useState, useEffect, useMemo, useCallback } from 'react'

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

  const manager = useMemo(() => {
    const manager = new THREE.LoadingManager()
    
    manager.onStart = (url: string, itemsLoaded: number, itemsTotal: number) => {
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
    }

    manager.onLoad = () => {
      console.log('✅ All loading completed!')
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: 100,
        currentUrl: ''
      }))
    }

    manager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
      const progress = itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0
      
      console.log(`📈 Loading progress: ${url}`)
      console.log(`📊 Progress: ${itemsLoaded}/${itemsTotal} (${Math.round(progress)}%)`)
      
      setState(prev => ({
        ...prev,
        currentUrl: url,
        loaded: itemsLoaded,
        total: itemsTotal,
        progress
      }))
    }

    manager.onError = (url: string) => {
      console.error(`❌ Loading error: ${url}`)
      
      setState(prev => ({
        ...prev,
        errors: [...prev.errors, url],
        currentUrl: url
      }))
    }

    return manager
  }, [])

  return { manager, state, reset }
} 