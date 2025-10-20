'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Plus, Edit2, Trash2, Image as ImageIcon, Search } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import ProductFormModal from '@/components/admin/ProductFormModal'
import ConfirmModal from '@/components/ConfirmModal'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  secondPrice: number | null
  extraText: string | null
  imageUrl: string | null
  categoryId: number
  isActive: boolean
  category: {
    id: number
    name: string
  }
}

export default function AdminProductsPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/products')
      return res.data
    },
  })

  // Fetch categories for filtering
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
  })

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/admin/products?id=${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      toast.success('Ürün silindi', 2000)
      setDeleteProductId(null)
    },
    onError: () => {
      toast.error('Ürün silinemedi', 3000)
    },
  })

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsFormModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedProduct(null)
    setIsFormModalOpen(true)
  }

  const filteredProducts = products?.filter(product => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      product.name.toLowerCase().includes(searchLower) ||
      product.slug.toLowerCase().includes(searchLower) ||
      product.category.name.toLowerCase().includes(searchLower)
    )
    const matchesCategory = selectedCategory === 'all' || product.categoryId.toString() === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bb7c05] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Ürün Yönetimi</h1>
            <p className="text-gray-600">Ürünleri ekleyin, düzenleyin ve silin</p>
          </div>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Yeni Ürün Ekle
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün adı, slug veya kategori ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#bb7c05] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Kategori Filtrele</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü ({products?.length || 0})
            </button>
            {categories?.map((cat: any) => {
              const categoryProducts = products?.filter(p => p.categoryId === cat.id) || []
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === cat.id.toString()
                      ? 'bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({categoryProducts.length})
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-[#2c3e50] mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1 bg-[#bb7c05]/10 text-[#bb7c05] rounded-full text-xs font-medium">
                      {product.category.name}
                    </span>
                    {product.extraText && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {product.extraText}
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.isActive 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.isActive ? '✓ Aktif' : '✕ Pasif'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#bb7c05]">
                        ₺{product.price.toFixed(2)}
                      </div>
                      {product.secondPrice && (
                        <div className="text-sm text-gray-600">
                          İkinci: ₺{product.secondPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Düzenle</span>
                    </button>
                    <button
                      onClick={() => setDeleteProductId(product.id)}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Sil</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Ürün bulunamadı</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteProductId !== null}
        onClose={() => setDeleteProductId(null)}
        onConfirm={() => deleteProductId && deleteProductMutation.mutate(deleteProductId)}
        title="Ürünü Sil"
        message="Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
      />
    </div>
  )
}

