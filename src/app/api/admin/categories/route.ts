import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Tüm kategorileri al (ürün sayıları ile)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin check
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            isActive: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Aktif ve pasif ürün sayılarını hesapla
    const categoriesWithCounts = categories.map(cat => ({
      ...cat,
      activeProductCount: cat.products.filter(p => p.isActive).length,
      inactiveProductCount: cat.products.filter(p => !p.isActive).length,
      products: undefined, // products listesini çıkar, sadece sayıları gönder
    }))

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { error: 'Kategoriler alınamadı' },
      { status: 500 }
    )
  }
}

// POST - Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin check
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, image } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'İsim ve slug gereklidir' },
        { status: 400 }
      )
    }

    // Slug kontrolü
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || null,
      },
    })

    return NextResponse.json({
      success: true,
      category,
      message: 'Kategori başarıyla eklendi',
    })
  } catch (error) {
    console.error('Category POST error:', error)
    return NextResponse.json(
      { error: 'Kategori eklenemedi' },
      { status: 500 }
    )
  }
}

// PUT - Kategori güncelle
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin check
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, slug, image } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID gereklidir' },
        { status: 400 }
      )
    }

    // Slug kontrolü (başka kategoride kullanılıyor mu?)
    if (slug) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Bu slug başka bir kategoride kullanılıyor' },
          { status: 400 }
        )
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
        image: image !== undefined ? image : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      category,
      message: 'Kategori başarıyla güncellendi',
    })
  } catch (error) {
    console.error('Category PUT error:', error)
    return NextResponse.json(
      { error: 'Kategori güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Kategori sil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin check
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Kategori ID gereklidir' },
        { status: 400 }
      )
    }

    // Kategoriye ait ürün var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: `Bu kategoride ${category._count.products} ürün var. Önce ürünleri silmelisiniz.` },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla silindi',
    })
  } catch (error) {
    console.error('Category DELETE error:', error)
    return NextResponse.json(
      { error: 'Kategori silinemedi' },
      { status: 500 }
    )
  }
}

