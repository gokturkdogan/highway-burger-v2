'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Lock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  imageUrl: string | null
  category: {
    name: string
    slug: string
  }
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem)

  // Store settings'i çek (cache'lendi, sadece 1 kere çalışır)
  const { data: storeSettings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const res = await axios.get('/api/admin/settings')
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca cache'ten al
    gcTime: 10 * 60 * 1000, // 10 dakika memory'de tut
    refetchOnWindowFocus: false, // Pencere focus değiştiğinde yeniden çekme
    refetchOnMount: false, // Component mount olduğunda cache varsa yeniden çekme
  })

  const isStoreClosed = storeSettings?.isOpen === false

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isStoreClosed) return
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
    })
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={product.imageUrl || '/placeholder-burger.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 right-2">
              {product.category.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-primary mt-3">
            {formatPrice(product.price)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            size="lg"
            disabled={isStoreClosed}
          >
            {isStoreClosed ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Mağaza Kapalı
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Sepete Ekle
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

