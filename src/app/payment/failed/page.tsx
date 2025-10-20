'use client'

import Link from 'next/link'
import { XCircle, Home, RefreshCw } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center animate-fadeIn">
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
            <XCircle className="w-16 h-16 text-white" strokeWidth={3} />
          </div>
          {/* Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-red-400 rounded-full opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-[#2c3e50] mb-4">
          Ödeme Başarısız
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tekrar Dene
          </Link>

          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
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
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
