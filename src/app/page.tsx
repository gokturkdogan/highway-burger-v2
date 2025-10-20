'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Utensils, Sandwich, Coffee, BookOpen, ChefHat } from 'lucide-react'
import BottomNavigation from '@/components/BottomNavigation'

export default function HomePage() {
  // Database'den kategorileri çek
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
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
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Main Content */}
      <div className="px-3 md:px-6 py-6">
        {/* Category Cards - Enhanced Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto pb-15 animate-fadeIn">
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
            categoryCards.map((category) => {
              // Icon mapping
              const getCategoryIcon = (slug: string) => {
                switch (slug) {
                  case 'burgers': return <Utensils className="w-6 h-6" />
                  case 'toast': return <Sandwich className="w-6 h-6" />
                  case 'sandwiches': return <ChefHat className="w-6 h-6" />
                  case 'drinks': return <Coffee className="w-6 h-6" />
                  case 'menus': return <BookOpen className="w-6 h-6" />
                  default: return <Utensils className="w-6 h-6" />
                }
              }

              return (
                <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                  <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[200px] md:min-h-[180px] lg:min-h-[160px] p-3 rounded-2xl mt-16 md:mt-14 lg:mt-12 border border-gray-200 group-hover:-translate-y-4 group-hover:scale-105 group-hover:border-[#bb7c05]/30 mb-2" style={{boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 4px 15px rgba(0, 0, 0, 0.1)'}}>
                    {/* Background Gradient Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/6 via-[#d49624]/3 to-transparent opacity-100 transition-all duration-500 rounded-t-2xl group-hover:from-[#bb7c05]/10 group-hover:via-[#d49624]/6"></div>
                    
                    {/* Border Gradient */}
                    <div className="absolute inset-[-1px] bg-gradient-to-r from-[#bb7c05]/20 via-[#d49624]/30 to-[#bb7c05]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
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

