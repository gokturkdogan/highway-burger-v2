'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, User, Phone, Mail, CreditCard, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">Harita yükleniyor...</div>
})

interface OrderDetailModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (orderId: number, status?: string, paymentStatus?: string) => void
}

export default function OrderDetailModal({ order, isOpen, onClose, onUpdateStatus }: OrderDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(order.status)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(order.paymentStatus)
  const [isSaving, setIsSaving] = useState(false)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Haritayı sadece modal tamamen açıldıktan sonra göster
      const timer = setTimeout(() => {
        setShowMap(true)
      }, 300)
      
      return () => {
        clearTimeout(timer)
      }
    } else {
      document.body.style.overflow = 'unset'
      setShowMap(false)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
      setShowMap(false)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleUpdateStatus = () => {
    const statusChanged = selectedStatus !== order.status
    const paymentStatusChanged = selectedPaymentStatus !== order.paymentStatus

    if (statusChanged || paymentStatusChanged) {
      setIsSaving(true)
      
      onUpdateStatus(
        order.id,
        statusChanged ? selectedStatus : undefined,
        paymentStatusChanged ? selectedPaymentStatus : undefined
      )
      
      // Başarılı güncellemeden sonra modal'ı kapat
      setTimeout(() => {
        setIsSaving(false)
        handleClose()
      }, 1500)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-500'
      case 'preparing': return 'bg-yellow-500'
      case 'on_the_way': return 'bg-purple-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
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

  if (!isOpen && !isClosing) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`fixed inset-x-0 bottom-0 md:inset-0 z-[9999] flex md:items-center md:justify-center p-0 md:p-4 transition-all duration-300 ${
        isClosing ? 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95' : 'translate-y-0 md:opacity-100 md:scale-100'
      }`}>
        <div className="bg-white w-full h-[90vh] md:h-auto md:max-w-4xl md:max-h-[90vh] rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Mobile Handle Bar */}
          <div className="md:hidden flex justify-center pt-3 pb-2 bg-gradient-to-r from-[#bb7c05] to-[#d49624]">
            <div className="w-12 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Sipariş Detayı</h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white text-sm md:text-base">
              <div>
                <div className="text-xs md:text-sm opacity-90">Sipariş No</div>
                <div className="text-lg md:text-xl font-bold">#{order.id}</div>
              </div>
              <div className="h-8 md:h-12 w-px bg-white/30"></div>
              <div className="flex-1 min-w-[120px]">
                <div className="text-xs md:text-sm opacity-90">Tarih</div>
                <div className="font-medium text-xs md:text-base">
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="h-8 md:h-12 w-px bg-white/30"></div>
              <div>
                <div className="text-xs md:text-sm opacity-90">Toplam</div>
                <div className="text-lg md:text-xl font-bold">₺{order.total.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Status Controls */}
            <div className="space-y-6">
              {/* Order Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Sipariş Durumu
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { value: 'received', label: 'Alındı', icon: Clock, color: 'blue' },
                    { value: 'preparing', label: 'Hazırlanıyor', icon: Package, color: 'yellow' },
                    { value: 'on_the_way', label: 'Yolda', icon: Truck, color: 'purple' },
                    { value: 'delivered', label: 'Teslim Edildi', icon: CheckCircle, color: 'green' },
                    { value: 'cancelled', label: 'İptal', icon: XCircle, color: 'red' },
                  ].map((status) => {
                    const Icon = status.icon
                    const isSelected = selectedStatus === status.value
                    const colorClasses = {
                      blue: isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                      yellow: isSelected ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                      purple: isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
                      green: isSelected ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                      red: isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                    }
                    
                    return (
                      <button
                        key={status.value}
                        onClick={() => !isSaving && setSelectedStatus(status.value)}
                        disabled={isSaving}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 ${
                          colorClasses[status.color as keyof typeof colorClasses]
                        } ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'animate-bounce' : ''}`} />
                        <span className="text-xs font-bold text-center leading-tight">{status.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Ödeme Durumu
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'pending', label: 'Bekliyor', icon: Clock, color: 'yellow' },
                    { value: 'paid', label: 'Ödendi', icon: CheckCircle, color: 'green' },
                    { value: 'failed', label: 'Başarısız', icon: XCircle, color: 'red' },
                  ].map((payment) => {
                    const Icon = payment.icon
                    const isSelected = selectedPaymentStatus === payment.value
                    const colorClasses = {
                      yellow: isSelected ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
                      green: isSelected ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                      red: isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                    }
                    
                    return (
                      <button
                        key={payment.value}
                        onClick={() => !isSaving && setSelectedPaymentStatus(payment.value)}
                        disabled={isSaving}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                          colorClasses[payment.color as keyof typeof colorClasses]
                        } ${isSelected ? 'scale-105 shadow-lg' : 'hover:scale-102'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Icon className={`w-6 h-6 ${isSelected ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-bold">{payment.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Update Button */}
            {(selectedStatus !== order.status || selectedPaymentStatus !== order.paymentStatus) && (
              <div className="relative animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-xl blur opacity-50 animate-pulse"></div>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isSaving}
                  className={`relative w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSaving 
                      ? 'opacity-75 cursor-not-allowed' 
                      : 'hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#bb7c05]" />
                Müşteri Bilgileri
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-600">İsim</div>
                    <div className="font-medium text-gray-900">
                      {order.deliveryName || order.user?.name || 'Misafir'}
                    </div>
                  </div>
                </div>

                {order.deliveryEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">E-posta</div>
                      <div className="font-medium text-gray-900">{order.deliveryEmail}</div>
                    </div>
                  </div>
                )}

                {order.deliveryPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Telefon</div>
                      <div className="font-medium text-gray-900">{order.deliveryPhone}</div>
                    </div>
                  </div>
                )}

                {order.orderNote && (
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Sipariş Notu</div>
                      <div className="font-medium text-gray-900 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-1">
                        📝 {order.orderNote}
                      </div>
                    </div>
                  </div>
                )}

                {order.paymentMethod && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Ödeme Yöntemi</div>
                      <div className="font-medium text-gray-900">{order.paymentMethod}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#bb7c05]" />
                Teslimat Adresi
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Adres</div>
                  <div className="font-medium text-gray-900">
                    {order.deliveryAddress}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.deliveryDistrict} / {order.deliveryCity}
                  </div>
                </div>

                {/* Map */}
                {order.deliveryLatitude && order.deliveryLongitude && (
                  <div className="mt-4">
                    {showMap ? (
                      <MapView 
                        key={order.id}
                        latitude={order.deliveryLatitude} 
                        longitude={order.deliveryLongitude}
                        address={order.deliveryAddress}
                      />
                    ) : (
                      <div className="h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#bb7c05] border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 rounded-2xl p-5">
              <h3 className="text-lg font-bold text-[#2c3e50] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#bb7c05]" />
                Sipariş Detayları
              </h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl">
                    {item.product.imageUrl && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.product.name}</div>
                      {item.extraText && item.selectedOption && (
                        <div className="text-xs text-gray-600">
                          {/* extraText formatı: "110/180gr" veya "110gr/180gr" gibi */}
                          {(() => {
                            const parts = item.extraText.split('/')
                            if (parts.length === 2) {
                              // İlk veya ikinci seçeneği göster
                              return item.selectedOption === 'first' ? parts[0].trim() : parts[1].trim()
                            }
                            return item.extraText
                          })()}
                        </div>
                      )}
                      {item.extraText && !item.selectedOption && (
                        <div className="text-xs text-gray-600">{item.extraText}</div>
                      )}
                      {!item.extraText && item.selectedOption && (
                        <div className="text-xs text-gray-600">
                          Seçenek: {item.selectedOption === 'first' ? 'Birinci' : 'İkinci'}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">x{item.quantity}</div>
                      <div className="font-bold text-[#bb7c05]">₺{item.price.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam</span>
                  <span>₺{(order.total + order.discount).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>İndirim</span>
                    <span>-₺{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-[#2c3e50] pt-2 border-t border-gray-200">
                  <span>Toplam</span>
                  <span>₺{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

