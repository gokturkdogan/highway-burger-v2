'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'
import CategoryList from '@/components/CategoryList'

export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories')
      return res.data
    },
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axios.get('/api/products')
      return res.data
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Hoş Geldiniz! 🍔
        </h1>
        <p className="text-muted-foreground text-lg">
          En lezzetli burgerleri keşfedin ve sipariş verin
        </p>
      </div>

      {categories && (
        <CategoryList categories={categories} />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
          <p className="text-muted-foreground">Henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  )
}

