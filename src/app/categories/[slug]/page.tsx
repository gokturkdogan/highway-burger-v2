'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/products?category=${slug}`)
      return res.data
    },
  })

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
      <div className="nav" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        padding: '0 20px 0 50px',
        animation: 'fadeIn 0.6s ease-out'
      }}>
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
        ) : (
          // Product items
          displayProducts.map((product: any) => (
            <div
              key={product.id}
              className={`nav__item ${isSandwiches ? '-sandwich' : ''} ${isDrinks ? '-drink' : ''} ${isToasts ? '-toast' : ''}`}
              style={{
                position: 'relative',
                background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.22), 0 6px 15px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(187, 124, 5, 0.18), 0 1px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                minHeight: isSandwiches ? '110px' : isDrinks ? '85px' : isToasts ? '95px' : '135px',
                padding: isSandwiches ? '14px 16px' : isDrinks ? '12px 16px' : isToasts ? '13px 16px' : '18px 16px',
                borderRadius: '22px',
                marginTop: '22px',
                cursor: 'pointer',
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '2px solid rgba(187, 124, 5, 0.2)',
                overflow: 'visible',
                transform: 'translateX(4px) scale(1.01)'
              }}
            >
              {/* Background Effects */}
              <div style={{
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
              
              <div style={{
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
              <div style={{
                width: '115px',
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translate(-50%, -50%) scale(1.15) rotate(-3deg)',
                transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1
              }}>
                <Image
                  src={product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                  alt={product.name}
                  width={115}
                  height={115}
                  className="object-contain"
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
                  fontSize: '15px',
                  transition: 'all 0.35s ease',
                  lineHeight: 1.3
                }}>
                  {product.name}
                </div>
                
                <div className="nav__subtitle" style={{
                  color: '#7a7a7a',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  maxWidth: '85%',
                  fontWeight: 500,
                  transition: 'color 0.3s ease'
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
                    fontSize: '16px',
                    letterSpacing: '0.3px',
                    transition: 'all 0.35s ease',
                    transform: 'translateY(-2px)'
                  }}>
                    {product.price}
                    {product.secondPrice && <span style={{fontWeight: 700}}>/{product.secondPrice}</span>}₺
                  </div>
                  
                  {product.extra && (
                    <span className="nav__suffix" style={{
                      color: '#8a8a8a',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      background: 'rgba(187, 124, 5, 0.08)',
                      borderRadius: '8px',
                      letterSpacing: '0.3px'
                    }}>
                      {product.extra}
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
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, #bb7c05 0%, #d49624 100%)',
                  borderRadius: '50%',
                  padding: '9px',
                  boxShadow: '0 4px 15px rgba(187, 124, 5, 0.55), 0 2px 8px rgba(187, 124, 5, 0.4)',
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))
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

        @media (max-width: 768px) {
          .nav {
            padding: 0 18px 0 45px;
            gap: 12px;
          }
          
          .nav__item {
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
            width: 105px;
          }
          
          .nav__itemContent {
            margin-left: 58px;
          }
          
          .nav__title {
            font-size: 14px;
          }
          
          .nav__subtitle {
            font-size: 11px;
          }
          
          .nav__price {
            font-size: 15px;
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
            gap: 16px;
            padding: 0 0 30px 0;
          }
          
          .nav__item {
            min-height: 110px;
            padding: 12px 12px 12px 55px;
            margin-top: 20px;
            border-radius: 18px;
            transform: translateX(0) scale(1);
          }
          
          .nav__item:nth-child(2n) {
            margin-left: 40px;
          }
          
          .nav__item:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22), 0 8px 20px rgba(0, 0, 0, 0.16), 0 4px 10px rgba(187, 124, 5, 0.2);
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
            width: 95px;
            left: 0;
          }
          
          .nav__itemContent {
            margin-left: 0;
          }
          
          .nav__title {
            font-size: 14px;
          }
          
          .nav__subtitle {
            font-size: 11px;
            max-width: 90%;
          }
          
          .nav__price {
            font-size: 14px;
          }
          
          .nav__suffix {
            font-size: 10px;
            padding: 3px 6px;
          }
          
          .nav__actionIcon {
            width: 34px;
            height: 34px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  )
}

