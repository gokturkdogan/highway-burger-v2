import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Adresi güncelle
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await params
    const addressId = parseInt(id)

    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: 'Geçersiz adres ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, fullName, phone, city, district, fullAddress, isDefault } = body

    // Validasyon
    if (!title || !fullName || !phone || !city || !district || !fullAddress) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Adresin bu kullanıcıya ait olduğunu kontrol et
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Adres bulunamadı veya yetkiniz yok' },
        { status: 404 }
      )
    }

    // Eğer bu adres varsayılan olarak işaretlenmişse, diğer adreslerin varsayılan işaretini kaldır
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          id: { not: addressId },
        },
        data: { isDefault: false },
      })
    }

    // Adresi güncelle
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        title,
        fullName,
        phone,
        city,
        district,
        fullAddress,
        isDefault,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Adresi sil
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { id } = await params
    const addressId = parseInt(id)

    if (isNaN(addressId)) {
      return NextResponse.json(
        { error: 'Geçersiz adres ID' },
        { status: 400 }
      )
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Adresin bu kullanıcıya ait olduğunu kontrol et
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: user.id,
      },
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Adres bulunamadı veya yetkiniz yok' },
        { status: 404 }
      )
    }

    // Adresi sil
    await prisma.address.delete({
      where: { id: addressId },
    })

    return NextResponse.json({ message: 'Adres başarıyla silindi' })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

