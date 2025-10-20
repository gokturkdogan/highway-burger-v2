'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Home, Clock } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import dynamic from 'next/dynamic'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

export default function PaymentSuccessPage() {
  const clearCart = useCart((state) => state.clearCart)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    clearCart()
    
    // Window size'ı al
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [clearCart])

  return (
    <>
      {/* Confetti Effect */}
      {windowSize.width > 0 && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full text-center animate-fadeIn">
          {/* Success Icon with Animation */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            {/* Pulse Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-green-400 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-[#2c3e50] mb-4 animate-fadeIn">
            Siparişiniz Alındı! 🎉
          </h1>

          {/* Message */}
          <p className="text-lg text-gray-600 mb-8 leading-relaxed animate-fadeIn" style={{animationDelay: '0.1s'}}>
            Ödemeniz başarıyla tamamlandı. Siparişiniz hazırlanıyor ve en kısa sürede size ulaştırılacak.
          </p>

        {/* Info Cards */}
        <div className="grid gap-4 mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          {/* Delivery Time Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-green-200 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-[#2c3e50] mb-1">Tahmini Teslimat</h3>
                <p className="text-2xl font-black text-[#bb7c05]">15-25 dakika</p>
              </div>
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 mb-1">Sipariş Detayları E-posta ile Gönderildi</h3>
                <p className="text-sm text-blue-700">Sipariş bilgileriniz mail adresinize iletilmiştir. Lütfen kontrol edin.</p>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/5 rounded-2xl p-6 border-2 border-[#bb7c05]/20">
            <p className="text-base text-[#2c3e50] font-medium">
              🍔 <strong>Highway Burger</strong>'ı tercih ettiğiniz için teşekkür ederiz!
            </p>
          </div>
        </div>

          {/* Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 animate-fadeIn"
            style={{animationDelay: '0.3s'}}
          >
            <Home className="w-6 h-6" />
            Ana Sayfaya Dön
          </Link>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-8 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            Siparişinizle ilgili herhangi bir sorun olursa bizimle iletişime geçebilirsiniz.
          </p>
        </div>
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

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </>
  )
}
