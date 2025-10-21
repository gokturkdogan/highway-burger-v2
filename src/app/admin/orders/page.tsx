'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  Package,
  Eye,
  Filter,
  Search,
  Volume2,
  VolumeX,
  Bell
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import OrderDetailModal from '@/components/admin/OrderDetailModal'
import { useOrderAlarm } from '@/hooks/useOrderAlarm'

interface Order {
  id: number
  userId: number | null
  total: number
  discount: number
  status: string
  paymentStatus: string
  paymentMethod: string | null
  deliveryName: string | null
  deliveryEmail: string | null
  deliveryPhone: string | null
  deliveryCity: string | null
  deliveryDistrict: string | null
  deliveryAddress: string | null
  deliveryLatitude: number | null
  deliveryLongitude: number | null
  createdAt: string
  user: {
    id: number
    name: string | null
    email: string
  } | null
  items: Array<{
    id: number
    quantity: number
    price: number
    selectedOption: string | null
    extraText: string | null
    product: {
      id: number
      name: string
      imageUrl: string | null
    }
  }>
}

export default function AdminOrdersPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { soundEnabled, toggleSound, playTestSound } = useOrderAlarm()

  // Fetch ALL orders (no filter on API)
  const { data: allOrders, isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/orders')
      return res.data
    },
  })

  // Filter orders based on selected status (frontend filtering)
  const orders = selectedStatus === 'all' 
    ? allOrders 
    : allOrders?.filter(o => o.status === selectedStatus)

  // Update order status
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, paymentStatus }: { orderId: number, status?: string, paymentStatus?: string }) => {
      const res = await axios.patch('/api/admin/orders', { orderId, status, paymentStatus })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
      toast.success('Sipariş güncellendi', 2000)
    },
    onError: () => {
      toast.error('Sipariş güncellenemedi', 3000)
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-700'
      case 'preparing': return 'bg-yellow-100 text-yellow-700'
      case 'on_the_way': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received': return 'Alındı'
      case 'preparing': return 'Hazırlanıyor'
      case 'on_the_way': return 'Yolda'
      case 'delivered': return 'Teslim Edildi'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'paid': return 'bg-green-100 text-green-700'
      case 'failed': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor'
      case 'paid': return 'Ödendi'
      case 'failed': return 'Başarısız'
      default: return status
    }
  }

  const filteredOrders = orders?.filter(order => {
    const searchLower = searchTerm.toLowerCase()
    return (
      order.id.toString().includes(searchLower) ||
      order.deliveryName?.toLowerCase().includes(searchLower) ||
      order.deliveryPhone?.toLowerCase().includes(searchLower) ||
      order.user?.email.toLowerCase().includes(searchLower)
    )
  })

  const stats = {
    all: allOrders?.length || 0,
    received: allOrders?.filter(o => o.status === 'received').length || 0,
    preparing: allOrders?.filter(o => o.status === 'preparing').length || 0,
    on_the_way: allOrders?.filter(o => o.status === 'on_the_way').length || 0,
    delivered: allOrders?.filter(o => o.status === 'delivered').length || 0,
    cancelled: allOrders?.filter(o => o.status === 'cancelled').length || 0,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#2c3e50] mb-2">Sipariş Yönetimi</h1>
              <p className="text-gray-600">Tüm siparişleri görüntüleyin ve yönetin</p>
            </div>
            
            {/* Ses Kontrol Butonları */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={playTestSound}
                className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="text-xs lg:text-sm font-medium">Test</span>
              </button>
              
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-xl transition-colors ${
                  soundEnabled 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span className="text-xs lg:text-sm font-medium">
                  {soundEnabled ? 'Ses Açık' : 'Ses Kapalı'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              selectedStatus === 'all' 
                ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] text-white' 
                : 'bg-white hover:shadow-xl'
            }`}
          >
            <Package className={`w-6 h-6 mb-2 ${selectedStatus === 'all' ? 'text-white' : 'text-gray-600'}`} />
            <div className={`text-2xl font-bold ${selectedStatus === 'all' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.all}
            </div>
            <div className={`text-sm ${selectedStatus === 'all' ? 'text-white/90' : 'text-gray-600'}`}>
              Tümü
            </div>
          </button>

          <button
            onClick={() => stats.received > 0 && setSelectedStatus('received')}
            disabled={stats.received === 0}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              stats.received === 0 
                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                : selectedStatus === 'received' 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                  : 'bg-white hover:shadow-xl'
            }`}
          >
            <Clock className={`w-6 h-6 mb-2 ${stats.received === 0 ? 'text-gray-400' : selectedStatus === 'received' ? 'text-white' : 'text-blue-600'}`} />
            <div className={`text-2xl font-bold ${stats.received === 0 ? 'text-gray-400' : selectedStatus === 'received' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.received}
            </div>
            <div className={`text-sm ${stats.received === 0 ? 'text-gray-400' : selectedStatus === 'received' ? 'text-white/90' : 'text-gray-600'}`}>
              Alındı
            </div>
          </button>

          <button
            onClick={() => stats.preparing > 0 && setSelectedStatus('preparing')}
            disabled={stats.preparing === 0}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              stats.preparing === 0 
                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                : selectedStatus === 'preparing' 
                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white' 
                  : 'bg-white hover:shadow-xl'
            }`}
          >
            <Package className={`w-6 h-6 mb-2 ${stats.preparing === 0 ? 'text-gray-400' : selectedStatus === 'preparing' ? 'text-white' : 'text-yellow-600'}`} />
            <div className={`text-2xl font-bold ${stats.preparing === 0 ? 'text-gray-400' : selectedStatus === 'preparing' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.preparing}
            </div>
            <div className={`text-sm ${stats.preparing === 0 ? 'text-gray-400' : selectedStatus === 'preparing' ? 'text-white/90' : 'text-gray-600'}`}>
              Hazırlanıyor
            </div>
          </button>

          <button
            onClick={() => stats.on_the_way > 0 && setSelectedStatus('on_the_way')}
            disabled={stats.on_the_way === 0}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              stats.on_the_way === 0 
                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                : selectedStatus === 'on_the_way' 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' 
                  : 'bg-white hover:shadow-xl'
            }`}
          >
            <Truck className={`w-6 h-6 mb-2 ${stats.on_the_way === 0 ? 'text-gray-400' : selectedStatus === 'on_the_way' ? 'text-white' : 'text-purple-600'}`} />
            <div className={`text-2xl font-bold ${stats.on_the_way === 0 ? 'text-gray-400' : selectedStatus === 'on_the_way' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.on_the_way}
            </div>
            <div className={`text-sm ${stats.on_the_way === 0 ? 'text-gray-400' : selectedStatus === 'on_the_way' ? 'text-white/90' : 'text-gray-600'}`}>
              Yolda
            </div>
          </button>

          <button
            onClick={() => stats.delivered > 0 && setSelectedStatus('delivered')}
            disabled={stats.delivered === 0}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              stats.delivered === 0 
                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                : selectedStatus === 'delivered' 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                  : 'bg-white hover:shadow-xl'
            }`}
          >
            <CheckCircle className={`w-6 h-6 mb-2 ${stats.delivered === 0 ? 'text-gray-400' : selectedStatus === 'delivered' ? 'text-white' : 'text-green-600'}`} />
            <div className={`text-2xl font-bold ${stats.delivered === 0 ? 'text-gray-400' : selectedStatus === 'delivered' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.delivered}
            </div>
            <div className={`text-sm ${stats.delivered === 0 ? 'text-gray-400' : selectedStatus === 'delivered' ? 'text-white/90' : 'text-gray-600'}`}>
              Teslim Edildi
            </div>
          </button>

          <button
            onClick={() => stats.cancelled > 0 && setSelectedStatus('cancelled')}
            disabled={stats.cancelled === 0}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              stats.cancelled === 0 
                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                : selectedStatus === 'cancelled' 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                  : 'bg-white hover:shadow-xl'
            }`}
          >
            <XCircle className={`w-6 h-6 mb-2 ${stats.cancelled === 0 ? 'text-gray-400' : selectedStatus === 'cancelled' ? 'text-white' : 'text-red-600'}`} />
            <div className={`text-2xl font-bold ${stats.cancelled === 0 ? 'text-gray-400' : selectedStatus === 'cancelled' ? 'text-white' : 'text-[#2c3e50]'}`}>
              {stats.cancelled}
            </div>
            <div className={`text-sm ${stats.cancelled === 0 ? 'text-gray-400' : selectedStatus === 'cancelled' ? 'text-white/90' : 'text-gray-600'}`}>
              İptal
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş No, İsim, Telefon veya Email ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Orders - Mobile Cards & Desktop Table */}
        
        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-4">
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-600">Sipariş No</div>
                    <div className="font-bold text-[#2c3e50]">#{order.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Tutar</div>
                    <div className="font-bold text-[#bb7c05]">₺{order.total.toFixed(2)}</div>
                  </div>
                </div>

                {/* Customer */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">Müşteri</div>
                  <div className="font-medium text-gray-900">
                    {order.deliveryName || order.user?.name || 'Misafir'}
                  </div>
                  <div className="text-sm text-gray-600">{order.deliveryPhone}</div>
                </div>

                {/* Date */}
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">Tarih</div>
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Status & Payment */}
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Durum</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">Ödeme</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Detayları Gör</span>
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500">
              Sipariş bulunamadı
            </div>
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Sipariş No</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Müşteri</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tarih</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Tutar</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ödeme</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Durum</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#2c3e50]">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {order.deliveryName || order.user?.name || 'Misafir'}
                          </div>
                          <div className="text-gray-600">
                            {order.deliveryPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#2c3e50]">₺{order.total.toFixed(2)}</div>
                        {order.discount > 0 && (
                          <div className="text-xs text-green-600">-₺{order.discount.toFixed(2)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </div>
                          {order.paymentMethod && (
                            <div className="text-xs text-gray-600">{order.paymentMethod}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#bb7c05] text-white rounded-xl hover:bg-[#d49624] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm font-medium">Detay</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Sipariş bulunamadı
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(orderId, status, paymentStatus) => {
            updateOrderMutation.mutate({ orderId, status, paymentStatus })
          }}
        />
      )}
    </div>
  )
}

