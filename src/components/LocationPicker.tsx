'use client'

import { useEffect, useState, useRef } from 'react'
import { MapPin, Locate } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface LocationPickerProps {
  value: { lat: number; lng: number } | null
  onChange: (location: { lat: number; lng: number }) => void
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value)
  const [isLocating, setIsLocating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [mapId] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`)

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Harita oluşturma
  useEffect(() => {
    if (!mapContainerRef.current || !isMounted) return

    // Eğer map zaten varsa, önce temizle
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    try {
      // Default center
      const defaultCenter: [number, number] = [40.9686, 29.1167] // Sultanbeyli
      const initialCenter = value ? [value.lat, value.lng] as [number, number] : defaultCenter

      // Yeni map oluştur
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 15,
        scrollWheelZoom: true,
      })

      // Tile layer ekle
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Eğer value varsa marker ekle
      if (value) {
        const marker = L.marker([value.lat, value.lng]).addTo(map)
        markerRef.current = marker
      }

      // Haritaya tıklandığında marker ekle/taşı
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newPos = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        }
        
        // Eski marker'ı kaldır
        if (markerRef.current) {
          markerRef.current.remove()
        }
        
        // Yeni marker ekle
        const marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
        markerRef.current = marker
        
        // State'i güncelle
        setPosition(newPos)
        onChange(newPos)
        
        // Haritayı yeni konuma götür (smooth animation)
        map.flyTo([e.latlng.lat, e.latlng.lng], 16, {
          duration: 1
        })
      })

      mapRef.current = map

      // Harita boyutunu ayarla
      setTimeout(() => {
        map.invalidateSize()
      }, 100)

    } catch (error) {
      console.error('Map initialization error:', error)
    }

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isMounted, value, onChange])

  const handleGetCurrentLocation = () => {
    setIsLocating(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          
          // Eski marker'ı kaldır
          if (markerRef.current) {
            markerRef.current.remove()
          }
          
          // Yeni marker ekle
          if (mapRef.current) {
            const marker = L.marker([newPos.lat, newPos.lng]).addTo(mapRef.current)
            markerRef.current = marker
            
            // Haritayı konuma götür
            mapRef.current.flyTo([newPos.lat, newPos.lng], 16, {
              duration: 1
            })
          }
          
          setPosition(newPos)
          onChange(newPos)
          setIsLocating(false)
        },
        (error) => {
          console.error('Konum alınamadı:', error)
          setIsLocating(false)
          alert('Konum alınamadı. Haritadan manuel olarak seçebilirsiniz.')
        },
        {
          enableHighAccuracy: true,
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
        <div 
          id={mapId}
          ref={mapContainerRef}
          style={{ height: '300px', width: '100%' }}
          className="z-0"
        />

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

