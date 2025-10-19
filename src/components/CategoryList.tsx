'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: number
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface CategoryListProps {
  categories: Category[]
  activeSlug?: string
}

export default function CategoryList({
  categories,
  activeSlug,
}: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/">
        <Button variant={!activeSlug ? 'default' : 'outline'}>
          Tümü
          <Badge variant="secondary" className="ml-2">
            {categories.reduce((sum, cat) => sum + cat._count.products, 0)}
          </Badge>
        </Button>
      </Link>
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Button variant={activeSlug === category.slug ? 'default' : 'outline'}>
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category._count.products}
            </Badge>
          </Button>
        </Link>
      ))}
    </div>
  )
}

