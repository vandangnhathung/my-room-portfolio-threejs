'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

interface RoomQueryProviderProps {
  children: ReactNode
}

export function RoomQueryProvider({ children }: RoomQueryProviderProps) {
  // Create query client inside component to avoid SSR issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

// Custom hooks for room data management (client-side only)
export const useRoomCache = () => {
  // These will only work on the client side now
  if (typeof window === 'undefined') {
    return {
      prefetch: async () => {},
      invalidate: () => {},
      clear: () => {},
      getCached: () => ({}),
    }
  }

  return {
    prefetch: async () => {
      // Implement prefetch logic here if needed
    },
    invalidate: () => {
      // Implement invalidate logic here if needed
    },
    clear: () => {
      // Implement clear logic here if needed
    },
    getCached: () => {
      // Implement getCached logic here if needed
      return {}
    },
  }
}