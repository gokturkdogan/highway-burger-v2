'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, ArrowLeft, Package } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'
import ConfirmModal from '@/components/ConfirmModal'

export default function CartPage() {
  const router = useRouter()
  const toast = useToast()
  const [mounted, setMounted] = useState(false)
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const updateQuantity = useCart((state) => state.updateQuantity)
  const clearCart = useCart((state) => state.clearCart)
  const getTotal = useCart((state) => state.getTotal)
  const getTotalWithDiscount = useCart((state) => state.getTotalWithDiscount)
  const applyCoupon = useCart((state) => state.applyCoupon)
  const removeCoupon = useCart((state) => state.removeCoupon)
  const currentCoupon = useCart((state) => state.couponCode)
  const discount = useCart((state) => state.discount)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning('Lütfen bir kupon kodu girin', 3000)
      return
    }

    setIsApplyingCoupon(true)

    try {
      // TODO: API'den kupon kontrolü
      // Şimdilik mock data
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      // Örnek: INDIRIM10 = %10 indirim
      if (couponCode.toUpperCase() === 'INDIRIM10') {
        applyCoupon(couponCode, 10)
        toast.success('Kupon başarıyla uygulandı! %10 indirim', 3000)
        setCouponCode('')
      } else {
        toast.error('Geçersiz kupon kodu!', 3000)
      }
    } catch (error) {
      toast.error('Kupon kontrol edilemedi', 3000)
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    toast.info('Kupon kaldırıldı', 2000)
  }

  const handleConfirmDelete = () => {
    if (deleteItemId !== null) {
      removeItem(deleteItemId)
      toast.success('Ürün sepetten kaldırıldı', 2000)
      setDeleteItemId(null)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Mobile Header Banner */}
      <div className="md:hidden relative bg-gradient-to-br from-[#bb7c05] to-[#d49624] px-6 py-6 mb-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Sepetim
          </h1>
          <p className="text-white/90 text-sm">{items.length} ürün • {getTotal().toFixed(2)}₺</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2c3e50] mb-1">Sepetim</h1>
                <p className="text-gray-600">{items.length} ürün • {getTotal().toFixed(2)}₺</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-3">
                Sepetiniz Boş
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Lezzetli ürünlerimize göz atın ve sepetinize ekleyin
              </p>
              
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft className="w-5 h-5" />
                Alışverişe Başla
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content */
          <>
            {/* Cart Items */}
            <div className="space-y-4 pb-64 md:pb-6 md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-6">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedOption}-${index}`}
                  className="bg-white rounded-2xl shadow-lg p-4 md:p-5 flex gap-4 relative overflow-hidden group hover:shadow-xl transition-all duration-300 animate-fadeIn border-2 border-transparent hover:border-[#bb7c05]/20"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden">
                    <Image
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-[#2c3e50] text-base md:text-lg mb-1">
                        {item.name}
                      </h3>
                      {item.extraText && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-[#bb7c05]/10 text-[#bb7c05] rounded-lg font-medium border border-[#bb7c05]/20">
                            {item.selectedOption === 'first' 
                              ? item.extraText.split('/')[0] 
                              : item.extraText.split('/')[1] || item.extraText
                            }
                          </span>
                        </div>
                      )}
                      <div className="text-lg font-bold text-[#bb7c05]">
                        {item.price}₺
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#bb7c05] transition-all duration-200 flex items-center justify-center shadow-sm"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="text-base font-bold text-[#2c3e50] min-w-[32px] text-center">
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#bb7c05] transition-all duration-200 flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Toplam</div>
                        <div className="text-lg font-bold text-[#bb7c05]">
                          {(item.price * item.quantity).toFixed(2)}₺
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteItemId(item.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

              {/* Summary - Desktop Only */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <h2 className="text-xl font-bold text-[#2c3e50] mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#bb7c05]" />
                  Sipariş Özeti
                </h2>

                {/* Subtotal */}
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
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg mb-6 pb-6 border-b border-gray-200">
                  <span className="font-bold text-[#2c3e50]">Toplam</span>
                  <span className="font-bold text-[#bb7c05] text-2xl">{getTotalWithDiscount().toFixed(2)}₺</span>
                </div>

                {/* Coupon */}
                {!currentCoupon ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kupon Kodu
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="KUPON KODU"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="px-4 py-3 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 text-[#bb7c05] rounded-xl font-bold hover:from-[#bb7c05]/20 hover:to-[#d49624]/20 transition-all duration-200 disabled:opacity-50"
                      >
                        {isApplyingCoupon ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Uygula'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-xs text-green-600 font-medium">Kupon Uygulandı</div>
                          <div className="text-sm font-bold text-green-700">{currentCoupon}</div>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="block w-full text-center py-3 text-[#bb7c05] font-bold hover:text-[#d49624] transition-colors duration-200"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
            </div>

            {/* Mobile Bottom Summary Drawer */}
            <>
              {/* Overlay when open */}
              {isSummaryOpen && (
                <div 
                  className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] bottom-[72px]"
                  onClick={() => setIsSummaryOpen(false)}
                />
              )}

              {/* Summary Drawer */}
              <div className={`lg:hidden fixed bottom-[72px] left-0 right-0 z-[100] bg-white rounded-t-3xl transition-all duration-300 ${
                isSummaryOpen ? 'max-h-[70vh]' : 'h-auto'
              }`} style={{boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15), 0 -4px 20px rgba(187, 124, 5, 0.1)'}}>
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                </div>

                {/* Collapsed Summary Header - Always Visible */}
                <button
                  onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                  className="w-full px-5 py-3 flex items-center justify-between active:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Toplam</span>
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
                    isSummaryOpen ? 'max-h-[calc(85vh-240px)]' : 'max-h-0'
                  }`}>
                    {/* Subtotal */}
                    <div className="space-y-3 pb-4 border-b border-gray-200">
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
                    </div>

                    {/* Coupon */}
                    {!currentCoupon ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kupon Kodu
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="KUPON KODU"
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 uppercase"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="px-4 py-3 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 text-[#bb7c05] rounded-xl font-bold hover:from-[#bb7c05]/20 hover:to-[#d49624]/20 transition-all duration-200 disabled:opacity-50"
                          >
                            {isApplyingCoupon ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              'Uygula'
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-green-600" />
                            <div>
                              <div className="text-xs text-green-600 font-medium">Kupon Uygulandı</div>
                              <div className="text-sm font-bold text-green-700">{currentCoupon}</div>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkout Button - Always Visible */}
                <div className="px-5 pt-4 pb-7 border-t border-gray-200 bg-white">
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Siparişi Tamamla</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={handleConfirmDelete}
        title="Ürünü Kaldır"
        message="Bu ürünü sepetten kaldırmak istediğinizden emin misiniz?"
        confirmText="Kaldır"
        cancelText="İptal"
        type="danger"
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
