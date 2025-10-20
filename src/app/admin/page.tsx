'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/stats')
      return res.data
    },
    enabled: status === 'authenticated' && session?.user?.role === 'admin',
  })

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <div className="bg-white shadow-md py-6 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-[#2c3e50]">Admin Paneli</h1>
          <p className="text-gray-600 mt-1">Hoş geldin, {session.user.name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-1">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-gray-600 text-sm">Toplam Sipariş</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-1">
              ₺{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </h3>
            <p className="text-gray-600 text-sm">Toplam Gelir</p>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-1">
              {stats?.totalUsers || 0}
            </h3>
            <p className="text-gray-600 text-sm">Toplam Kullanıcı</p>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-1">
              {stats?.totalProducts || 0}
            </h3>
            <p className="text-gray-600 text-sm">Toplam Ürün</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/orders" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors">
                    Siparişleri Yönet
                  </h3>
                  <p className="text-gray-600 text-sm">Tüm siparişleri görüntüle ve yönet</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/products" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors">
                    Ürünleri Yönet
                  </h3>
                  <p className="text-gray-600 text-sm">Ürün ekle, düzenle ve sil</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all hover:scale-[1.02] group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2c3e50] group-hover:text-[#bb7c05] transition-colors">
                    Kategorileri Yönet
                  </h3>
                  <p className="text-gray-600 text-sm">Kategori ekle, düzenle ve sil</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

