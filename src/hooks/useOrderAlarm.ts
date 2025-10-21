import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useOrderAlarm() {
  const queryClient = useQueryClient()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<any>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Ses dosyasını yükle
  useEffect(() => {
    // Web Audio API ile alarm sesi oluştur
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Yumuşak bildirim tonu oluştur
      const playTone = (frequency: number, duration: number, delay: number = 0, volume: number = 0.25) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
          oscillator.type = 'sine' // Sine wave daha yumuşak
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration)
        }, delay)
      }
      
      // Hoş bildirim melodisi: 3 kez tekrar (ding-ding-dong)
      // İlk tur
      playTone(784, 0.15, 0, 0.25)      // G5
      playTone(784, 0.15, 180, 0.25)    // G5
      playTone(659.25, 0.25, 360, 0.3)  // E5 (uzun)
      
      // İkinci tur
      playTone(784, 0.15, 650, 0.25)    // G5
      playTone(784, 0.15, 830, 0.25)    // G5
      playTone(659.25, 0.25, 1010, 0.3) // E5 (uzun)
      
      // Üçüncü tur
      playTone(784, 0.15, 1300, 0.25)   // G5
      playTone(784, 0.15, 1480, 0.25)   // G5
      playTone(659.25, 0.35, 1660, 0.35) // E5 (daha uzun finale)
    }

    audioRef.current = {
      play: createNotificationSound
    }
  }, [])

  // Server-Sent Events bağlantısı
  useEffect(() => {
    // SSE bağlantısı kur
    const connectSSE = () => {
      try {
        const eventSource = new EventSource('/api/admin/orders/stream')
        
        eventSource.onopen = () => {
          console.log('✅ SSE Connected')
        }

        eventSource.onmessage = (event) => {
          try {
            console.log('📨 SSE Message received:', event.data)
            const data = JSON.parse(event.data)
            console.log('📦 Parsed data:', data)
            
            if (data.type === 'connected') {
              console.log('✅ SSE Connection confirmed')
            } else if (data.type === 'new_order') {
              console.log('🔔 New order received:', data.order)
              
              // Siparişleri yeniden çek
              queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
              
              // Ses çal
              if (soundEnabled && audioRef.current) {
                audioRef.current.play()
              }
              
              // Browser notification
              if (Notification.permission === 'granted') {
                new Notification('Yeni Sipariş! 🍔', {
                  body: `Sipariş #${data.order.id} - ${data.order.deliveryName || 'Misafir'}\n₺${data.order.total.toFixed(2)}`,
                  icon: '/images/logo/splash.png',
                  tag: `order-${data.order.id}`,
                  requireInteraction: true, // Kullanıcı kapatana kadar göster
                })
              }
            }
          } catch (error) {
            console.error('SSE message parse error:', error)
          }
        }

        eventSource.onerror = (error) => {
          console.error('SSE error:', error)
          eventSource.close()
          
          // 5 saniye sonra tekrar bağlan
          setTimeout(() => {
            console.log('🔄 Reconnecting SSE...')
            connectSSE()
          }, 5000)
        }

        eventSourceRef.current = eventSource
      } catch (error) {
        console.error('SSE connection error:', error)
      }
    }

    // İlk bağlantı
    connectSSE()

    // Cleanup
    return () => {
      if (eventSourceRef.current) {
        console.log('🔌 Disconnecting SSE...')
        eventSourceRef.current.close()
      }
    }
  }, [queryClient, soundEnabled])

  // Notification permission iste
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission)
      })
    }
  }, [])

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    // localStorage'a kaydet
    localStorage.setItem('orderAlarmSound', (!soundEnabled).toString())
  }

  const playTestSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
    
    // Test notification
    if (Notification.permission === 'granted') {
      new Notification('Test Bildirimi 🔔', {
        body: 'Ses ve bildirim sistemi çalışıyor!',
        icon: '/images/logo/splash.png',
        tag: 'test-notification'
      })
    }
  }

  // İlk yüklemede localStorage'dan al
  useEffect(() => {
    const savedSound = localStorage.getItem('orderAlarmSound')
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true')
    }
  }, [])

  return {
    soundEnabled,
    toggleSound,
    playTestSound
  }
}
