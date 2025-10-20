import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { total, paymentMethod, address, items } = body

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        total: parseFloat(total),
        status: 'received',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || null,
        // Teslimat bilgileri
        deliveryName: address?.fullName || null,
        deliveryPhone: address?.phone || null,
        deliveryCity: address?.city || null,
        deliveryDistrict: address?.district || null,
        deliveryAddress: address?.fullAddress || null,
        deliveryLatitude: address?.latitude || null,
        deliveryLongitude: address?.longitude || null,
        // Ürünleri ekle
        items: {
          create: items?.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            selectedOption: item.selectedOption || null,
            extraText: item.extraText || null,
          })) || [],
        },
      },
    })

    console.log('✅ Order created:', order.id, 'Payment method:', paymentMethod, 'Items:', items?.length)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('❌ Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Sipariş oluşturulamadı' },
      { status: 500 }
    )
  }
}

