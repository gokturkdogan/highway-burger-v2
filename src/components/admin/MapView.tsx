'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapViewProps {
  latitude: number
  longitude: number
  address?: string
}

export default function MapView({ latitude, longitude, address }: MapViewProps) {
  return (
    <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {address && (
            <Popup>
              <div className="text-sm">
                <strong>Teslimat Adresi</strong>
                <p className="mt-1">{address}</p>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  )
}

