'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import BottomNavigation from '@/components/BottomNavigation'

export default function HomePage() {
  // Kategori kartları - görüntüdeki gibi
  const categoryCards = [
    {
      id: 1,
      title: "Burgerler",
      description: "110 / 180gr",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300",
      link: "/categories/burgers"
    },
    {
      id: 2,
      title: "Tostlar", 
      description: "Patates & İçecek + 80₺",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300",
      link: "/categories/toast"
    },
    {
      id: 3,
      title: "Sıcak Sandviçler",
      description: "Sosisli & Patso", 
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300",
      link: "/categories/sandwiches"
    },
    {
      id: 4,
      title: "İçecekler",
      description: "Soğuk İçecekler",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300", 
      link: "/categories/drinks"
    },
    {
      id: 5,
      title: "Menüler",
      description: "Patates + Kutu İçecek",
      image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300",
      link: "/categories/menus"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Category Cards - Vue Style Grid */}
        <div className="grid grid-cols-2 gap-4 pb-15 animate-fadeIn">
          {/* Burgerler */}
          <Link href="/categories/burgers" className="group">
            <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[182px] p-4 rounded-3xl mt-16 border-2 border-black/6 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#bb7c05]/25 mb-4">
              {/* Background Gradient Overlay */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/4 via-[#d49624]/2 to-transparent opacity-100 transition-all duration-500 rounded-t-3xl group-hover:from-[#bb7c05]/8 group-hover:via-[#d49624]/5"></div>
              
              {/* Border Gradient */}
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/15 via-[#d49624]/25 to-[#bb7c05]/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              {/* Category Image */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-35 transition-all duration-500 group-hover:scale-118 group-hover:-rotate-5">
                <Image
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
                  alt="Burgerler"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="mt-14 relative z-10">
                  <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                    Burgerler
                  </h3>
                  <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                    110 / 180gr
                  </p>
                
                {/* Action Button */}
                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-gradient-to-r from-[#bb7c05]/12 to-[#d49624]/8 rounded-full text-[#bb7c05] transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#bb7c05] group-hover:via-[#d49624] group-hover:to-[#bb7c05] group-hover:text-white group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg border border-[#bb7c05]/15 relative overflow-hidden">
                  <span className="tracking-wide">Seçim için tıklayınız</span>
                  <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-120 group-hover:translate-x-1 group-hover:rotate-15 group-hover:shadow-lg border border-white/20 relative z-10">
                    <span className="text-white text-xs group-hover:text-[#bb7c05]">👆</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Tostlar */}
          <Link href="/categories/toast" className="group">
            <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[182px] p-4 rounded-3xl mt-16 border-2 border-black/6 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#bb7c05]/25 mb-4">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/4 via-[#d49624]/2 to-transparent opacity-100 transition-all duration-500 rounded-t-3xl group-hover:from-[#bb7c05]/8 group-hover:via-[#d49624]/5"></div>
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/15 via-[#d49624]/25 to-[#bb7c05]/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-35 transition-all duration-500 group-hover:scale-118 group-hover:-rotate-5">
                <Image
                  src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400"
                  alt="Tostlar"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              <div className="mt-14 relative z-10">
                  <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                    Tostlar
                  </h3>
                  <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                    Patates & İçecek + 80₺
                  </p>
                
                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-gradient-to-r from-[#bb7c05]/12 to-[#d49624]/8 rounded-full text-[#bb7c05] transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#bb7c05] group-hover:via-[#d49624] group-hover:to-[#bb7c05] group-hover:text-white group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg border border-[#bb7c05]/15 relative overflow-hidden">
                  <span className="tracking-wide">Seçim için tıklayınız</span>
                  <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-120 group-hover:translate-x-1 group-hover:rotate-15 group-hover:shadow-lg border border-white/20 relative z-10">
                    <span className="text-white text-xs group-hover:text-[#bb7c05]">👆</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Sıcak Sandviçler */}
          <Link href="/categories/sandwiches" className="group">
            <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[182px] p-4 rounded-3xl mt-16 border-2 border-black/6 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#bb7c05]/25 mb-4">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/4 via-[#d49624]/2 to-transparent opacity-100 transition-all duration-500 rounded-t-3xl group-hover:from-[#bb7c05]/8 group-hover:via-[#d49624]/5"></div>
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/15 via-[#d49624]/25 to-[#bb7c05]/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-35 transition-all duration-500 group-hover:scale-118 group-hover:-rotate-5">
                <Image
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400"
                  alt="Sıcak Sandviçler"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              <div className="mt-14 relative z-10">
                  <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                    Sıcak Sandviçler
                  </h3>
                  <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                    Sosisli & Patso
                  </p>
                
                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-gradient-to-r from-[#bb7c05]/12 to-[#d49624]/8 rounded-full text-[#bb7c05] transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#bb7c05] group-hover:via-[#d49624] group-hover:to-[#bb7c05] group-hover:text-white group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg border border-[#bb7c05]/15 relative overflow-hidden">
                  <span className="tracking-wide">Seçim için tıklayınız</span>
                  <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-120 group-hover:translate-x-1 group-hover:rotate-15 group-hover:shadow-lg border border-white/20 relative z-10">
                    <span className="text-white text-xs group-hover:text-[#bb7c05]">👆</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* İçecekler */}
          <Link href="/categories/drinks" className="group">
            <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[182px] p-4 rounded-3xl mt-16 border-2 border-black/6 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#bb7c05]/25 mb-4">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/4 via-[#d49624]/2 to-transparent opacity-100 transition-all duration-500 rounded-t-3xl group-hover:from-[#bb7c05]/8 group-hover:via-[#d49624]/5"></div>
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/15 via-[#d49624]/25 to-[#bb7c05]/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-35 transition-all duration-500 group-hover:scale-118 group-hover:-rotate-5">
                <Image
                  src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"
                  alt="İçecekler"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              <div className="mt-14 relative z-10">
                  <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                    İçecekler
                  </h3>
                  <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                    Soğuk İçecekler
                  </p>
                
                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-gradient-to-r from-[#bb7c05]/12 to-[#d49624]/8 rounded-full text-[#bb7c05] transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#bb7c05] group-hover:via-[#d49624] group-hover:to-[#bb7c05] group-hover:text-white group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg border border-[#bb7c05]/15 relative overflow-hidden">
                  <span className="tracking-wide">Seçim için tıklayınız</span>
                  <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-120 group-hover:translate-x-1 group-hover:rotate-15 group-hover:shadow-lg border border-white/20 relative z-10">
                    <span className="text-white text-xs group-hover:text-[#bb7c05]">👆</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Menüler */}
          <Link href="/categories/menus" className="group">
            <div className="relative bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer min-h-[182px] p-4 rounded-3xl mt-16 border-2 border-black/6 group-hover:-translate-y-3 group-hover:scale-105 group-hover:border-[#bb7c05]/25 mb-4">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-radial from-[#bb7c05]/4 via-[#d49624]/2 to-transparent opacity-100 transition-all duration-500 rounded-t-3xl group-hover:from-[#bb7c05]/8 group-hover:via-[#d49624]/5"></div>
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#bb7c05]/15 via-[#d49624]/25 to-[#bb7c05]/15 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-35 transition-all duration-500 group-hover:scale-118 group-hover:-rotate-5">
                <Image
                  src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400"
                  alt="Menüler"
                  width={140}
                  height={140}
                  className="object-contain"
                />
              </div>

              <div className="mt-14 relative z-10">
                  <h3 className="font-semibold text-[#2c3e50] text-base text-center mb-1.5 leading-tight transition-all duration-400 group-hover:text-[#bb7c05] group-hover:-translate-y-1 group-hover:tracking-wide">
                    Menüler
                  </h3>
                  <p className="text-[#7a7a7a] text-xs text-center mt-1 mb-4 leading-relaxed font-normal group-hover:text-[#5a5a5a] transition-colors duration-300">
                    Patates + Kutu İçecek
                  </p>
                
                <div className="flex justify-between items-center text-xs font-bold px-4 py-3 bg-gradient-to-r from-[#bb7c05]/12 to-[#d49624]/8 rounded-full text-[#bb7c05] transition-all duration-400 group-hover:bg-gradient-to-r group-hover:from-[#bb7c05] group-hover:via-[#d49624] group-hover:to-[#bb7c05] group-hover:text-white group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg border border-[#bb7c05]/15 relative overflow-hidden">
                  <span className="tracking-wide">Seçim için tıklayınız</span>
                  <div className="w-7.5 h-7.5 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full p-1.5 transition-all duration-400 group-hover:bg-white group-hover:scale-120 group-hover:translate-x-1 group-hover:rotate-15 group-hover:shadow-lg border border-white/20 relative z-10">
                    <span className="text-white text-xs group-hover:text-[#bb7c05]">👆</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

