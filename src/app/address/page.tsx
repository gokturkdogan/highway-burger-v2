'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star, Phone, User } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import ConfirmModal from '@/components/ConfirmModal'
import CustomSelect from '@/components/CustomSelect'
import dynamic from 'next/dynamic'

// Leaflet'i sadece client-side render et
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#bb7c05] border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Harita yükleniyor...</p>
      </div>
    </div>
  )
})

interface Address {
  id: number
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  fullAddress: string
  latitude?: number | null
  longitude?: number | null
  isDefault: boolean
}

export default function AddressPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: 'Ev',
    fullName: '',
    phone: '',
    city: 'İstanbul',
    district: '',
    fullAddress: '',
    latitude: null as number | null,
    longitude: null as number | null,
    isDefault: false,
  })

  // Login kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Adresleri çek
  const { data: addresses, isLoading } = useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await axios.get('/api/addresses')
      return res.data
    },
    enabled: status === 'authenticated',
  })

  // Adres ekleme mutation
  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post('/api/addresses', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Adres başarıyla eklendi!', 3000)
      resetForm()
      setIsAddingNew(false)
    },
    onError: () => {
      toast.error('Adres eklenirken hata oluştu!', 4000)
    },
  })

  // Adres güncelleme mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await axios.put(`/api/addresses/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Adres başarıyla güncellendi!', 3000)
      resetForm()
      setEditingId(null)
    },
    onError: () => {
      toast.error('Adres güncellenirken hata oluştu!', 4000)
    },
  })

  // Adres silme mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/addresses/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Adres başarıyla silindi!', 3000)
    },
    onError: () => {
      toast.error('Adres silinirken hata oluştu!', 4000)
    },
  })

  const resetForm = () => {
    setFormData({
      title: 'Ev',
      fullName: '',
      phone: '',
      city: 'İstanbul',
      district: '',
      fullAddress: '',
      latitude: null,
      longitude: null,
      isDefault: false,
    })
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      fullAddress: address.fullAddress,
      latitude: address.latitude || null,
      longitude: address.longitude || null,
      isDefault: address.isDefault,
    })
    setIsAddingNew(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData })
    } else {
      addMutation.mutate(formData)
    }
  }

  const handleCancel = () => {
    resetForm()
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }))
  }, [])

  const getTitleIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'ev':
        return <Home className="w-5 h-5" />
      case 'iş':
      case 'işyeri':
        return <Briefcase className="w-5 h-5" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center pb-20 md:pb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-6">
      {/* Mobile Header Banner */}
      <div className="md:hidden relative bg-gradient-to-br from-[#bb7c05] to-[#d49624] px-6 py-6 mb-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Adreslerim
          </h1>
          <p className="text-white/90 text-sm">Teslimat adreslerinizi yönetin</p>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2c3e50] mb-1">Adreslerim</h1>
                <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
              </div>
            </div>
            {!isAddingNew && !editingId && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Yeni Adres
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto">
        {/* Add New Address Button - Mobile */}
        {!isAddingNew && !editingId && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="md:hidden w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold mb-6 flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Yeni Adres Ekle
          </button>
        )}

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-[#2c3e50] mb-6">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Selection */}
              <div className="mb-10">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Adres Başlığı
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Ev', 'İş', 'Diğer'].map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => setFormData({ ...formData, title })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        formData.title === title
                          ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name with Floating Label */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none z-10">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                  placeholder="Ad Soyad"
                  required
                />
                <label
                  htmlFor="fullName"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    formData.fullName
                      ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
                      : 'top-1/2 -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-[#bb7c05] peer-focus:font-medium peer-focus:translate-y-0'
                  }`}
                >
                  Ad Soyad
                </label>
              </div>

              {/* Phone with Floating Label */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none z-10">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                  placeholder="Telefon"
                  required
                />
                <label
                  htmlFor="phone"
                  className={`absolute left-12 transition-all duration-200 pointer-events-none ${
                    formData.phone
                      ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
                      : 'top-1/2 -translate-y-1/2 text-gray-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-[#bb7c05] peer-focus:font-medium peer-focus:translate-y-0'
                  }`}
                >
                  Telefon Numaranız
                </label>
              </div>

              {/* City & District with Floating Labels */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed peer placeholder-transparent"
                    placeholder="İl"
                    disabled
                    readOnly
                  />
                  <label
                    htmlFor="city"
                    className="absolute left-4 -top-2.5 text-xs bg-white px-2 text-gray-500 font-medium pointer-events-none"
                  >
                    İl
                  </label>
                </div>
                <CustomSelect
                  id="district"
                  label="İlçe"
                  value={formData.district}
                  onChange={(value) => setFormData({ ...formData, district: value })}
                  options={[
                    { value: 'Sultanbeyli', label: 'Sultanbeyli' },
                    { value: 'Pendik', label: 'Pendik' },
                  ]}
                  placeholder="İlçe Seçin"
                  required
                />
              </div>

              {/* Full Address with Floating Label */}
              <div className="relative">
                <textarea
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="w-full px-4 py-4 pt-5 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 resize-none peer placeholder-transparent autofill:bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                  placeholder="Adres"
                  rows={3}
                  required
                />
                <label
                  htmlFor="fullAddress"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.fullAddress
                      ? '-top-2.5 text-xs bg-white px-2 text-[#bb7c05] font-medium'
                      : 'top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-2 peer-focus:text-[#bb7c05] peer-focus:font-medium'
                  }`}
                >
                  Adres (Mahalle, sokak, bina no, daire no)
                </label>
              </div>

              {/* Location Picker */}
              <LocationPicker
                value={formData.latitude && formData.longitude ? { lat: formData.latitude, lng: formData.longitude } : null}
                onChange={handleLocationChange}
              />

              {/* Default Address Checkbox */}
              <div className="flex items-center gap-3 bg-gradient-to-br from-[#bb7c05]/5 to-[#d49624]/5 p-4 rounded-xl border border-[#bb7c05]/20">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 text-[#bb7c05] border-gray-300 rounded focus:ring-[#bb7c05] focus:ring-2"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#bb7c05]" />
                  Varsayılan adres olarak ayarla
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {addMutation.isPending || updateMutation.isPending ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {editingId ? 'Güncelle' : 'Ekle'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {addresses?.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-2xl shadow-lg p-5 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn border-2 border-transparent hover:border-[#bb7c05]/20"
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className="absolute top-0 right-0 bg-gradient-to-br from-[#bb7c05] to-[#d49624] text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  Varsayılan
                </div>
              )}

              {/* Title */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 rounded-xl flex items-center justify-center text-[#bb7c05]">
                  {getTitleIcon(address.title)}
                </div>
                <h3 className="text-lg font-bold text-[#2c3e50]">{address.title}</h3>
              </div>

              {/* Content */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 font-medium">{address.fullName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{address.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-700">
                    <div className="font-medium">{address.city} / {address.district}</div>
                    <div className="text-gray-600 leading-relaxed mt-1">{address.fullAddress}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(address)}
                  className="flex-1 py-2.5 bg-gradient-to-br from-[#bb7c05]/10 to-[#d49624]/10 text-[#bb7c05] rounded-xl font-medium hover:from-[#bb7c05]/20 hover:to-[#d49624]/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Düzenle
                </button>
                <button
                  onClick={() => setDeleteId(address.id)}
                  className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>
              </div>
            </div>
          ))}

          {/* Empty State - Animated */}
          {!isLoading && addresses && addresses.length === 0 && !isAddingNew && !editingId && (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeIn">
              <div className="relative">
                {/* Animated Background Circles */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#bb7c05]/10 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -right-6 w-12 h-12 bg-[#d49624]/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Main Icon Container */}
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#bb7c05]/20" style={{boxShadow: '0 20px 60px rgba(187, 124, 5, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)'}}>
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center animate-bounce">
                    <MapPin className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-[#2c3e50] text-center mb-3">
                    Henüz Kayıtlı Adresiniz Yok
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-center mb-6 max-w-sm leading-relaxed">
                    Sipariş verebilmek için bir teslimat adresi eklemelisiniz.
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="px-8 py-3 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Adres Ekle
                    </button>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-[#bb7c05] rounded-full animate-ping"></div>
                <div className="absolute bottom-8 right-4 w-2 h-2 bg-[#d49624] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId)
            setDeleteId(null)
          }
        }}
        title="Adresi Sil"
        message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />

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
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

