'use client'

import { X, ShoppingCart, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/contexts/ToastContext'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    description: string
    price: number
    secondPrice?: number | null
    extraText?: string | null
    imageUrl?: string | null
  }
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [selectedPrice, setSelectedPrice] = useState<'first' | 'second'>('first')
  const [quantity, setQuantity] = useState(1)
  const [isClosing, setIsClosing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const toast = useToast()

  // Modal açıldığında body scroll'u kapat
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setIsAnimating(true)
    } else {
      document.body.style.overflow = 'unset'
      setIsAnimating(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Kapatma animasyonu
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300) // Animation süresi
  }

  if (!isOpen) return null

  const getCurrentPrice = () => {
    return selectedPrice === 'first' ? product.price : (product.secondPrice || product.price)
  }

  const getTotalPrice = () => {
    return getCurrentPrice() * quantity
  }

  const handleAddToCart = () => {
    // Her bir adet için ayrı ayrı ekle (quantity kadar)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: getCurrentPrice(),
        imageUrl: product.imageUrl || null,
        slug: `${product.id}`, // Slug olarak id kullan (gerekirse düzenlenebilir)
        selectedOption: selectedPrice,
        extraText: product.extraText || null,
      })
    }
    
    // Toast göster
    toast.success(`${quantity} adet ${product.name} sepete eklendi!`, 2500)
    
    // Modal'ı kapat
    handleClose()
    
    // Form'u resetle
    setQuantity(1)
    setSelectedPrice('first')
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          isAnimating && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={`fixed inset-0 z-[9999] md:flex md:items-center md:justify-center transition-all duration-300 ease-out ${
          isAnimating && !isClosing 
            ? 'translate-y-0 md:opacity-100 md:scale-100' 
            : 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95'
        }`}
        onClick={handleClose}
      >
        <div 
          className="bg-white h-full md:h-auto md:rounded-3xl shadow-2xl w-full md:max-w-lg md:mx-4 overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Header with Close Button */}
          <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2c3e50]">Ürün Detayı</h2>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {/* Product Image - Compact */}
            <div className="relative w-full h-48 mb-4 bg-gradient-to-br from-[#bb7c05]/5 to-[#d49624]/5 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain drop-shadow-xl"
                />
              </div>
              
              {/* Desktop Close Button */}
              <button
                onClick={handleClose}
                className="hidden md:flex absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-md items-center justify-center transition-all hover:scale-110 z-10"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Product Info - Minimal */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#2c3e50] mb-2">
                {product.name}
              </h2>
              
              {/* Description Badge */}
              <div className="inline-block px-4 py-2 rounded-xl text-sm bg-gradient-to-r from-[#bb7c05]/10 to-[#d49624]/10 text-gray-700 border border-[#bb7c05]/20">
                {product.description}
              </div>
            </div>

            {/* Price Options - Compact */}
            {product.secondPrice && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  Boyut Seçin
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* First Price */}
                  <button
                    onClick={() => setSelectedPrice('first')}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedPrice === 'first'
                        ? 'border-[#bb7c05] bg-[#bb7c05]/5 shadow-md scale-[1.02]'
                        : 'border-gray-200 hover:border-[#bb7c05]/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-base font-bold text-[#bb7c05]">{product.price}₺</div>
                      {product.extraText && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {product.extraText.split('/')[0]}
                        </div>
                      )}
                    </div>
                    {selectedPrice === 'first' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#bb7c05] rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Second Price */}
                  <button
                    onClick={() => setSelectedPrice('second')}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedPrice === 'second'
                        ? 'border-[#bb7c05] bg-[#bb7c05]/5 shadow-md scale-[1.02]'
                        : 'border-gray-200 hover:border-[#bb7c05]/30'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-base font-bold text-[#bb7c05]">{product.secondPrice}₺</div>
                      {product.extraText && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {product.extraText.split('/')[1]}
                        </div>
                      )}
                    </div>
                    {selectedPrice === 'second' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#bb7c05] rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selector - Compact */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2">
                Adet
              </label>
              <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#bb7c05] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <div className="text-xl font-bold text-[#2c3e50] min-w-[50px] text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:border-[#bb7c05] transition-all flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="md:relative md:mt-0 sticky bottom-0 left-0 right-0 bg-white pt-4 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 border-t md:border-t-0 border-gray-100">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-4 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>Sepete Ekle</span>
                <span className="ml-auto bg-white/20 px-3 py-1 rounded-lg">
                  {getTotalPrice()}₺
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

