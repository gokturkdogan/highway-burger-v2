'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { 
  CreditCard,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function FoodCardsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  // Fetch store settings
  const { data: storeSettings, isLoading } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/settings')
      return res.data
    },
    enabled: status === 'authenticated' && session?.user?.role === 'admin',
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // Food cards mutation
  const updateFoodCardsMutation = useMutation({
    mutationFn: async (acceptedFoodCards: Array<{name: string, imageUrl: string | null, isActive: boolean}>) => {
      const res = await axios.put('/api/admin/settings', { acceptedFoodCards })
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['store-settings'] })
      toast.success(data.message || 'Yemek kartları güncellendi', 3000)
    },
    onError: () => {
      toast.error('Yemek kartları güncellenemedi', 3000)
    },
  })

  type FoodCard = {
    name: string
    imageUrl: string | null
    isActive: boolean
  }

  const [foodCardInput, setFoodCardInput] = useState('')
  const [editingFoodCards, setEditingFoodCards] = useState<FoodCard[]>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  // Initialize editingFoodCards when storeSettings loads
  useEffect(() => {
    if (storeSettings?.acceptedFoodCards) {
      try {
        let cards: any[] = []
        
        // Prisma JSON tipi zaten parse edilmiş olarak gelir
        if (Array.isArray(storeSettings.acceptedFoodCards)) {
          cards = storeSettings.acceptedFoodCards
        } else if (typeof storeSettings.acceptedFoodCards === 'string') {
          // Eğer string ise parse et
          cards = JSON.parse(storeSettings.acceptedFoodCards)
        } else if (storeSettings.acceptedFoodCards) {
          // Obje ise direkt kullan
          cards = [storeSettings.acceptedFoodCards]
        }
        
        if (cards && cards.length > 0) {
          setEditingFoodCards(cards.map((card: any) => ({
            name: typeof card === 'string' ? card : (card.name || ''),
            imageUrl: typeof card === 'string' ? null : (card.imageUrl || null),
            isActive: typeof card === 'string' ? true : (card.isActive !== undefined ? card.isActive : true)
          })))
        } else {
          setEditingFoodCards([])
        }
      } catch (e) {
        console.error('Error parsing food cards:', e, storeSettings.acceptedFoodCards)
        setEditingFoodCards([])
      }
    } else {
      // Eğer acceptedFoodCards yoksa boş array set et
      setEditingFoodCards([])
    }
  }, [storeSettings?.acceptedFoodCards])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingIndex(index)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'food-cards')
      formData.append('slug', `food-card-${Date.now()}-${index}`)

      const res = await axios.post('/api/upload', formData)
      
      const updatedCards = [...editingFoodCards]
      updatedCards[index].imageUrl = res.data.url
      setEditingFoodCards(updatedCards)
      
      toast.success('Görsel yüklendi', 2000)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Görsel yüklenemedi', 3000)
    } finally {
      setUploadingIndex(null)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <div className="bg-white shadow-md py-6 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50]">Yemek Kartları Yönetimi</h1>
              <p className="text-gray-600 mt-1">Checkout sayfasında görünecek yemek kartlarını yönetin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Food Cards Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-transparent hover:border-[#bb7c05]/30 transition-all">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#2c3e50] mb-1">
                Kabul Edilen Yemek Kartları
              </h3>
              <p className="text-sm text-gray-600">
                Checkout sayfasında görünecek yemek kartlarını yönetin. Görselleri yükleyin, aktif/pasif durumunu ayarlayın.
              </p>
            </div>
          </div>

          {/* Current Cards List */}
          <div className="mb-6 space-y-3">
            {editingFoodCards.map((card, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  card.isActive 
                    ? 'bg-white border-amber-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Image Preview/Upload */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-contain rounded-lg border border-gray-200 bg-white p-1"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 cursor-pointer">
                      <div className="w-6 h-6 bg-[#bb7c05] rounded-full flex items-center justify-center hover:bg-[#d49624] transition-colors">
                        {uploadingIndex === index ? (
                          <Loader2 className="w-3 h-3 text-white animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file, index)
                        }}
                        disabled={uploadingIndex === index}
                      />
                    </label>
                  </div>

                  {/* Card Info */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={card.name}
                      onChange={(e) => {
                        const updated = [...editingFoodCards]
                        updated[index].name = e.target.value
                        setEditingFoodCards(updated)
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#bb7c05] focus:ring-2 focus:ring-[#bb7c05]/20 transition-all font-medium text-gray-900"
                      placeholder="Kart adı"
                    />
                    
                    {/* Active Toggle */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          const updated = [...editingFoodCards]
                          updated[index].isActive = !updated[index].isActive
                          setEditingFoodCards(updated)
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          card.isActive 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            card.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-medium ${
                        card.isActive ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {card.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      const newCards = editingFoodCards.filter((_, i) => i !== index)
                      setEditingFoodCards(newCards)
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {editingFoodCards.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">Henüz yemek kartı eklenmedi</p>
            )}

            {/* Add New Card Input */}
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <input
                type="text"
                value={foodCardInput}
                onChange={(e) => setFoodCardInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && foodCardInput.trim()) {
                    const exists = editingFoodCards.some(c => c.name.toLowerCase() === foodCardInput.trim().toLowerCase())
                    if (!exists) {
                      setEditingFoodCards([...editingFoodCards, {
                        name: foodCardInput.trim(),
                        imageUrl: null,
                        isActive: true
                      }])
                      setFoodCardInput('')
                    }
                  }
                }}
                placeholder="Yeni yemek kartı adı (örn: Yemeksepeti Kartı)"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#bb7c05] focus:ring-2 focus:ring-[#bb7c05]/20 transition-all"
              />
              <button
                onClick={() => {
                  if (foodCardInput.trim()) {
                    const exists = editingFoodCards.some(c => c.name.toLowerCase() === foodCardInput.trim().toLowerCase())
                    if (!exists) {
                      setEditingFoodCards([...editingFoodCards, {
                        name: foodCardInput.trim(),
                        imageUrl: null,
                        isActive: true
                      }])
                      setFoodCardInput('')
                    } else {
                      toast.warning('Bu kart zaten ekli', 2000)
                    }
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ekle
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={() => updateFoodCardsMutation.mutate(editingFoodCards)}
            disabled={updateFoodCardsMutation.isPending || editingFoodCards.length === 0}
            className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateFoodCardsMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Yemek Kartlarını Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

