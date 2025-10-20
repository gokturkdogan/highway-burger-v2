import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
    const { currentPassword, newPassword } = body

    // Validasyon
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 6 karakter olmalıdır' },
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

    // Mevcut şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Mevcut şifreniz hatalı' },
        { status: 400 }
      )
    }

    // Yeni şifreyi hash'le
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Şifreyi güncelle
    await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({
      message: 'Şifreniz başarıyla güncellendi',
    })
  } catch (error) {
    console.error('Update password error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}

