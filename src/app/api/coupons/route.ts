import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Kupon kodu gerekli' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Kupon kodu bulunamadı' },
        { status: 404 }
      )
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { error: 'Kupon kodu aktif değil' },
        { status: 400 }
      )
    }

    if (new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { error: 'Kupon kodunun süresi dolmuş' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { error: 'Kupon doğrulanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

