'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

interface MapViewProps {
  latitude: number
  longitude: number
  address?: string
}

export default function MapView({ latitude, longitude, address }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [mapId] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Eğer map zaten varsa, önce temizle
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Yeni map oluştur
    try {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      const marker = L.marker([latitude, longitude]).addTo(map)

      if (address) {
        marker.bindPopup(`
          <div style="font-size: 14px;">
            <strong>Teslimat Adresi</strong>
            <p style="margin-top: 4px;">${address}</p>
          </div>
        `)
      }

      mapRef.current = map

      // Force resize after a short delay
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    } catch (error) {
      console.error('Map initialization error:', error)
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [latitude, longitude, address])

  return (
    <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-200">
      <div 
        id={mapId}
        ref={mapContainerRef} 
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  )
}

