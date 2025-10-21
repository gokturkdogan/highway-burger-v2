'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Package, CheckCircle, XCircle, Folder } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import CategoryFormModal from '@/components/admin/CategoryFormModal'
import ConfirmModal from '@/components/ConfirmModal'

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toast = useToast()
  const queryClient = useQueryClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Kategorileri çek
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/categories')
      return res.data
    },
    enabled: status === 'authenticated',
  })

  // Kategori silme mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/admin/categories?id=${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Kategori silindi', 2000)
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Kategori silinemedi', 3000)
      setDeleteId(null)
    },
  })

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/admin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      {/* Header */}
      <div className="bg-white shadow-md py-6 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-xl flex items-center justify-center">
                <Folder className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#2c3e50]">Kategori Yönetimi</h1>
                <p className="text-gray-600 mt-1">
                  {categories?.length || 0} kategori • Ekle, düzenle, sil
                </p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Kategori
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories?.map((category: any) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent hover:border-[#bb7c05]/30 transition-all duration-300 hover:scale-[1.02] group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-[#bb7c05]/5 to-[#d49624]/5">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Folder className="w-20 h-20 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Name & Slug */}
                <h3 className="text-xl font-bold text-[#2c3e50] mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 font-mono">
                  /{category.slug}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Total Products */}
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-700">
                      {category._count.products}
                    </span>
                  </div>

                  {/* Active Products */}
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-700">
                      {category.activeProductCount}
                    </span>
                  </div>

                  {/* Inactive Products */}
                  {category.inactiveProductCount > 0 && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <XCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-600">
                        {category.inactiveProductCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex-1 px-4 py-2.5 bg-[#bb7c05]/10 text-[#bb7c05] rounded-xl font-medium hover:bg-[#bb7c05]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!isLoading && categories?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-gradient-to-br from-[#bb7c05] to-[#d49624] rounded-full flex items-center justify-center mb-6">
                <Folder className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#2c3e50] mb-2">
                Henüz Kategori Yok
              </h3>
              <p className="text-gray-600 mb-6">
                İlk kategorinizi ekleyerek başlayın
              </p>
              <button
                onClick={handleAdd}
                className="px-8 py-3 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Kategori Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Kategoriyi Sil"
        message="Bu kategoriyi silmek istediğinizden emin misiniz?"
        confirmText="Sil"
        cancelText="İptal"
        type="danger"
      />
    </div>
  )
}

