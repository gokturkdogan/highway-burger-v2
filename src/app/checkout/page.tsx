'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { MapPin, Plus, Edit2, CheckCircle, Truck, Clock, User, Phone, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import AddressModal from '@/components/AddressModal'

interface Address {
  id: number
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  fullAddress: string
  latitude?: number | null
  longitude?: number | null
  isDefault: boolean
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [guestAddress, setGuestAddress] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [showPaymentError, setShowPaymentError] = useState(false)
  const paymentMethodRef = useRef<HTMLDivElement>(null)

  const items = useCart((state) => state.items)
  const getTotal = useCart((state) => state.getTotal)
  const getTotalWithDiscount = useCart((state) => state.getTotalWithDiscount)
  const discount = useCart((state) => state.discount)

  // Store settings'i çek
  const { data: storeSettings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/settings')
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 dakika cache
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Store kapalıysa ana sayfaya yönlendir
  useEffect(() => {
    if (mounted && storeSettings?.isOpen === false) {
      toast.error('Mağaza şu an kapalı! Sipariş veremezsiniz.', 3000)
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, storeSettings?.isOpen])

  // Sepet boşsa anasayfaya yönlendir
  useEffect(() => {
    if (mounted && items.length === 0) {
      toast.warning('Sepetiniz boş!', 2000)
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, items.length])

  // Login kullanıcı için adresleri çek
  const { data: addresses, isLoading } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await axios.get('/api/addresses')
      return res.data
    },
    enabled: status === 'authenticated',
  })

