'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import BottomNavigation from '@/components/BottomNavigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Admin kullanıcıyı admin paneline yönlendir
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin')
    }
  }, [status, session, router])

  // Database'den kategorileri çek
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
    staleTime: 10 * 60 * 1000, // 10 dakika cache (kategoriler nadiren değişir)
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

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

  // Fallback kategoriler (database'de veri yoksa)
  const fallbackCategories = [
    {
      id: 1,
      name: "Burgerler",
      slug: "burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300"
    },
    {
      id: 2,
      name: "Tostlar", 
      slug: "toast",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300"
    },
    {
      id: 3,
      name: "Sıcak Sandviçler",
      slug: "sandwiches",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300"
    },
    {
      id: 4,
      name: "İçecekler",
      slug: "drinks",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300"
    },
    {
      id: 5,
      name: "Menüler",
      slug: "menus",
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300"
    }
  ]

  const categoryCards = categories || fallbackCategories

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Store Closed Banner */}
      {storeSettings?.isOpen === false && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 text-center shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <p className="font-bold text-lg">Mağaza Şu An Kapalı</p>
              <p className="text-sm text-white/90">Sipariş veremezsiniz. Lütfen daha sonra tekrar deneyin.</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Desktop Only */}
      <div className="hidden md:block relative overflow-hidden bg-gradient-to-br from-[#bb7c05] via-[#d49624] to-[#bb7c05] py-8 mb-6">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-64 h-64 bg-black/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-medium animate-fadeIn">
            🍔 Türkiye'nin En Lezzetli Burgerleri
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 animate-fadeIn leading-tight" style={{animationDelay: '0.1s'}}>
            En Lezzetli Burgerler Kapınızda!
          </h1>
          
          <p className="text-white/90 text-sm max-w-xl mx-auto animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Taze malzemeler, özel soslar ve hızlı teslimat • 15dk • ⭐ 4.8/5
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 md:px-6 py-6">
        {/* Section Title - Desktop */}
        <div className="hidden md:block mb-8">
          <div className="max-w-7xl mx-auto relative">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#bb7c05] to-[#d49624] rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-2xl font-bold text-[#2c3e50] flex items-center gap-2">
                  Kategoriler
                  <span className="inline-block w-2 h-2 bg-[#bb7c05] rounded-full animate-ping"></span>
                </h2>
                <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                  <span>Favorinizi seçin</span>
                  <span className="text-[#bb7c05]">✨</span>
                </p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-[#bb7c05]/5 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-2 left-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#bb7c05]/20 to-transparent"></div>
          </div>
        </div>

        {/* Category Cards - Enhanced Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto pb-15 animate-fadeIn">
          {isLoading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative bg-gradient-to-br from-white to-gray-50 shadow-xl min-h-[200px] md:min-h-[180px] lg:min-h-[160px] p-3 rounded-2xl mt-16 md:mt-14 lg:mt-12 border border-gray-200 mb-2 animate-pulse">
                <div className="mt-14">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            // Category cards
            categoryCards.map((category: any) => {
                  // Icon mapping
                  const getCategoryIcon = (slug: string) => {
                    switch (slug) {
                      case 'burgers': 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/>
                          </svg>
                        )
                      case 'kofte': 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="2" rx="1"/>
                            <rect x="3" y="15" width="18" height="2" rx="1"/>
                            <circle cx="7" cy="6" r="2"/>
                            <circle cx="12" cy="7" r="2"/>
                            <circle cx="17" cy="6" r="2"/>
                            <line x1="5" y1="20" x2="19" y2="20" strokeLinecap="round"/>
                          </svg>
                        )
                      case 'sandwiches': 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v1H4V8z" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 15c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-1H4v1z" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="3" y="9" width="18" height="5" rx="0.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )
                      case 'drinks': 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 22h10M12 18v4M17 2H7l1 12c0 2.2 1.8 4 4 4s4-1.8 4-4l1-12z" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 2v7" strokeLinecap="round"/>
                          </svg>
                        )
                      case 'menus': 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 448 512" fill="currentColor">
                            <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                          </svg>
                        )
                      default: 
                        return (
                          <svg className="w-6 h-6" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M61.1 224C45 224 32 211 32 194.9c0-1.9 .2-3.7 .6-5.6C37.9 168.3 78.8 32 256 32s218.1 136.3 223.4 157.3c.5 1.9 .6 3.7 .6 5.6c0 16.1-13 29.1-29.1 29.1H61.1zM144 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm240 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32zM272 96a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM16 304c0-26.5 21.5-48 48-48H448c26.5 0 48 21.5 48 48s-21.5 48-48 48H64c-26.5 0-48-21.5-48-48zm16 96c0-8.8 7.2-16 16-16H464c8.8 0 16 7.2 16 16v16c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V400z"/>
                          </svg>
                        )
                    }
                  }

              return (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                  <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-xl transition-all duration-500 cursor-pointer min-h-[200px] md:min-h-[180px] lg:min-h-[160px] p-3 rounded-2xl mt-16 md:mt-14 lg:mt-12 border border-gray-200 group-hover:-translate-y-4 md:group-hover:-translate-y-2 group-hover:scale-105 md:group-hover:scale-102 group-hover:border-[#bb7c05]/30 mb-2 group-hover:shadow-[0_20px_50px_rgba(187,124,5,0.25),0_10px_25px_rgba(0,0,0,0.15)]" style={{boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)'}}>
                    {/* Background Gradient Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/6 via-[#d49624]/3 to-transparent opacity-100 transition-all duration-500 rounded-t-2xl group-hover:from-[#bb7c05]/12 group-hover:via-[#d49624]/8 group-hover:h-full"></div>
                    
                    {/* Border Gradient - Animated */}
                    <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/20 via-[#d49624]/30 to-[#bb7c05]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 group-hover:animate-pulse"></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/0 group-hover:via-white/10 transition-all duration-700 rounded-2xl"></div>
                    
                    {/* Category Image */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[115px] md:w-[100px] lg:w-[90px] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                      <Image
                        src={category.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"}
                        alt={category.name}
                        width={115}
                        height={115}
                        className="object-contain"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-14 md:mt-12 lg:mt-10 relative z-10">
                        <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                          {category.name}
                        </h3>
                        <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                          {category._count?.products || 0} ürün
                        </p>
                      
                      {/* Action Button */}
                      <div 
                        className="flex justify-between items-center font-bold text-[#bb7c05] group-hover:text-white transition-all duration-400 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg relative overflow-hidden group-hover:bg-[#bb7c05]" 
                        style={{
                          fontSize: '10px',
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, rgba(187, 124, 5, 0.12) 0%, rgba(212, 150, 36, 0.08) 100%)',
                          borderRadius: '50px',
                          fontWeight: '700',
                          boxShadow: '0 3px 10px rgba(187, 124, 5, 0.2), 0 1px 4px rgba(0, 0, 0, 0.12), inset 0 1px 3px rgba(255, 255, 255, 0.8)',
                          letterSpacing: '0.4px',
                          border: '1px solid rgba(187, 124, 5, 0.15)',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        <span className="tracking-wide">Seçim için tıklayınız</span>
                        <div className="w-7 h-7 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-110 group-hover:translate-x-1 group-hover:rotate-12 group-hover:shadow-lg border border-white/20 relative z-10 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white group-hover:text-[#bb7c05]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

