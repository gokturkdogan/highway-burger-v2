'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'
import CategoryList from '@/components/CategoryList'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const res = await axios.get(`/api/products?category=${slug}`)
      return res.data
    },
  })

  const currentCategory = categories?.find(
    (cat: any) => cat.slug === slug
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {currentCategory?.name || 'Kategori'}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory?._count.products} ürün bulundu
        </p>
      </div>

      {categories && (
        <CategoryList categories={categories} activeSlug={slug} />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Bu kategoride henüz ürün bulunmuyor.
          </p>
        </div>
      )}
    </div>
  )
}

