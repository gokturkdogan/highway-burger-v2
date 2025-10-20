'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, Utensils, Coffee, Sandwich, BookOpen } from 'lucide-react'
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
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
                <Utensils className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/categories/burgers') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
                {isActive('/categories/burgers') && (
                  <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </Link>

            {/* Toast */}
            <Link href="/categories/toast" className="relative group">
              <div className={`w-12 h-12 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 ${
                isActive('/categories/toast') 
                  ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] shadow-lg scale-105' 
                  : 'hover:bg-[#bb7c05]/10 hover:scale-105'
              }`}>
                <Sandwich className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/categories/toast') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
                {isActive('/categories/toast') && (
                  <div className="absolute -bottom-1 w-8 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </Link>
          </div>

          {/* Center - Cart */}
          <Link href="/cart" className="relative group">
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
                <Utensils className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/categories/sandwiches') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
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
                <BookOpen className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/categories/menus') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
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
                <Coffee className={`w-5 h-5 transition-all duration-300 ${
                  isActive('/categories/drinks') ? 'text-white' : 'text-[#bb7c05]/70 group-hover:text-[#bb7c05]'
                }`} />
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