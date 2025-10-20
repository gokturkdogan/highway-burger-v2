'use client'

import { useState, useCallback } from 'react'
import { X, MapPin, User, Phone, Save } from 'lucide-react'
import CustomSelect from './CustomSelect'
import dynamic from 'next/dynamic'

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

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (address: any) => void
  isLoading?: boolean
}

export default function AddressModal({ isOpen, onClose, onSave, isLoading = false }: AddressModalProps) {
  const [formData, setFormData] = useState({
    title: 'Ev',
    fullName: '',
    phone: '',
    city: 'İstanbul',
    district: '',
    fullAddress: '',
    latitude: null as number | null,
    longitude: null as number | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleClose = () => {
    onClose()
    // Reset form after animation
    setTimeout(() => {
      setFormData({
        title: 'Ev',
        fullName: '',
        phone: '',
        city: 'İstanbul',
        district: '',
        fullAddress: '',
        latitude: null,
        longitude: null,
      })
    }, 300)
  }

  const handleLocationChange = useCallback((location: { lat: number; lng: number }) => {
    setFormData(prev => ({ ...prev, latitude: location.lat, longitude: location.lng }))
  }, [])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-end md:items-center md:justify-center p-0 md:p-4">
        <div 
          className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            {/* Handle Bar (Mobile) */}
            <div className="md:hidden flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-xl font-bold text-[#2c3e50] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#bb7c05]" />
                Yeni Adres Ekle
              </h3>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title Selection */}
              <div className="mb-6">
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

              {/* Full Name */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none z-10">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent"
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

              {/* Phone */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none z-10">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 peer placeholder-transparent"
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

              {/* City & District */}
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

              {/* Full Address */}
              <div className="relative">
                <textarea
                  id="fullAddress"
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  className="w-full px-4 py-4 pt-5 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-0 outline-none transition-all duration-200 resize-none peer placeholder-transparent"
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

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-4 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Kaydet ve Kullan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}

