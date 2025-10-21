'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/contexts/ToastContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 dakika (eski: 1 dakika)
            gcTime: 5 * 60 * 1000, // 5 dakika garbage collection
            refetchOnWindowFocus: false, // Pencere focus'ta otomatik refetch yapma
            refetchOnReconnect: false, // İnternet bağlantısı gelince otomatik refetch yapma
            retry: 1, // Hata durumunda sadece 1 kere tekrar dene (eski: 3)
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

