'use client'

import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import ProductModal from '@/components/ProductModal'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/products?category=${slug}`)
      return res.data
    },
  })

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 300) // Animation bittikten sonra temizle
  }

  // Kategori türlerini belirle
  const isDrinks = slug === 'drinks'
  const isSandwiches = slug === 'sandwiches'
  const isToasts = slug === 'toast'

  // Fallback ürünler (database'de veri yoksa)
  const fallbackProducts = [
    {
      id: 1,
      name: "Klasik Burger",
      description: "Taze et, marul, domates ve özel sos ile",
      price: 45,
      secondPrice: null,
      extra: "Popüler",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
    },
    {
      id: 2,
      name: "Cheese Burger",
      description: "Çift peynirli nefis burger",
      price: 55,
      secondPrice: null,
      extra: null,
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400"
    }
  ]

  const displayProducts = products || fallbackProducts

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Product List */}
      <div className="nav">
        {isLoading ? (
          // Loading state
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="nav__item animate-pulse" style={{
              position: 'relative',
              background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22), 0 6px 15px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(187, 124, 5, 0.18), 0 1px 4px rgba(0, 0, 0, 0.1)',
              minHeight: '135px',
              padding: '18px 16px',
              borderRadius: '22px',
              marginTop: '22px',
              border: '2px solid rgba(187, 124, 5, 0.2)',
              transform: 'translateX(4px) scale(1.01)'
            }}>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded-full"></div>
            </div>
          ))
        ) : displayProducts && displayProducts.length > 0 ? (
          // Product items
          displayProducts.map((product: any) => (
            <div
              key={product.id}
              className={`nav__item ${isSandwiches ? '-sandwich' : ''} ${isDrinks ? '-drink' : ''} ${isToasts ? '-toast' : ''}`}
              onClick={() => handleProductClick(product)}
            >
              {/* Background Effects */}
              <div className="nav__bgGradient" style={{
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '50%',
                background: 'radial-gradient(ellipse at left, rgba(187, 124, 5, 0.08) 0%, rgba(212, 150, 36, 0.05) 40%, transparent 80%)',
                opacity: 1,
                transition: 'all 0.45s ease',
                borderRadius: '22px 0 0 22px'
              }}></div>
              
              <div className="nav__leftBorder" style={{
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, transparent 0%, #bb7c05 30%, #d49624 50%, #bb7c05 70%, transparent 100%)',
                opacity: 1,
                transition: 'opacity 0.45s ease',
                borderRadius: '22px 0 0 22px'
              }}></div>

              {/* Product Image */}
              <div className="nav__image" style={{
                width: '115px',
                height: '115px',
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translate(-50%, -50%) rotate(-3deg)',
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1
              }}>
                <Image
                  src={product.imageUrl || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                  alt={product.name}
                  width={115}
                  height={115}
                  className="object-contain"
                  style={{ width: '115px', height: '115px' }}
                />
              </div>

              {/* Product Content */}
              <div className="nav__itemContent" style={{
                marginTop: 0,
                marginLeft: '65px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
                zIndex: 2
              }}>
                <div className="nav__title" style={{
                  fontWeight: 700,
                  letterSpacing: '0.8px',
                  color: '#bb7c05',
                  fontSize: '13px',
                  transition: 'all 0.35s ease',
                  lineHeight: 1.3
                }}>
                  {product.name}
                </div>
                
                <div className="nav__subtitle" style={{
                  color: '#7a7a7a',
                  fontSize: '10px',
                  lineHeight: 1.5,
                  maxWidth: '80%',
                  fontWeight: 500,
                  transition: 'all 0.4s ease'
                }}>
                  {product.description}
                </div>
                
                <div className="nav__priceBox" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}>
                  <div className="nav__price" style={{
                    color: '#bb7c05',
                    fontWeight: 800,
                    fontSize: '14px',
                    letterSpacing: '0.3px',
                    transition: 'all 0.35s ease',
                    transform: 'translateY(-2px)'
                  }}>
                    {product.price}₺
                    {product.secondPrice && (
                      <span style={{fontWeight: 800}}>
                        /{product.secondPrice}₺
                      </span>
                    )}
                  </div>
                  
                  {product.extraText && (
                    <span className="nav__suffix" style={{
                      color: '#8a7a5a',
                      fontSize: '9px',
                      fontWeight: 600,
                      padding: '2px 6px',
                      background: 'rgba(187, 124, 5, 0.08)',
                      borderRadius: '8px',
                      letterSpacing: '0.2px',
                      border: '1px solid rgba(187, 124, 5, 0.15)',
                      textTransform: 'lowercase',
                      transition: 'all 0.3s ease'
                    }}>
                      {product.extraText}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="nav__action" style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2
              }}>
                <div className="nav__actionIcon" style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #bb7c05 0%, #d49624 100%)',
                  borderRadius: '50%',
                  padding: '10px',
                  boxShadow: '0 4px 15px rgba(187, 124, 5, 0.55), 0 2px 8px rgba(187, 124, 5, 0.4)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))
        ) : (
          // No Products Found - Modern Empty State
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeIn">
            <div className="relative">
              {/* Animated Background Circles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#bb7c05]/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -right-6 w-12 h-12 bg-[#d49624]/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              
              {/* Main Icon Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#bb7c05]/20" style={{boxShadow: '0 20px 60px rgba(187, 124, 5, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)'}}>
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-[#2c3e50] text-center mb-3">
                  Ürün Bulunamadı
                </h2>
                
                {/* Description */}
                <p className="text-gray-600 text-center mb-6 max-w-sm leading-relaxed">
                  Bu kategoride henüz ürün bulunmuyor. Yakında lezzetli seçeneklerle karşınızda olacağız!
                </p>
                
                {/* Action Button */}
                <div className="flex justify-center">
                  <Link href="/" className="px-8 py-3 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 inline-block">
                    Diğer Kategoriler
                  </Link>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-[#bb7c05] rounded-full animate-ping"></div>
              <div className="absolute bottom-8 right-4 w-2 h-2 bg-[#d49624] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}

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

        .nav {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 0 20px 0 60px;
          animation: fadeIn 0.6s ease-out;
        }
        
        .nav__item {
          position: relative;
          background: linear-gradient(145deg, #ffffff 0%, #fefefe 100%);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22), 0 6px 15px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(187, 124, 5, 0.18), 0 1px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          min-height: 135px;
          padding: 18px 16px;
          border-radius: 22px;
          margin-top: 22px;
          cursor: pointer;
          transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(187, 124, 5, 0.2);
          overflow: visible;
          transform: translateX(4px) scale(1.01);
        }
        
        .nav__item.-sandwich {
          min-height: 110px;
          padding: 14px 16px;
        }
        
        .nav__item.-drink {
          min-height: 85px;
          padding: 12px 16px;
        }
        
        .nav__item.-toast {
          min-height: 95px;
          padding: 13px 16px;
        }

        @media (max-width: 768px) {
          .nav {
            padding: 0 18px 0 65px;
            gap: 12px;
          }
          
          .nav__item {
            width: 100%;
            min-height: 125px;
            padding: 16px 14px;
            margin-top: 20px;
            border-radius: 20px;
          }
          
          .nav__item.-sandwich {
            min-height: 105px;
          }
          
          .nav__item.-drink {
            min-height: 80px;
          }
          
          .nav__item.-toast {
            min-height: 90px;
          }
          
          .nav__image {
            width: 115px;
            height: 115px;
          }
          
          .nav__itemContent {
            margin-left: 58px;
          }
          
          .nav__title {
            font-size: 12px;
          }
          
          .nav__subtitle {
            font-size: 9px;
          }
          
          .nav__price {
            font-size: 13px;
          }
          
          .nav__actionIcon {
            width: 36px;
            height: 36px;
            padding: 8px;
          }
        }

        @media (min-width: 769px) {
          .nav {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: 100px;
            row-gap: 24px;
            padding: 24px;
            max-width: 80rem;
            margin: 0 auto;
          }
          
          .nav__item {
            min-height: 110px;
            padding: 12px 12px 12px 55px;
            margin-top: 0;
            border-radius: 18px;
            transform: translateX(0) scale(1);
          }
          
          .nav__item:nth-child(2n) {
            margin-left: 0;
          }
          
          .nav__item:hover {
            transform: translateY(-6px) translateX(2px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.18), 0 5px 12px rgba(187, 124, 5, 0.3);
            border-color: rgba(187, 124, 5, 0.5);
            background: linear-gradient(145deg, #ffffff 0%, #fffef8 100%);
          }
          
          .nav__item:hover .nav__image {
            transform: translate(-48%, -52%) rotate(2deg) scale(1.05);
            filter: drop-shadow(0 4px 8px rgba(187, 124, 5, 0.25));
          }
          
          .nav__item:hover .nav__title {
            color: #d49624;
            transform: translateX(4px);
            letter-spacing: 0.8px;
          }
          
          .nav__item:hover .nav__subtitle {
            color: #5a5a5a;
            transform: translateX(3px);
          }
          
          .nav__item:hover .nav__price {
            transform: translateY(-2px) scale(1.06);
            color: #d49624;
            text-shadow: 0 2px 6px rgba(187, 124, 5, 0.25);
          }
          
          .nav__item:hover .nav__actionIcon {
            transform: scale(1.12) rotate(8deg);
            box-shadow: 0 6px 18px rgba(187, 124, 5, 0.55), 0 3px 9px rgba(187, 124, 5, 0.4);
          }
          
          .nav__item:hover .nav__bgGradient {
            width: 60%;
            background: radial-gradient(ellipse at left, rgba(187, 124, 5, 0.12) 0%, rgba(212, 150, 36, 0.08) 40%, transparent 80%);
          }
          
          .nav__item:hover .nav__leftBorder {
            width: 5px;
            opacity: 1;
          }
          
          .nav__item:hover .nav__suffix {
            transform: scale(1.02);
            background: rgba(187, 124, 5, 0.12);
            border-color: rgba(187, 124, 5, 0.2);
          }
          
          .nav__item.-sandwich {
            min-height: 95px;
            padding: 10px 12px 10px 52px;
          }
          
          .nav__item.-drink {
            min-height: 80px;
            padding: 10px 12px 10px 48px;
          }
          
          .nav__item.-toast {
            min-height: 88px;
            padding: 10px 12px 10px 50px;
          }
          
          .nav__image {
            width: 115px;
            height: 115px;
            left: 0;
          }
          
          .nav__itemContent {
            margin-left: 0;
          }
          
          .nav__title {
            font-size: 13px;
          }
          
          .nav__subtitle {
            font-size: 10px;
            max-width: 90%;
          }
          
          .nav__price {
            font-size: 14px;
          }
          
          .nav__suffix {
            font-size: 8px;
            padding: 2px 5px;
          }
          
          .nav__actionIcon {
            width: 34px;
            height: 34px;
            padding: 8px;
          }
        }

        @media (min-width: 1400px) {
          .nav {
            max-width: 80rem;
            column-gap: 100px;
            row-gap: 30px;
          }
        }
      `}</style>
    </div>
  )
}

