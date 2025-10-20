'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users,
  LogOut,
  Menu,
  X,
  FolderTree
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  const menuItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Siparişler' },
    { href: '/admin/products', icon: Package, label: 'Ürünler' },
    { href: '/admin/categories', icon: FolderTree, label: 'Kategoriler' },
    { href: '/admin/users', icon: Users, label: 'Kullanıcılar' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              <Link href="/admin" className="flex items-center gap-3">
                <Image
                  src="/images/logo/splash.png"
                  alt="Highway Burger"
                  width={40}
                  height={48}
                  className="object-contain"
                />
                <div>
                  <h1 className="text-lg font-bold text-[#bb7c05]">HIGHWAY BURGER</h1>
                  <p className="text-xs text-gray-600">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-800">{session.user.name}</p>
                <p className="text-xs text-gray-600">{session.user.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline font-medium">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 mt-[72px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed left-0 top-[72px] bottom-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-[72px]">
        {children}
      </main>
    </div>
  )
}

