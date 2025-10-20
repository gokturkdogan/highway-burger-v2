'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MapPin, Locate } from 'lucide-react'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface LocationPickerProps {
  value: { lat: number; lng: number } | null
  onChange: (location: { lat: number; lng: number }) => void
}

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMapEvents({})
  
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom())
  }, [center, map])
  
  return null
}

function LocationMarker({ position, setPosition }: { 
  position: { lat: number; lng: number } | null
  setPosition: (pos: { lat: number; lng: number }) => void 
}) {
  const map = useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  // Konum değiştiğinde haritayı oraya götür
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 16, {
        duration: 1.5 // 1.5 saniye smooth animasyon
      })
    }
  }, [position, map])

  return position ? <Marker position={[position.lat, position.lng]} /> : null
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value)
  const [isLocating, setIsLocating] = useState(false)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 40.9686, lng: 29.1167 })
  const [isMounted, setIsMounted] = useState(false)

  // Default Istanbul coordinates
  const defaultCenter = { lat: 40.9686, lng: 29.1167 } // Sultanbeyli merkez

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (position) {
      onChange(position)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])

  // İlk yüklemede kullanıcının konumunu almaya çalış
  useEffect(() => {
    // Eğer daha önce seçilmiş bir konum yoksa, kullanıcının konumunu al
    if (!value && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          setMapCenter(userLocation)
          // Otomatik olarak marker koyma, sadece haritayı ortalama
        },
        (error) => {
          console.log('Konum izni verilmedi, default konum kullanılıyor:', error)
          // Hata durumunda default center kullanılır (zaten state'te var)
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      )
    }
  }, [value])

  const handleGetCurrentLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          setPosition(newPos) // Bu haritayı otomatik oraya götürecek (flyTo ile)
          setIsLocating(false)
        },
        (error) => {
          console.error('Konum alınamadı:', error)
          setIsLocating(false)
          alert('Konum alınamadı. Haritadan manuel olarak seçebilirsiniz.')
        },
        {
          enableHighAccuracy: true, // Daha hassas konum
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setIsLocating(false)
      alert('Tarayıcınız konum özelliğini desteklemiyor.')
    }
  }

  if (!isMounted) {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#bb7c05]" />
          Konum Seçin
        </label>
        <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#bb7c05] border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Harita yükleniyor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#bb7c05]" />
        Konum Seçin
      </label>
      
      {/* Info Text */}
      <p className="text-xs text-gray-600 mb-3 bg-[#bb7c05]/5 p-3 rounded-lg border border-[#bb7c05]/10">
        💡 Haritadan konumunuzu işaretleyebilir veya mevcut konumunuzu kullanabilirsiniz
      </p>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={15}
          style={{ height: '300px', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={mapCenter} />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-xl shadow-lg border-2 border-gray-200 hover:border-[#bb7c05] transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Mevcut Konumumu Kullan"
        >
          {isLocating ? (
            <svg className="animate-spin h-5 w-5 text-[#bb7c05]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Locate className="w-5 h-5 text-[#bb7c05]" />
          )}
        </button>
      </div>

      {/* Selected Coordinates Display */}
      {position && (
        <div className="mt-3 p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200 flex items-center gap-2 animate-fadeIn">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-700 font-medium">
            Konum seçildi: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

