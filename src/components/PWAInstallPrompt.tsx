'use client'

import { useEffect, useState } from 'react'

type DeferredPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const STORAGE_KEY = 'pwa-install-dismissed-v1'
const COOLDOWN_DAYS = 7
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isAndroid = /android/i.test(ua)
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  const isMobileDevice = isAndroid || isIOS || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1)

  useEffect(() => {
    if (!isMobileDevice) return

    const isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone

    // Dismiss cool-down kontrolü
    let shouldSuppress = false
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        // Geriye dönük uyumluluk: '1' ise, bugünden saymaya başla
        const dismissedAt = raw === '1' ? Date.now() : Number(raw)
        if (!Number.isNaN(dismissedAt)) {
          const elapsed = Date.now() - dismissedAt
          shouldSuppress = elapsed < COOLDOWN_MS
        }
      }
    }

    if (isStandalone || shouldSuppress) return

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      if (!isMobileDevice) return
      setDeferredPrompt(e as DeferredPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', () => {
      setVisible(false)
      setDeferredPrompt(null)
      localStorage.removeItem(STORAGE_KEY)
    })

    // Android fallback hint: if event doesn't arrive shortly, show instructions banner
    const timer = window.setTimeout(() => {
      if (!deferredPrompt && isAndroid) {
        setHintVisible(true)
      }
    }, 2500)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    try {
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setVisible(false)
        setDeferredPrompt(null)
      } else {
        // Keep visible or let user close
      }
    } catch {
      // ignore
    }
  }

  const handleClose = () => {
    setVisible(false)
    // Zaman damgası kaydet: 7 gün sonra tekrar gösterilsin
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  }

  const handleHintClose = () => {
    setHintVisible(false)
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
  }

  useEffect(() => {
    if (visible) {
      // start slide-up animation on mount
      const t = requestAnimationFrame(() => setMounted(true))
      return () => cancelAnimationFrame(t)
    } else {
      setMounted(false)
    }
  }, [visible])

  if (!isMobileDevice) return null
  if (!visible && !(hintVisible && isAndroid)) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      >
        {/* Soft vignette + subtle pattern */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(251,191,36,0.25),transparent)]" />
      </div>

      {/* Card */}
      {/* Main install modal (when beforeinstallprompt is available) */}
      {visible && (
        <div
          className={`relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/80 ${mounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}
          role="dialog"
          aria-modal="true"
          aria-label="Uygulamayı Yükle"
        >
        {/* Accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-600" />

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-400 blur-[10px] opacity-40" />
                <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-amber-100 dark:bg-neutral-900 dark:ring-neutral-800">
                  <img
                    src="/images/logo/splash.png"
                    alt="Highway Burger"
                    className="h-9 w-9 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <div className="text-[15px] font-extrabold tracking-tight text-gray-900 dark:text-white">Highway Burger</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Ana ekrana ekleyin</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Kapat"
              className="-m-2 inline-flex rounded-full p-2 text-gray-500 transition hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
            </button>
          </div>

          <p className="mt-3 text-[13px] leading-6 text-gray-600 dark:text-gray-300">
            {isIOS ? (
              <>
                iOS için Safari'de <span className="font-medium">Paylaş</span> → <span className="font-semibold">Ana Ekrana Ekle</span> adımlarını izleyin.
              </>
            ) : (
              <>Uygulamayı cihazınıza ekleyin; tam ekran deneyim ve hızlı erişim sağlayın.</>
            )}
          </p>

          <div className="mt-4 flex items-center gap-2">
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                Uygulamayı Yükle
              </button>
            )}
            <button
              onClick={handleClose}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-white/10 dark:bg-neutral-800/70 dark:text-gray-100"
            >
              Daha Sonra
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Android fallback hint banner (when beforeinstallprompt is not available) */}
      {!visible && hintVisible && isAndroid && (
        <div className={`relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/90 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900/80 ${mounted ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-95 opacity-0'}`}>
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/logo/splash.png" alt="Highway Burger" className="h-9 w-9 rounded-lg" />
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Ana ekrana ekleyin</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Chrome menüsünden "Ana ekrana ekle"yi seçin.</div>
                </div>
              </div>
              <button onClick={handleHintClose} aria-label="Kapat" className="-m-2 rounded-full p-2 text-gray-500 hover:bg-black/5 dark:hover:bg-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
              Chrome'da sağ üstteki üç noktaya dokunun → "Ana ekrana ekle".
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


