import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = body

    // Validasyon
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Ad Soyad gereklidir' },
        { status: 400 }
      )
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: name.trim() },
    })

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

