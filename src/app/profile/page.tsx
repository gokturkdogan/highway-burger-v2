'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Save, X, Edit2, CheckCircle } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import Image from 'next/image'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const toast = useToast()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Session'dan verileri yükle
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
      })
    }
  }, [session])

  // Login kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Bir hata oluştu!', 4000)
        setIsLoading(false)
        return
      }

      // Session'ı güncelle
      await update({ name: profileData.name })
      
      toast.success('Profiliniz başarıyla güncellendi!', 3000)
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', 4000)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Şifre eşleşme kontrolü
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Yeni şifreler eşleşmiyor!', 4000)
        setIsLoading(false)
        return
      }

      // Şifre uzunluk kontrolü
      if (passwordData.newPassword.length < 6) {
        toast.error('Şifre en az 6 karakter olmalıdır!', 4000)
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/user/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Bir hata oluştu!', 4000)
        setIsLoading(false)
        return
      }

      toast.success('Şifreniz başarıyla güncellendi!', 3000)
      setIsEditingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Update password error:', error)
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.', 4000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Header Banner - Mobile */}
      <div className="md:hidden relative bg-gradient-to-br from-[#bb7c05] to-[#d49624] px-6 py-8 mb-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{session.user?.name}</h1>
          <p className="text-white/90 text-sm">{session.user?.email}</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50] mb-1">Profilim</h1>
              <p className="text-gray-600">Kişisel bilgilerinizi yönetin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c3e50] flex items-center gap-2">
                <User className="w-5 h-5 text-[#bb7c05]" />
                Kişisel Bilgiler
              </h2>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-[#bb7c05] hover:text-[#d49624] transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Düzenle
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Email Input (Readonly) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Kaydet
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false)
                      setProfileData({
                        name: session.user?.name || '',
                        email: session.user?.email || '',
                      })
                    }}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Name Display */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Ad Soyad</div>
                  <div className="text-base font-bold text-[#2c3e50] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#bb7c05]" />
                    {session.user?.name}
                  </div>
                </div>

                {/* Email Display */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-100">
                  <div className="text-xs text-gray-500 mb-1 font-medium">E-posta</div>
                  <div className="text-base font-bold text-[#2c3e50] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#bb7c05]" />
                    {session.user?.email}
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-xl border-2 border-green-100">
                  <div className="text-xs text-green-600 mb-1 font-medium">Hesap Durumu</div>
                  <div className="text-base font-bold text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Aktif
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Password Change Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#2c3e50] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#bb7c05]" />
                Şifre Değiştir
              </h2>
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="text-[#bb7c05] hover:text-[#d49624] transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Değiştir
                </button>
              )}
            </div>

            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200"
                    placeholder="Mevcut şifrenizi girin"
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200"
                    placeholder="Yeni şifrenizi girin"
                    required
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Şifre Tekrar
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200"
                    placeholder="Yeni şifrenizi tekrar girin"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Kaydet
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPassword(false)
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      })
                    }}
                    className="px-6 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    İptal
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-[#bb7c05]" />
                </div>
                <p className="text-gray-600 mb-4">Şifrenizi güncellemek için düzenle butonuna tıklayın</p>
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Edit2 className="w-4 h-4" />
                  Şifre Değiştir
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Account Stats - Desktop Only */}
        <div className="hidden md:grid grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-[#bb7c05]">
            <div className="text-3xl font-bold text-[#bb7c05] mb-1">0</div>
            <div className="text-sm text-gray-600 font-medium">Toplam Sipariş</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-green-500">
            <div className="text-3xl font-bold text-green-600 mb-1">0₺</div>
            <div className="text-sm text-gray-600 font-medium">Toplam Harcama</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-t-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {new Date(session.user.createdAt || Date.now()).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600 font-medium">Üyelik Tarihi</div>
          </div>
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

