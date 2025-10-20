'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { UserCircle, LogIn, UserPlus, X, ShoppingCart, Home, Package, MapPin, Settings } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { data: session } = useSession()
  const itemCount = useCart((state) => state.getItemCount())
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.includes(path)) return true
    return false
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Login, register ve admin sayfalarında header'ı gizle
  const shouldHideHeader = pathname.includes('/auth/login') || pathname.includes('/auth/register') || pathname.startsWith('/admin')

  if (shouldHideHeader) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Main Header - Single White Div */}
        <div className="bg-white px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo/splash.png"
                alt="Highway Burger Logo"
                width={40}
                height={48}
                className="object-contain"
                priority
              />
              <h1 className="hidden md:block text-lg font-display font-semibold text-[#bb7c05] tracking-wide relative">
                HIGHWAY BURGER
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#bb7c05] rounded-full animate-border-pulse w-full"></div>
              </h1>
            </Link>

            {/* Center - Title (Mobile) */}
            <div className="md:hidden relative">
              <h1 className="text-lg font-display font-semibold text-[#bb7c05] tracking-wide">
                HIGHWAY BURGER
              </h1>
              {/* Animated Border */}
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#bb7c05] rounded-full animate-border-pulse"></div>
            </div>

            {/* Center - Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <Home className="w-5 h-5" />
                <span className="text-xs font-medium">Ana Sayfa</span>
              </Link>
              <Link href="/categories/burgers" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/categories/burgers') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/>
                </svg>
                <span className="text-xs font-medium">Burgerler</span>
              </Link>
              <Link href="/categories/kofte" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/categories/kofte') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="2" rx="1"/>
                  <rect x="3" y="15" width="18" height="2" rx="1"/>
                  <circle cx="7" cy="6" r="2"/>
                  <circle cx="12" cy="7" r="2"/>
                  <circle cx="17" cy="6" r="2"/>
                  <line x1="5" y1="20" x2="19" y2="20" strokeLinecap="round"/>
                </svg>
                <span className="text-xs font-medium">Köfteler</span>
              </Link>
              <Link href="/categories/sandwiches" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/categories/sandwiches') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v1H4V8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1H4v1z" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="9" width="18" height="5" rx="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-medium">Sandviçler</span>
              </Link>
              <Link href="/categories/menus" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/categories/menus') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 448 512" fill="currentColor">
                  <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                </svg>
                <span className="text-xs font-medium">Menüler</span>
              </Link>
              <Link href="/categories/drinks" className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/categories/drinks') ? 'text-[#bb7c05]' : 'text-gray-600 hover:text-[#bb7c05]'}`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 22h10M12 18v4M17 2H7l1 12c0 2.2 1.8 4 4 4s4-1.8 4-4l1-12z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 2v7" strokeLinecap="round"/>
                </svg>
                <span className="text-xs font-medium">İçecekler</span>
              </Link>
            </nav>

            {/* Right - Cart & User Icon */}
            <div className="flex items-center gap-3">
              {/* Cart Icon (Desktop) */}
              <Link href="/cart" className="hidden md:flex relative">
                <button className="w-12 h-12 border-2 border-[#bb7c05] rounded-full flex items-center justify-center hover:bg-[#bb7c05]/10 transition-colors animate-glow">
                  <ShoppingCart className="h-6 w-6 text-[#bb7c05]" />
                  {mounted && itemCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                      {itemCount}
                    </div>
                  )}
                </button>
              </Link>

              {/* User Icon */}
              <button
                onClick={toggleSidebar}
                className="relative w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'linear-gradient(135deg, #bb7c05 0%, #d49624 100%)',
                  boxShadow: '0 4px 15px rgba(187, 124, 5, 0.3), 0 2px 8px rgba(187, 124, 5, 0.2)'
                }}
              >
                {/* UserCircle Icon */}
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                
                {/* Hover Effect Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                
                {/* Pulse Animation */}
                <div className="absolute inset-0 rounded-full border border-[#bb7c05] opacity-0 animate-ping"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

        {/* Sidebar Overlay with Blur */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-[9999]"
            onClick={closeSidebar}
          />
        )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-3/4 md:w-80 lg:w-72 bg-gradient-to-br from-white to-gray-50 transform transition-transform duration-300 ease-in-out z-[10000] ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`} style={{boxShadow: '0 0 40px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1), -10px 0 30px rgba(0, 0, 0, 0.08)'}}>
        <div className="h-full flex flex-col justify-between">
          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex items-center gap-4 p-4 relative border-b border-[#bb7c05]/20" style={{boxShadow: '0 4px 15px rgba(187, 124, 5, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'}}>
                  <div className="w-13 h-13 border-3 border-[#bb7c05] rounded-full p-2.5 bg-gradient-to-br from-[#bb7c05]/8 to-[#d49624]/5 shadow-lg animate-pulse">
                    <UserCircle className="w-6 h-6 text-[#bb7c05]" />
                  </div>
              <span className="text-lg font-extrabold text-[#1a1a1a] tracking-wide">
                {session ? `Merhaba ${session.user?.name}` : 'Henüz Giriş Yapmadın'}
              </span>
              <div className="absolute bottom-0 left-0 w-15 h-0.5 bg-gradient-to-r from-[#bb7c05] to-[#d49624]"></div>
            </div>

            {/* Body Section */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {session ? (
                // Logged in user menu
                <>
                  <Link href="/profile" onClick={closeSidebar} className="block">
                    <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${
                      pathname === '/profile' 
                        ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05]/30 -translate-x-1.5' 
                        : 'bg-white border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5'
                    }`} style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
                      <div className={`w-9.5 h-9.5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 ${
                        pathname === '/profile' ? 'text-[#d49624]' : 'text-[#bb7c05]'
                      }`}>
                        <UserCircle className="w-full h-full" />
                      </div>
                      <span className={`text-[15px] font-bold transition-colors duration-300 ${
                        pathname === '/profile' ? 'text-[#bb7c05]' : 'text-[#2c3e50] group-hover:text-[#bb7c05]'
                      }`}>Profilim</span>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] transition-opacity duration-300 ${
                        pathname === '/profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}></div>
                    </div>
                  </Link>

                      <Link href="/address" onClick={closeSidebar} className="block">
                        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${
                          pathname === '/address' 
                            ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05]/30 -translate-x-1.5' 
                            : 'bg-white border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5'
                        }`} style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
                          <div className={`w-9.5 h-9.5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 ${
                            pathname === '/address' ? 'text-[#d49624]' : 'text-[#bb7c05]'
                          }`}>
                            <MapPin className="w-full h-full" />
                          </div>
                          <span className={`text-[15px] font-bold transition-colors duration-300 ${
                            pathname === '/address' ? 'text-[#bb7c05]' : 'text-[#2c3e50] group-hover:text-[#bb7c05]'
                          }`}>Adreslerim</span>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] transition-opacity duration-300 ${
                            pathname === '/address' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}></div>
                        </div>
                      </Link>

                      <Link href="/orders" onClick={closeSidebar} className="block">
                        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${
                          pathname === '/orders' 
                            ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05]/30 -translate-x-1.5' 
                            : 'bg-white border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5'
                        }`} style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
                          <div className={`w-9.5 h-9.5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 ${
                            pathname === '/orders' ? 'text-[#d49624]' : 'text-[#bb7c05]'
                          }`}>
                            <Package className="w-full h-full" />
                          </div>
                          <span className={`text-[15px] font-bold transition-colors duration-300 ${
                            pathname === '/orders' ? 'text-[#bb7c05]' : 'text-[#2c3e50] group-hover:text-[#bb7c05]'
                          }`}>Siparişlerim</span>
                          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] transition-opacity duration-300 ${
                            pathname === '/orders' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}></div>
                        </div>
                      </Link>

                      {/* Admin Panel - Only for Admin Users */}
                      {session?.user?.role === 'admin' && (
                        <Link href="/admin" onClick={closeSidebar} className="block">
                          <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 relative overflow-hidden group ${
                            pathname.startsWith('/admin') 
                              ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05]/30 -translate-x-1.5' 
                              : 'bg-white border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5'
                          }`} style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
                            <div className={`w-9.5 h-9.5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 ${
                              pathname.startsWith('/admin') ? 'text-[#d49624]' : 'text-[#bb7c05]'
                            }`}>
                              <Settings className="w-full h-full" />
                            </div>
                            <span className={`text-[15px] font-bold transition-colors duration-300 ${
                              pathname.startsWith('/admin') ? 'text-[#bb7c05]' : 'text-[#2c3e50] group-hover:text-[#bb7c05]'
                            }`}>Admin Paneli</span>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] transition-opacity duration-300 ${
                              pathname.startsWith('/admin') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}></div>
                          </div>
                        </Link>
                      )}

                      <button onClick={() => { signOut(); closeSidebar(); }} className="w-full">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
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
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
                      <div className="w-9.5 h-9.5 text-[#bb7c05] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1">
                        <LogIn className="w-full h-full" />
                      </div>
                      <span className="text-[15px] font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors duration-300">Giriş Yap</span>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#bb7c05] to-[#d49624] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  <Link href="/auth/register" onClick={closeSidebar} className="block">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#bb7c05]/15 hover:-translate-x-1.5 relative overflow-hidden group" style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05)'}}>
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
          <div className="p-4 relative border-t border-[#bb7c05]/20" style={{boxShadow: '0 -4px 15px rgba(187, 124, 5, 0.1), 0 -2px 8px rgba(0, 0, 0, 0.05)'}}>
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

