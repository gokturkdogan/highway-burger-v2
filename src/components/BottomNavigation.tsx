'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useEffect, useState } from 'react'

export default function BottomNavigation() {
  const itemCount = useCart((state) => state.getItemCount())
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.includes(path)) return true
    return false
  }

  // Login ve register sayfalarında appbar'ı gizle
  const shouldHideAppBar = pathname.includes('/auth/login') || pathname.includes('/auth/register')

  // Login/register sayfalarında appbar'ı render etme
  if (shouldHideAppBar) {
    return null
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] animate-slideUp">
      {/* Glassmorphism Background */}
      <div className="relative bg-white/80 backdrop-blur-xl border-t border-gray-200/50" style={{boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.12), 0 -4px 15px rgba(187, 124, 5, 0.1)'}}>
        {/* Animated Top Border */}
        <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#bb7c05] to-transparent opacity-50"></div>
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bb7c05]/50 to-transparent animate-shimmer"></div>
        
        <div className="flex justify-between items-center px-5 py-3">
          {/* Left Side */}
          <div className="flex justify-between gap-2">
            {/* Home */}
            <Link href="/" className="relative group">
              <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                  : 'hover:bg-[#bb7c05]/10 hover:scale-105'
              }`}>
                <Home className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
                {isActive('/') && (
                  <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </Link>

                {/* Burger */}
                <Link href="/categories/burgers" className="relative group">
                  <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                    isActive('/categories/burgers') 
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                      : 'hover:bg-[#bb7c05]/10 hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive('/categories/burgers') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                    }`} viewBox="0 0 512 512" fill="currentColor">
                      <path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/>
                    </svg>
                    {isActive('/categories/burgers') && (
                      <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>

                {/* Köfte */}
                <Link href="/categories/kofte" className="relative group">
                  <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                    isActive('/categories/kofte') 
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                      : 'hover:bg-[#bb7c05]/10 hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive('/categories/kofte') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                    }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="2" rx="1"/>
                      <rect x="3" y="15" width="18" height="2" rx="1"/>
                      <circle cx="7" cy="6" r="2"/>
                      <circle cx="12" cy="7" r="2"/>
                      <circle cx="17" cy="6" r="2"/>
                      <line x1="5" y1="20" x2="19" y2="20" strokeLinecap="round"/>
                    </svg>
                    {isActive('/categories/kofte') && (
                      <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>
          </div>

          {/* Center - Cart */}
          <Link href="/cart" className="relative group z-[101]">
            <div className="flex justify-center items-center bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full w-20 h-20 absolute -top-14 left-1/2 transform -translate-x-1/2 border-4 border-white transition-all duration-400 group-hover:-translate-y-2 group-hover:scale-110 group-hover:rotate-6" style={{boxShadow: '0 12px 40px rgba(187, 124, 5, 0.45), 0 6px 20px rgba(0, 0, 0, 0.25)'}}>
              <ShoppingCart className="w-10 h-10 text-white transition-transform group-hover:scale-110" />
              {mounted && itemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-extrabold w-7 h-7 rounded-full flex items-center justify-center border-3 border-white shadow-lg animate-bounce">
                  {itemCount}
                </div>
              )}
              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#bb7c05] opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex justify-between gap-2">
              {/* Sandwich */}
                <Link href="/categories/sandwiches" className="relative group">
                  <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                    isActive('/categories/sandwiches') 
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                      : 'hover:bg-[#bb7c05]/10 hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive('/categories/sandwiches') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                    }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v1H4V8z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1H4v1z" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="9" width="18" height="5" rx="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {isActive('/categories/sandwiches') && (
                      <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>

                {/* Menu */}
                <Link href="/categories/menus" className="relative group">
                  <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                    isActive('/categories/menus') 
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                      : 'hover:bg-[#bb7c05]/10 hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive('/categories/menus') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                    }`} viewBox="0 0 448 512" fill="currentColor">
                      <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                    </svg>
                    {isActive('/categories/menus') && (
                      <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>

                {/* Drink */}
                <Link href="/categories/drinks" className="relative group">
                  <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                    isActive('/categories/drinks') 
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                      : 'hover:bg-[#bb7c05]/10 hover:scale-105'
                  }`}>
                    <svg className={`w-5 h-5 transition-all duration-300 ${
                      isActive('/categories/drinks') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                    }`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 22h10M12 18v4M17 2H7l1 12c0 2.2 1.8 4 4 4s4-1.8 4-4l1-12z" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2v7" strokeLinecap="round"/>
                    </svg>
                    {isActive('/categories/drinks') && (
                      <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </div>
                </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}