'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useToast } from '@/contexts/ToastContext'
import Image from 'next/image'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  category: any | null
}

export default function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image || '',
      })
      setPreviewUrl(category.image || '')
    } else {
      setFormData({
        name: '',
        slug: '',
        image: '',
      })
      setPreviewUrl('')
    }
    setSelectedFile(null)
  }, [category, isOpen])

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (category) {
        const res = await axios.put('/api/admin/categories', { ...data, id: category.id })
        return res.data
      } else {
        const res = await axios.post('/api/admin/categories', data)
        return res.data
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success(category ? 'Kategori güncellendi' : 'Kategori eklendi', 2000)
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
    if (!selectedFile) return null

    setIsUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('folder', 'categories') // Klasör: categories
      uploadFormData.append('slug', formData.slug) // Slug'ı gönder (dosya adı olacak)

      const res = await axios.post('/api/upload', uploadFormData)
      
      toast.success('Görsel yüklendi', 2000)
      setSelectedFile(null)
      return res.data.url // URL'i return et
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Görsel yüklenemedi', 3000)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If file is selected but not uploaded yet, upload first
    let uploadedUrl = formData.image
    if (selectedFile) {
      const url = await handleUpload()
      if (url) {
        uploadedUrl = url
      } else {
        // Upload failed, don't proceed
        return
      }
    }

    // Save category with the uploaded image URL
    saveMutation.mutate({
      ...formData,
      image: uploadedUrl
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
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
        <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
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
                Kategori Görseli
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
                        setFormData(prev => ({ ...prev, image: '' }))
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
                  onClick={async () => {
                    const url = await handleUpload()
                    if (url) {
                      setFormData(prev => ({ ...prev, image: url }))
                    }
                  }}
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
                Kategori Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Örn: Burgerler"
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
                placeholder="burgerler"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /categories/{formData.slug || 'slug'}
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saveMutation.isPending || isUploading}
                className="w-full py-4 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveMutation.isPending ? 'Kaydediliyor...' : category ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

