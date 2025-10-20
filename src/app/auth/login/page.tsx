'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // NextAuth ile giriş yap
      const { signIn } = await import('next-auth/react')
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        // Hata durumu
        toast.error('E-posta veya şifre hatalı!', 4000)
        setIsLoading(false)
      } else if (result?.ok) {
        // Başarılı
        toast.success('Giriş başarılı! Yönlendiriliyorsunuz...', 2000)
        
        // Anasayfaya yönlendir
        setTimeout(() => {
          router.push('/')
          router.refresh() // Session'ı güncelle
        }, 1500)
      } else {
        // Bilinmeyen hata
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', 4000)
        setIsLoading(false)
      }
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', 4000)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-lg">
              <Image
                src="/images/logo/splash.png"
                alt="Highway Burger"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Hoş Geldiniz</h1>
          <p className="text-gray-600">Hesabınıza giriş yapın</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-fadeIn" style={{animationDelay: '0.1s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input with Floating Label */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                placeholder="E-posta Adresiniz"
                required
              />
              <label
                htmlFor="email"
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  email
                    ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-[#bb7c05] peer-focus:font-medium peer-focus:translate-y-0'
                }`}
              >
                E-posta Adresiniz
              </label>
            </div>

            {/* Password Input with Floating Label */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                placeholder="Şifreniz"
                required
              />
              <label
                htmlFor="password"
                className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                  password
                    ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
                    : 'top-1/2 -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-[#bb7c05] peer-focus:font-medium peer-focus:translate-y-0'
                }`}
              >
                Şifreniz
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#bb7c05] transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#bb7c05] hover:text-[#d49624] font-medium transition-colors duration-200"
              >
                Şifremi Unuttum
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">veya</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                href="/auth/register"
                className="text-[#bb7c05] hover:text-[#d49624] font-bold transition-colors duration-200"
              >
                Hemen Kayıt Olun
              </Link>
            </p>
          </div>
        </div>

        {/* Guest Continue */}
        <div className="text-center mt-6 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <Link
            href="/"
            className="text-gray-600 hover:text-[#bb7c05] transition-colors duration-200 inline-flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            Misafir Olarak Devam Et
          </Link>
        </div>
      </div>

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
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
