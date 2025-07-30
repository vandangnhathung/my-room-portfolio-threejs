import { useCallback, useRef } from 'react'

interface UseDebounceKeydownOptions {
  delay?: number
  onKeyDown?: (event: KeyboardEvent) => void
  onKeyUp?: (event: KeyboardEvent) => void
}

interface UseDebounceKeydownReturn {
  handleKeyDown: (event: KeyboardEvent) => void
  handleKeyUp: (event: KeyboardEvent) => void
  isDebouncing: boolean
  clearDebounce: () => void
}

export const useDebounceKeydown = ({
  delay = 300,
  onKeyDown,
  onKeyUp
}: UseDebounceKeydownOptions = {}): UseDebounceKeydownReturn => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isDebouncingRef = useRef(false)

  const clearDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    isDebouncingRef.current = false
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // If already debouncing, ignore the key press
    if (isDebouncingRef.current) {
      return
    }

    // Set debouncing state
    isDebouncingRef.current = true

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Call the original onKeyDown handler
    if (onKeyDown) {
      onKeyDown(event)
    }

    // Set timeout to clear debouncing state
    timeoutRef.current = setTimeout(() => {
      isDebouncingRef.current = false
      timeoutRef.current = null
    }, delay)
  }, [delay, onKeyDown])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (onKeyUp) {
      onKeyUp(event)
    }
  }, [onKeyUp])

  return {
    handleKeyDown,
    handleKeyUp,
    isDebouncing: isDebouncingRef.current,
    clearDebounce
  }
} 