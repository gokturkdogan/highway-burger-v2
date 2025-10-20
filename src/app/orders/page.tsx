'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Package, Clock, CheckCircle, XCircle, ChevronRight, MapPin, CreditCard, Truck, ArrowLeft, UserCircle, Phone } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get('/api/user/orders')
      return res.data
    },
    enabled: status === 'authenticated',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (!mounted || isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'from-green-500 to-green-600'
      case 'on_the_way':
        return 'from-blue-500 to-blue-600'
      case 'preparing':
        return 'from-yellow-500 to-yellow-600'
      case 'received':
        return 'from-[#bb7c05] to-[#d49624]'
      case 'cancelled':
        return 'from-red-500 to-red-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-white" />
      case 'on_the_way':
        return <Truck className="w-5 h-5 text-white" />
      case 'preparing':
        return <Clock className="w-5 h-5 text-white" />
      case 'received':
        return <Package className="w-5 h-5 text-white" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-white" />
      default:
        return <Package className="w-5 h-5 text-white" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Teslim Edildi'
      case 'on_the_way':
        return 'Yolda'
      case 'preparing':
        return 'Hazırlanıyor'
      case 'received':
        return 'Sipariş Alındı'
      case 'cancelled':
        return 'İptal Edildi'
      default:
        return status
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">
            ✓ Ödendi
          </span>
        )
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-300">
            ⏳ Ödeme Bekliyor
          </span>
        )
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
            ✗ Ödeme Başarısız
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Header - Mobile */}
      <div className="md:hidden bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Siparişlerim</h1>
            <p className="text-white/90 text-sm">Geçmiş siparişleriniz</p>
          </div>
        </div>
      </div>

      {/* Header - Desktop */}
      <div className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50]">Siparişlerim</h1>
              <p className="text-gray-600">Geçmiş siparişlerinizi görüntüleyin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto py-6">
        {!orders || orders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeIn">
            <div className="relative">
              {/* Background Circles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#bb7c05]/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-6 w-12 h-12 bg-[#d49624]/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              
              {/* Main Icon */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#bb7c05]/20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center animate-bounce">
                  <Package className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#2c3e50] text-center mb-3">
                  Henüz Sipariş Yok
                </h2>
                
                <p className="text-gray-600 text-center mb-6 max-w-sm leading-relaxed">
                  İlk siparişinizi verin ve lezzetli burgerlerimizin tadını çıkarın!
                </p>
                
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-center"
                >
                  Alışverişe Başla
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4 animate-fadeIn">
            {orders.map((order: any, index: number) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-[#bb7c05]/30 transition-all duration-300 hover:shadow-xl animate-fadeIn"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getStatusColor(order.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="font-bold text-[#2c3e50]">
                          Sipariş #{order.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Payment Method & Status */}
                  <div className="flex items-center justify-between gap-3">
                    {order.paymentMethod && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    )}
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4">
                  {/* Total */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Package className="w-5 h-5" />
                      <span className="font-medium">Toplam Tutar</span>
                    </div>
                    <div className="text-2xl font-black text-[#bb7c05]">
                      {order.total.toFixed(2)}₺
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 py-3 rounded-xl font-bold hover:from-[#bb7c05] hover:to-[#d49624] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <span>Detayları Görüntüle</span>
                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                      expandedOrderId === order.id ? 'rotate-90 group-hover:translate-x-0' : 'group-hover:translate-x-1'
                    }`} />
                  </button>

                  {/* Order Details - Expandable */}
                  {expandedOrderId === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-slideDown">
                      {/* Order Items */}
                      <div>
                        <h3 className="font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#bb7c05]" />
                          Sipariş İçeriği
                        </h3>
                        <div className="space-y-2">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item: any, idx: number) => (
                              <div 
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {item.product?.imageUrl && (
                                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-200">
                                      <img
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900">
                                      {item.product?.name || 'Ürün'}
                                    </div>
                                    {item.extraText && (
                                      <div className="text-xs text-[#bb7c05] font-semibold mt-0.5">
                                        {item.selectedOption === 'first' 
                                          ? item.extraText.split('/')[0] 
                                          : item.extraText.split('/')[1] || item.extraText
                                        }
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {item.quantity} adet × {item.price.toFixed(2)}₺
                                    </div>
                                  </div>
                                </div>
                                <div className="font-bold text-[#bb7c05]">
                                  {(item.price * item.quantity).toFixed(2)}₺
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 text-center py-2">
                              Ürün bilgisi bulunamadı
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      {(order.deliveryName || order.deliveryAddress) && (
                        <div>
                          <h3 className="font-bold text-[#2c3e50] mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#bb7c05]" />
                            Teslimat Adresi
                          </h3>
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                            <div className="space-y-2 text-sm">
                              {order.deliveryName && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <UserCircle className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium text-gray-900">{order.deliveryName}</span>
                                </div>
                              )}
                              {order.deliveryEmail && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                  </div>
                                  <span className="text-gray-700">{order.deliveryEmail}</span>
                                </div>
                              )}
                              {order.deliveryPhone && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="text-gray-700">{order.deliveryPhone}</span>
                                </div>
                              )}
                              {(order.deliveryCity || order.deliveryDistrict) && (
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {order.deliveryCity} {order.deliveryDistrict && `/ ${order.deliveryDistrict}`}
                                    </div>
                                    {order.deliveryAddress && (
                                      <div className="text-gray-600 leading-relaxed mt-1">
                                        {order.deliveryAddress}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      <div className="p-4 bg-gradient-to-br from-[#bb7c05]/5 to-[#d49624]/5 rounded-xl border border-[#bb7c05]/20">
                        <div className="space-y-2 text-sm">
                          {order.discount > 0 && (
                            <>
                              <div className="flex justify-between text-gray-600">
                                <span>Ara Toplam</span>
                                <span>{(order.total + order.discount).toFixed(2)}₺</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>İndirim</span>
                                <span>-{order.discount.toFixed(2)}₺</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-lg font-bold text-[#2c3e50] pt-2 border-t border-[#bb7c05]/20">
                            <span>Toplam</span>
                            <span className="text-[#bb7c05]">{order.total.toFixed(2)}₺</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 1000px;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

