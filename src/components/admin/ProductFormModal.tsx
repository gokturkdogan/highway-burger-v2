'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '@/contexts/ToastContext'
import Image from 'next/image'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  product: any | null
}

export default function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    secondPrice: '',
    extraText: '',
    imageUrl: '',
    categoryId: '',
    isActive: true,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price.toString(),
        secondPrice: product.secondPrice?.toString() || '',
        extraText: product.extraText || '',
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId.toString(),
        isActive: product.isActive !== undefined ? product.isActive : true,
      })
      setPreviewUrl(product.imageUrl || '')
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        secondPrice: '',
        extraText: '',
        imageUrl: '',
        categoryId: '',
        isActive: true,
      })
      setPreviewUrl('')
    }
    setSelectedFile(null)
  }, [product, isOpen])

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (product) {
        const res = await axios.put('/api/admin/products', { ...data, id: product.id })
        return res.data
      } else {
        const res = await axios.post('/api/admin/products', data)
        return res.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(product ? 'Ürün güncellendi' : 'Ürün eklendi', 2000)
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Bir hata oluştu', 3000)
    },
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('folder', 'products')

      const res = await axios.post('/api/upload', formData)
      
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }))
      toast.success('Görsel yüklendi', 2000)
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Görsel yüklenemedi', 3000)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If file is selected but not uploaded yet
    if (selectedFile) {
      await handleUpload()
    }

    // Wait a bit for upload to complete
    setTimeout(() => {
      saveMutation.mutate(formData)
    }, selectedFile ? 500 : 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData(prev => ({ ...prev, name: value, slug }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ürün Görseli
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
                {previewUrl ? (
                  <div className="relative">
                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('')
                        setFormData(prev => ({ ...prev, imageUrl: '' }))
                        setSelectedFile(null)
                      }}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      Görseli Kaldır
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Görsel Yükle</span>
                      <span className="text-xs text-gray-400">PNG, JPG, WEBP (Max 5MB)</span>
                    </button>
                  </div>
                )}
              </div>
              {selectedFile && !isUploading && (
                <button
                  type="button"
                  onClick={handleUpload}
                  className="mt-2 w-full px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium"
                >
                  Yükle
                </button>
              )}
              {isUploading && (
                <div className="mt-2 flex items-center justify-center gap-2 text-[#bb7c05]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Yükleniyor...</span>
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Açıklama *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none resize-none"
              />
            </div>

            {/* Category - Modern Grid Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Kategori *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories?.map((cat: any) => {
                  const isSelected = formData.categoryId === cat.id.toString()
                  const categoryIcons: Record<string, string> = {
                    'burgers': '🍔',
                    'toast': '🍞',
                    'kofte': '🥩',
                    'sandwiches': '🥪',
                    'drinks': '🥤',
                    'menus': '🍽️',
                  }
                  const icon = categoryIcons[cat.slug] || '📦'
                  
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, categoryId: cat.id.toString() }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#bb7c05] to-[#d49624] text-white border-[#bb7c05] scale-105 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#bb7c05]/30 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                          {cat.name}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              {!formData.categoryId && (
                <p className="mt-2 text-xs text-red-600">* Lütfen bir kategori seçin</p>
              )}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Fiyat (₺) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  İkinci Fiyat (₺)
                </label>
                <input
                  type="number"
                  name="secondPrice"
                  value={formData.secondPrice}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
                />
              </div>
            </div>

            {/* Extra Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ekstra Bilgi (110/180gr gibi)
              </label>
              <input
                type="text"
                name="extraText"
                value={formData.extraText}
                onChange={handleChange}
                placeholder="Örn: 110/180gr"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
              />
            </div>

            {/* Is Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Ürün Durumu
                </label>
                <p className="text-xs text-gray-600">
                  {formData.isActive ? 'Ürün müşterilere gösteriliyor' : 'Ürün gizli (müşterilere gösterilmiyor)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saveMutation.isPending || isUploading}
                className="w-full py-4 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveMutation.isPending ? 'Kaydediliyor...' : product ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

