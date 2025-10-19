'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { User, LogIn, UserPlus, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const itemCount = useCart((state) => state.getItemCount())
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Main Header - Single White Div */}
        <div className="bg-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div>
              <Image
                src="/images/logo/splash.png"
                alt="Highway Burger Logo"
                width={40}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            {/* Center - Title */}
            <div className="relative">
              <h1 className="text-lg font-display font-semibold text-[#bb7c05] tracking-wide">
                HIGHWAY BURGER
              </h1>
              {/* Animated Border */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#bb7c05] rounded-full animate-border-pulse"></div>
            </div>

            {/* Right - User Icon */}
            <div>
              <button
                onClick={toggleSidebar}
                className="w-12 h-12 border-2 border-[#bb7c05] rounded-full flex items-center justify-center hover:bg-[#bb7c05]/10 transition-colors animate-glow"
              >
                <User className="h-6 w-6 text-[#bb7c05]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay with Blur */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-55 backdrop-blur-sm z-[9999]"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-3/4 bg-gradient-to-br from-white to-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out z-[10000] ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col justify-between">
          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-center gap-4 p-6 shadow-lg relative">
              <div className="w-13 h-13 border-3 border-[#bb7c05] rounded-full p-2.5 bg-gradient-to-br from-[#bb7c05]/8 to-[#d49624]/5 shadow-lg animate-pulse">
                <User className="w-6 h-6 text-[#bb7c05]" />
              </div>
              <span className="text-lg font-extrabold text-[#1a1a1a] tracking-wide">
                {session ? `Merhaba ${session.user?.name}` : 'Henüz Giriş Yapmadın'}
              </span>
              <div className="absolute bottom-0 left-0 w-15 h-0.5 bg-gradient-to-r from-[#bb7c05] to-[#d49624]"></div>
            </div>

            {/* Body Section */}
            <div className="flex-1 p-6 space-y-2.5 overflow-y-auto">
              {session ? (
                // Logged in user menu
                <>
                  <Link href="/profile" onClick={closeSidebar} className="block">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <User className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Profilim</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  <Link href="/address" onClick={closeSidebar} className="block">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <User className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Adreslerim</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                    <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                      <User className="w-full h-full" />
                    </div>
                    <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Siparişlerim</span>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <button onClick={() => { signOut(); closeSidebar(); }} className="w-full">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <LogIn className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Çıkış Yap</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </button>
                </>
              ) : (
                // Guest user menu
                <>
                  <Link href="/auth/login" onClick={closeSidebar} className="block">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <LogIn className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Giriş Yap</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  <Link href="/auth/register" onClick={closeSidebar} className="block">
                    <div className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group">
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <UserPlus className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Üye Ol</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-6 shadow-lg relative">
            <div className="flex items-center gap-4.5">
              <Image
                src="/images/logo/splash.png"
                alt="Highway Burger Logo"
                width={68}
                height={68}
                className="rounded-2xl shadow-lg border-3 border-[#bb7c05]/20 p-1.5 bg-white transition-all duration-300"
              />
              <span className="text-base font-black text-[#1a1a1a] tracking-wide">
                Highway Burger
              </span>
            </div>
            <div className="absolute top-0 left-0 w-20 h-0.5 bg-gradient-to-r from-[#bb7c05] to-[#d49624]"></div>
          </div>
        </div>
      </div>
    </>
  )
}