  // İlk varsayılan adresi seç
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(a => a.isDefault) || addresses[0]
      setSelectedAddressId(defaultAddress.id)
    }
  }, [addresses, selectedAddressId])

  // Adres ekleme mutation
  const addAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      if (status === 'authenticated') {
        const res = await axios.post('/api/addresses', data)
        return res.data
      }
      return data
    },
    onSuccess: (data) => {
      if (status === 'authenticated') {
        queryClient.invalidateQueries({ queryKey: ['addresses'] })
        toast.success('Adres kaydedildi!', 2000)
        setSelectedAddressId(data.id)
      } else {
        setGuestAddress(data)
        toast.success('Adres kaydedildi!', 2000)
      }
      setIsAddressModalOpen(false)
    },
    onError: () => {
      toast.error('Adres eklenirken hata oluştu!', 3000)
    },
  })

  const handlePlaceOrder = async () => {
    if (status === 'authenticated' && !selectedAddressId) {
      toast.warning('Lütfen bir teslimat adresi seçin', 3000)
      return
    }
    if (status === 'unauthenticated' && !guestAddress) {
      toast.warning('Lütfen teslimat adresinizi ekleyin', 3000)
      return
    }
    if (!paymentMethod) {
      toast.warning('Lütfen bir ödeme yöntemi seçin', 3000)
      // Ödeme yöntemi seçimine scroll ve error göster
      setShowPaymentError(true)
      paymentMethodRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      // 3 saniye sonra error'u kaldır
      setTimeout(() => setShowPaymentError(false), 3000)
      return
    }

    try {
      // Eğer Online Kredi Kartı değilse, sadece sipariş oluştur
      if (paymentMethod !== 'online') {
        toast.info('Sipariş oluşturuluyor...', 2000)

        // Sipariş oluştur
        const order = await axios.post('/api/orders', {
          total: getTotalWithDiscount(),
          paymentMethod: paymentMethod === 'cash' ? 'Kapıda Nakit' : 'Kapıda Kredi Kartı',
          address: deliveryAddress,
          items: items,
        })

        toast.success('Sipariş başarıyla oluşturuldu!', 3000)
        
        // Başarı sayfasına yönlendir
        setTimeout(() => {
          router.push('/payment/success')
        }, 1500)
        
        return
      }

      // Online ödeme akışı
      toast.info('Ödeme sayfası hazırlanıyor...', 2000)

      // Sipariş oluştur
      const order = await axios.post('/api/orders', {
        total: getTotalWithDiscount(),
        paymentMethod: 'Online Kredi Kartı',
        address: deliveryAddress,
        items: items,
      })

      const orderId = order.data.id

      // Basket items
      const basketItems = items.map((item: any, index: number) => ({
        id: String(index + 1),
        name: item.name,
        category1: 'Food',
        itemType: 'PHYSICAL',
        price: String((item.price * item.quantity).toFixed(2)),
      }))

      // Buyer
      const nameParts = deliveryAddress!.fullName.split(' ')
      const buyer = {
        id: String(session?.user?.id || `guest_${orderId}`),
        name: nameParts[0] || 'Guest',
        surname: nameParts.slice(1).join(' ') || 'User',
        gsmNumber: deliveryAddress!.phone || '+905555555555',
        email: session?.user?.email || deliveryAddress!.email || 'guest@example.com',
        identityNumber: '11111111111',
        registrationAddress: deliveryAddress!.fullAddress,
        ip: '85.34.78.112',
        city: deliveryAddress!.city,
        country: 'Turkey',
      }

      // Address
      const shippingAddress = {
        contactName: deliveryAddress!.fullName,
        city: deliveryAddress!.city,
        country: 'Turkey',
        address: deliveryAddress!.fullAddress,
      }

      // İyzico payment request
      const paymentRequest = {
        locale: 'tr',
        conversationId: String(orderId),
        price: String(getTotalWithDiscount().toFixed(2)),
        paidPrice: String(getTotalWithDiscount().toFixed(2)),
        currency: 'TRY',
        basketId: String(orderId),
        paymentGroup: 'PRODUCT',
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/iyzico/callback`,
        enabledInstallments: [1],
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress,
        basketItems: basketItems,
      }

      console.log('Payment request:', paymentRequest)

      const response = await axios.post('/api/iyzico/init', paymentRequest)

      console.log('Payment response:', response.data)

      if (response.data.status === 'success') {
        // Ödeme formunu yeni sekmede aç
        const paymentWindow = window.open('', '_blank')
        if (paymentWindow) {
          paymentWindow.document.write(response.data.checkoutFormContent)
          paymentWindow.document.close()
        } else {
          toast.error('Pop-up engelleyicinizi kapatın', 4000)
        }
      } else {
        toast.error(response.data.errorMessage || 'Ödeme başlatılamadı', 4000)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', 4000)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  const deliveryAddress = status === 'authenticated' 
    ? addresses?.find(a => a.id === selectedAddressId)
    : guestAddress

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Mobile Header Banner */}
      <div className="md:hidden relative bg-gradient-to-br from-[#bb7c05] to-[#d49624] px-6 py-6 mb-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Teslimat
          </h1>
          <p className="text-white/90 text-sm">Adres seçin ve siparişi tamamlayın</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50] mb-1">Teslimat Bilgileri</h1>
              <p className="text-gray-600">Adres seçin ve siparişinizi tamamlayın</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-64 md:pb-6">
          {/* Left Side - Address Selection & Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info Card - Dynamic */}
            {(() => {
              const deliveryStatus = storeSettings?.deliveryStatus || 'normal'
              const statusConfig = {
                normal: {
                  time: '~20 dakika',
                  label: 'Normal Teslimat',
                  color: 'green',
                  bgGradient: 'from-green-50 to-white',
                  borderColor: 'border-green-200',
                  iconBg: 'bg-green-100',
                  iconColor: 'text-green-600',
                  textColor: 'text-green-900',
                  descColor: 'text-green-700',
                  emoji: '⚡'
                },
                busy: {
                  time: '~40 dakika',
                  label: 'Yoğun Teslimat',
                  color: 'yellow',
                  bgGradient: 'from-yellow-50 to-white',
                  borderColor: 'border-yellow-300',
                  iconBg: 'bg-yellow-100',
                  iconColor: 'text-yellow-600',
                  textColor: 'text-yellow-900',
                  descColor: 'text-yellow-700',
                  emoji: '⏱️'
                },
                very_busy: {
                  time: '~1 saat',
                  label: 'Çok Yoğun',
                  color: 'red',
                  bgGradient: 'from-red-50 to-white',
                  borderColor: 'border-red-200',
                  iconBg: 'bg-red-100',
                  iconColor: 'text-red-600',
                  textColor: 'text-red-900',
                  descColor: 'text-red-700',
                  emoji: '🚨'
                }
              }
              const config = statusConfig[deliveryStatus as keyof typeof statusConfig]

              return (
                <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl shadow-lg p-5 border-2 ${config.borderColor} animate-fadeIn`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Clock className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${config.textColor} mb-1 flex items-center gap-2`}>
                        Tahmini Teslimat {config.emoji}
                      </h3>
                      <p className={`text-sm ${config.descColor} font-medium`}>
                        {config.time} içinde kapınızda!
                      </p>
                      <div className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-bold ${config.iconBg} ${config.iconColor}`}>
                        {config.label}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {status === 'authenticated' ? (
              /* Logged In User - Address List */
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-[#2c3e50]">Teslimat Adresi</h2>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-[#bb7c05] hover:text-[#d49624] font-medium text-sm flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Yeni Adres
                  </button>
                </div>

                {addresses && addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((address, index) => (
                      <button
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`w-full text-left p-5 rounded-2xl shadow-lg transition-all duration-300 border-2 animate-fadeIn ${
                          selectedAddressId === address.id
                            ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05] scale-[1.02]'
                            : 'bg-white border-gray-200 hover:border-[#bb7c05]/30 hover:shadow-xl'
                        }`}
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              selectedAddressId === address.id
                                ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624]'
                                : 'bg-gray-100'
                            }`}>
                              <MapPin className={`w-5 h-5 ${
                                selectedAddressId === address.id ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <h3 className="font-bold text-[#2c3e50]">{address.title}</h3>
                          </div>
                          {selectedAddressId === address.id && (
                            <div className="w-6 h-6 bg-[#bb7c05] rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white fill-white" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{address.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{address.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium">{address.city} / {address.district}</div>
                              <div className="text-gray-600 leading-relaxed mt-0.5">{address.fullAddress}</div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* No Address */
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-[#bb7c05]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#2c3e50] mb-2">Kayıtlı Adres Yok</h3>
                    <p className="text-gray-600 mb-4">Devam etmek için bir adres ekleyin</p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      Adres Ekle
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Guest User - Inline Address Form */
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#2c3e50]">İletişim ve Teslimat Bilgileri</h2>
                </div>

                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:border-[#bb7c05]/30 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 rounded-xl flex items-center justify-center group-hover:from-[#bb7c05]/20 group-hover:to-[#d49624]/20 transition-all">
                      {guestAddress ? (
                        <CheckCircle className="w-7 h-7 text-[#bb7c05]" />
                      ) : (
                        <MapPin className="w-7 h-7 text-[#bb7c05]" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      {guestAddress ? (
                        <>
                          <div className="font-bold text-[#2c3e50] mb-1 flex items-center gap-2">
                            {guestAddress.fullName}
                            {guestAddress.email && (
                              <span className="text-xs font-normal text-gray-500">({guestAddress.email})</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {guestAddress.phone} • {guestAddress.city} / {guestAddress.district}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {guestAddress.fullAddress}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-[#2c3e50] mb-1">Adres Bilgilerini Girin</div>
                          <div className="text-sm text-gray-600">İletişim ve teslimat bilgilerinizi ekleyin</div>
                        </>
                      )}
                    </div>
                    <Edit2 className="w-5 h-5 text-[#bb7c05] group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              </>
            )}

            {/* Payment Method Selection */}
            <div 
              ref={paymentMethodRef}
              className={`transition-all duration-500 ${
                showPaymentError ? 'ring-4 ring-red-400 ring-opacity-50 rounded-2xl p-4 -m-4' : ''
              }`}
            >
              <h2 className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                showPaymentError ? 'text-red-600' : 'text-[#2c3e50]'
              }`}>
                Ödeme Yöntemi {showPaymentError && <span className="text-red-500 animate-pulse">*</span>}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kapıda Nakit */}
              <button
                onClick={() => {
                  setPaymentMethod('cash')
                  setShowPaymentError(false)
                }}
                className={`p-5 rounded-2xl shadow-lg transition-all duration-300 border-2 ${
                  paymentMethod === 'cash'
                    ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05] scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-[#bb7c05]/30 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${
                    paymentMethod === 'cash'
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624]'
                      : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className={`font-bold mb-1 ${paymentMethod === 'cash' ? 'text-[#bb7c05]' : 'text-[#2c3e50]'}`}>
                    Kapıda Nakit
                  </h3>
                  <p className="text-xs text-gray-600">Teslimat sırasında nakit ödeyin</p>
                </div>
              </button>

              {/* Kapıda Kredi Kartı */}
              <button
                onClick={() => {
                  setPaymentMethod('card-on-delivery')
                  setShowPaymentError(false)
                }}
                className={`p-5 rounded-2xl shadow-lg transition-all duration-300 border-2 ${
                  paymentMethod === 'card-on-delivery'
                    ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05] scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-[#bb7c05]/30 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${
                    paymentMethod === 'card-on-delivery'
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624]'
                      : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${paymentMethod === 'card-on-delivery' ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className={`font-bold mb-1 ${paymentMethod === 'card-on-delivery' ? 'text-[#bb7c05]' : 'text-[#2c3e50]'}`}>
                    Kapıda Kredi Kartı
                  </h3>
                  <p className="text-xs text-gray-600">Teslimat sırasında kartla ödeyin</p>
                </div>
              </button>

              {/* Online Kredi Kartı */}
              <button
                onClick={() => {
                  setPaymentMethod('online')
                  setShowPaymentError(false)
                }}
                className={`p-5 rounded-2xl shadow-lg transition-all duration-300 border-2 ${
                  paymentMethod === 'online'
                    ? 'bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 border-[#bb7c05] scale-[1.02]'
                    : 'bg-white border-gray-200 hover:border-[#bb7c05]/30 hover:shadow-xl'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-3 ${
                    paymentMethod === 'online'
                      ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624]'
                      : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-8 h-8 ${paymentMethod === 'online' ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className={`font-bold mb-1 ${paymentMethod === 'online' ? 'text-[#bb7c05]' : 'text-[#2c3e50]'}`}>
                    Online Kredi Kartı
                  </h3>
                  <p className="text-xs text-gray-600">Şimdi güvenli ödeme yapın</p>
                </div>
              </button>
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <h2 className="text-xl font-bold text-[#2c3e50] mb-6">Sipariş Özeti</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                    {/* Product Image */}
                    <div className="relative w-14 h-14 bg-gradient-to-br from-gray-50 to-white rounded-xl flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                      {/* Quantity Badge */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        <span className="text-xs font-bold text-white">{item.quantity}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{item.name}</div>
                      {item.extraText && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.selectedOption === 'first' 
                            ? item.extraText.split('/')[0] 
                            : item.extraText.split('/')[1] || item.extraText
                          }
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {item.price}₺ × {item.quantity}
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="font-bold text-[#bb7c05] text-sm">
                      {(item.price * item.quantity).toFixed(2)}₺
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Ara Toplam</span>
                  <span className="font-bold">{getTotal().toFixed(2)}₺</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      İndirim ({discount}%)
                    </span>
                    <span className="font-bold">-{((getTotal() * discount) / 100).toFixed(2)}₺</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Teslimat</span>
                  <span className="font-bold text-green-600">Ücretsiz</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg mb-6">
                <span className="font-bold text-[#2c3e50]">Toplam</span>
                <span className="font-bold text-[#bb7c05] text-2xl">{getTotalWithDiscount().toFixed(2)}₺</span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!deliveryAddress}
                className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <span>Ödemeye Devam Et</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {!deliveryAddress && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Lütfen önce bir teslimat adresi seçin
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Summary Drawer */}
      <>
        {/* Overlay when open */}
        {isSummaryOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[98]"
            onClick={() => setIsSummaryOpen(false)}
          />
        )}

        {/* Summary Drawer */}
        <div className={`lg:hidden fixed bottom-[72px] left-0 right-0 z-[99] bg-white rounded-t-3xl transition-all duration-300 ${
          isSummaryOpen ? 'max-h-[70vh]' : 'h-auto'
        }`} style={{boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15), 0 -4px 20px rgba(187, 124, 5, 0.1)'}}>
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Collapsed View */}
          <button
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="w-full px-5 py-3 flex items-center justify-between active:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Toplam Tutar</span>
                <span className="text-2xl font-bold text-[#bb7c05]">
                  {getTotalWithDiscount().toFixed(2)}₺
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] w-full"></div>
                </div>
                <span className="text-xs text-gray-500">{items.length} ürün</span>
              </div>
            </div>
            
            {/* Arrow Indicator */}
            <div className={`ml-4 transition-transform duration-300 ${isSummaryOpen ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-[#bb7c05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>

          {/* Expanded Content */}
          <div className={`transition-all duration-300 ${
            isSummaryOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0'
          }`}>
            <div className={`px-5 pb-4 space-y-4 overflow-y-auto ${
              isSummaryOpen ? 'max-h-[calc(70vh-200px)]' : 'max-h-0'
            }`}>
              {/* Order Items */}
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <h3 className="font-bold text-[#2c3e50] mb-3">Sipariş Özeti</h3>
                {items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {/* Product Image */}
                    <div className="relative w-12 h-12 bg-gradient-to-br from-gray-50 to-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'}
                        alt={item.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                      {/* Quantity Badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center border-2 border-white shadow">
                        <span className="text-[10px] font-bold text-white">{item.quantity}</span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{item.name}</div>
                      {item.extraText && (
                        <div className="text-xs text-gray-500">
                          {item.selectedOption === 'first' 
                            ? item.extraText.split('/')[0] 
                            : item.extraText.split('/')[1] || item.extraText
                          }
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="font-bold text-[#bb7c05] text-sm">
                      {(item.price * item.quantity).toFixed(2)}₺
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Ara Toplam</span>
                  <span className="font-bold">{getTotal().toFixed(2)}₺</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>İndirim ({discount}%)</span>
                    <span className="font-bold">-{((getTotal() * discount) / 100).toFixed(2)}₺</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Teslimat</span>
                  <span className="font-bold text-green-600">Ücretsiz</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button - Always Visible */}
          <div className="px-5 pt-4 pb-7 border-t border-gray-200 bg-white">
            <button
              onClick={handlePlaceOrder}
              disabled={!deliveryAddress}
              className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Ödemeye Devam Et</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {!deliveryAddress && (
              <p className="text-xs text-red-600 text-center mt-2">
                Lütfen önce bir teslimat adresi seçin
              </p>
            )}
          </div>
        </div>
      </>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={(address) => addAddressMutation.mutate(address)}
        isLoading={addAddressMutation.isPending}
        isGuest={status === 'unauthenticated'}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
