import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET - Store settings'i al
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin olmasa bile settings'i okuyabilir (frontend'te store açık mı kontrolü için)
    const settings = await prisma.storeSettings.findUnique({
      where: { id: 1 },
    })

    // Eğer yoksa default oluştur
    if (!settings) {
      const newSettings = await prisma.storeSettings.create({
        data: {
          id: 1,
          isOpen: true,
        },
      })
      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Ayarlar alınamadı' },
      { status: 500 }
    )
  }
}

// PUT - Store settings'i güncelle (Sadece admin)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Admin check
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isOpen, deliveryStatus } = body

    // Validation
    if (isOpen !== undefined && typeof isOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'isOpen boolean olmalıdır' },
        { status: 400 }
      )
    }

    if (deliveryStatus !== undefined && !['normal', 'busy', 'very_busy'].includes(deliveryStatus)) {
      return NextResponse.json(
        { error: 'deliveryStatus: normal, busy veya very_busy olmalıdır' },
        { status: 400 }
      )
    }

    // Update data objesi oluştur
    const updateData: any = {}
    if (isOpen !== undefined) updateData.isOpen = isOpen
    if (deliveryStatus !== undefined) updateData.deliveryStatus = deliveryStatus

    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        isOpen: isOpen !== undefined ? isOpen : true,
        deliveryStatus: deliveryStatus || 'normal',
      },
    })

    // Success message
    let message = ''
    if (isOpen !== undefined) {
      message = isOpen ? 'Mağaza açıldı ✅' : 'Mağaza kapatıldı ❌'
    } else if (deliveryStatus !== undefined) {
      const statusMap: Record<string, string> = {
        normal: 'Normal teslimat (~20 dk) ⚡',
        busy: 'Yoğun teslimat (~40 dk) ⏱️',
        very_busy: 'Çok yoğun teslimat (~1 saat) 🚨',
      }
      message = statusMap[deliveryStatus]
    }

    return NextResponse.json({
      success: true,
      settings,
      message,
    })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Ayarlar güncellenemedi' },
      { status: 500 }
    )
  }
}

