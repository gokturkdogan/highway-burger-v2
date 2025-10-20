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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 flex justify-between items-center px-5 py-3 bg-white shadow-2xl z-50 animate-slideUp" style={{boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.12), 0 -4px 15px rgba(187, 124, 5, 0.1)'}}>
      {/* Shimmer Effect */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#bb7c05]/30 to-transparent animate-shimmer"></div>
      
      {/* Left Side */}
      <div className="flex justify-between gap-2">
        {/* Home */}
        <Link href="/" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <Home className={`w-6 h-6 transition-all duration-350 ${isActive('/') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>

        {/* Burger */}
        <Link href="/categories/burgers" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/categories/burgers') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <Utensils className={`w-6 h-6 transition-all duration-350 ${isActive('/categories/burgers') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>

        {/* Toast */}
        <Link href="/categories/toast" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/categories/toast') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <Sandwich className={`w-6 h-6 transition-all duration-350 ${isActive('/categories/toast') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>
      </div>

      {/* Center - Cart */}
      <Link href="/cart" className="relative">
        <div className={`flex justify-center items-center bg-[#bb7c05] rounded-full w-20 h-20 absolute -top-14 left-1/2 transform -translate-x-1/2 shadow-2xl border-3 border-white transition-all duration-400 ${mounted && itemCount > 0 ? 'hover:-translate-y-2 hover:scale-110' : 'hover:-translate-y-2 hover:scale-110'}`} style={{boxShadow: '0 12px 40px rgba(187, 124, 5, 0.45), 0 6px 20px rgba(0, 0, 0, 0.25)'}}>
          <ShoppingCart className="w-12 h-12 text-white" />
          {mounted && itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center border-3 border-white">
              {itemCount}
            </div>
          )}
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex justify-between gap-2">
        {/* Sandwich */}
        <Link href="/categories/sandwiches" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/categories/sandwiches') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <Utensils className={`w-6 h-6 transition-all duration-350 ${isActive('/categories/sandwiches') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>

        {/* Menu */}
        <Link href="/categories/menus" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/categories/menus') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <BookOpen className={`w-6 h-6 transition-all duration-350 ${isActive('/categories/menus') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>

        {/* Drink */}
        <Link href="/categories/drinks" className={`w-12 h-12 flex justify-center items-center rounded-2xl transition-all duration-350 relative ${isActive('/categories/drinks') ? 'bg-[#bb7c05]/10 shadow-md' : 'hover:bg-[#bb7c05]/5'}`}>
          <Coffee className={`w-6 h-6 transition-all duration-350 ${isActive('/categories/drinks') ? 'text-[#bb7c05]' : 'text-[#bb7c05]/80'}`} />
        </Link>
      </div>
    </nav>
  )
}