'use client'

import { X, ShoppingCart, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

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

  // Modal açıldığında body scroll'u kapat ve açılış animasyonu başlat
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Küçük bir delay ile animasyonu tetikle
      setTimeout(() => setIsAnimating(true), 10)
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
    // TODO: Sepete ekleme fonksiyonu buraya gelecek
    console.log('Sepete eklendi:', {
      product,
      selectedPrice,
      quantity,
      totalPrice: getTotalPrice()
    })
    handleClose()
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
        className={`fixed inset-x-0 bottom-0 z-[9999] md:inset-0 md:flex md:items-center md:justify-center transition-all duration-300 ease-out ${
          isAnimating && !isClosing 
            ? 'translate-y-0 md:opacity-100 md:scale-100' 
            : 'translate-y-full md:translate-y-0 md:opacity-0 md:scale-95'
        }`}
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-lg md:mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle Bar (Mobile) */}
          <div className="md:hidden flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
            {/* Product Image */}
            <div className="relative w-full h-56 md:h-64 mb-6 bg-gradient-to-br from-[#bb7c05]/5 to-[#d49624]/5 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-contain drop-shadow-2xl animate-fadeIn"
                  style={{ animationDelay: '0.1s' }}
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-[#bb7c05]/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#d49624]/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Product Info */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2c3e50] mb-3 animate-fadeIn" style={{animationDelay: '0.2s'}}>
                {product.name}
              </h2>
              <p className="text-gray-600 leading-relaxed animate-fadeIn" style={{animationDelay: '0.3s'}}>
                {product.description}
              </p>
            </div>

            {/* Price Options */}
            {product.secondPrice && (
              <div className="mb-6 animate-fadeIn" style={{animationDelay: '0.4s'}}>
                <label className="block text-sm font-semibold text-[#2c3e50] mb-3">
                  Seçenek Seçin
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* First Price */}
                  <button
                    onClick={() => setSelectedPrice('first')}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedPrice === 'first'
                        ? 'border-[#bb7c05] bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-[#bb7c05]/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#bb7c05]">{product.price}₺</div>
                      {product.extraText && (
                        <div className="text-xs text-gray-600 mt-1">
                          {product.extraText.split('/')[0]}
                        </div>
                      )}
                    </div>
                    {selectedPrice === 'first' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#bb7c05] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Second Price */}
                  <button
                    onClick={() => setSelectedPrice('second')}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedPrice === 'second'
                        ? 'border-[#bb7c05] bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-[#bb7c05]/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#bb7c05]">{product.secondPrice}₺</div>
                      {product.extraText && (
                        <div className="text-xs text-gray-600 mt-1">
                          {product.extraText.split('/')[1]}
                        </div>
                      )}
                    </div>
                    {selectedPrice === 'second' && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#bb7c05] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6 animate-fadeIn" style={{animationDelay: '0.5s'}}>
              <label className="block text-sm font-semibold text-[#2c3e50] mb-3">
                Adet
              </label>
              <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-xl p-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-[#bb7c05] transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <div className="text-2xl font-bold text-[#2c3e50] min-w-[60px] text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 hover:border-[#bb7c05] transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-4 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-fadeIn"
              style={{animationDelay: '0.6s'}}
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

    </>
  )
}

