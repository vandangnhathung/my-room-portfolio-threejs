import { useState, useCallback, useEffect } from 'react'

interface IframePerformanceMetrics {
  loadStartTime: number | null
  loadEndTime: number | null
  loadDuration: number | null
  isLoaded: boolean
  hasError: boolean
  retryCount: number
  performanceScore: number // 0-100 score based on load time
}

interface UseIframePerformanceOptions {
  maxRetries?: number
  timeoutMs?: number
  enableLogging?: boolean
}

export const useIframePerformance = (options: UseIframePerformanceOptions = {}) => {
  const {
    maxRetries = 3,
    timeoutMs = 10000, // 10 second timeout
    enableLogging = true
  } = options

  const [metrics, setMetrics] = useState<IframePerformanceMetrics>({
    loadStartTime: null,
    loadEndTime: null,
    loadDuration: null,
    isLoaded: false,
    hasError: false,
    retryCount: 0,
    performanceScore: 0
  })

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const logPerformance = useCallback((action: string, data?: Record<string, unknown>) => {
    if (!enableLogging) return
    
    console.log(`🎯 Iframe Performance - ${action}:`, {
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      connection: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown'
    })
  }, [enableLogging])

  const calculatePerformanceScore = useCallback((duration: number): number => {
    // Score based on load time:
    // 0-500ms: 100 points
    // 500-1000ms: 80 points
    // 1000-2000ms: 60 points
    // 2000-5000ms: 40 points
    // 5000ms+: 20 points
    if (duration <= 500) return 100
    if (duration <= 1000) return 80
    if (duration <= 2000) return 60
    if (duration <= 5000) return 40
    return 20
  }, [])

  const startLoading = useCallback(() => {
    const startTime = performance.now()
    
    setMetrics(prev => ({
      ...prev,
      loadStartTime: startTime,
      loadEndTime: null,
      loadDuration: null,
      isLoaded: false,
      hasError: false
    }))

    // Set timeout for loading
    const timeout = setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        hasError: true,
        loadEndTime: performance.now(),
        loadDuration: performance.now() - (prev.loadStartTime || 0)
      }))
      logPerformance('Timeout exceeded', { timeoutMs })
    }, timeoutMs)

    setTimeoutId(timeout)
    logPerformance('Started loading')
  }, [timeoutMs, logPerformance])

  const handleLoadSuccess = useCallback(() => {
    const endTime = performance.now()
    const duration = metrics.loadStartTime ? endTime - metrics.loadStartTime : null
    const score = duration ? calculatePerformanceScore(duration) : 0

    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setMetrics(prev => ({
      ...prev,
      loadEndTime: endTime,
      loadDuration: duration,
      isLoaded: true,
      hasError: false,
      performanceScore: score
    }))

    logPerformance('Load completed', { 
      duration: duration ? `${duration}ms` : 'N/A',
      score 
    })
  }, [metrics.loadStartTime, timeoutId, calculatePerformanceScore, logPerformance])

  const handleLoadError = useCallback(() => {
    const endTime = performance.now()
    const duration = metrics.loadStartTime ? endTime - metrics.loadStartTime : null

    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setMetrics(prev => ({
      ...prev,
      loadEndTime: endTime,
      loadDuration: duration,
      isLoaded: false,
      hasError: true,
      retryCount: prev.retryCount + 1
    }))

    logPerformance('Load failed', { 
      duration: duration ? `${duration}ms` : 'N/A',
      retryCount: metrics.retryCount + 1
    })
  }, [metrics.loadStartTime, metrics.retryCount, timeoutId, logPerformance])

  const retry = useCallback(() => {
    if (metrics.retryCount >= maxRetries) {
      logPerformance('Max retries exceeded', { maxRetries })
      return false
    }

    startLoading()
    return true
  }, [metrics.retryCount, maxRetries, startLoading, logPerformance])

  const reset = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }

    setMetrics({
      loadStartTime: null,
      loadEndTime: null,
      loadDuration: null,
      isLoaded: false,
      hasError: false,
      retryCount: 0,
      performanceScore: 0
    })

    logPerformance('Reset metrics')
  }, [timeoutId, logPerformance])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  // Performance recommendations
  const getRecommendations = useCallback(() => {
    const recommendations: string[] = []
    
    if (metrics.loadDuration && metrics.loadDuration > 3000) {
      recommendations.push('Consider implementing preloading strategies')
    }
    
    if (metrics.loadDuration && metrics.loadDuration > 5000) {
      recommendations.push('Consider using a CDN or optimizing the target website')
    }
    
    if (metrics.retryCount > 0) {
      recommendations.push('Consider implementing better error handling and retry logic')
    }
    
    if (metrics.performanceScore < 60) {
      recommendations.push('Consider implementing lazy loading or intersection observer')
    }

    return recommendations
  }, [metrics])

  return {
    metrics,
    startLoading,
    handleLoadSuccess,
    handleLoadError,
    retry,
    reset,
    getRecommendations,
    canRetry: metrics.retryCount < maxRetries
  }
} 