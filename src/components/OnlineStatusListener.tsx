'use client'

import { useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function OnlineStatusListener() {
  const { warning, success } = useToast()

  useEffect(() => {
    const handleOffline = () => warning('İnternet bağlantınız yok. Bazı işlemler çalışmayabilir.')
    const handleOnline = () => success('İnternet bağlantısı geri geldi.')

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // İlk yüklemede offline ise uyar
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOffline()
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [warning, success])

  return null
}


