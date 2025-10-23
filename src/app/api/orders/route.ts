import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { orderEvents } from '@/lib/events'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { total, paymentMethod, address, items, orderNote } = body

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        total: parseFloat(total),
        status: 'received',
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || null,
        orderNote: orderNote || null, // Sipariş notu
        // Teslimat bilgileri
        deliveryName: address?.fullName || null,
        deliveryEmail: address?.email || null,
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

    // SSE ile admin'e bildir
    try {
      console.log('📢 About to emit order event:', order.id)
      orderEvents.emit({
        type: 'new_order',
        order: {
          id: order.id,
          total: order.total,
          deliveryName: order.deliveryName,
          createdAt: order.createdAt,
        }
      })
      console.log('✅ Event emitted successfully')
    } catch (sseError) {
      console.error('❌ SSE emit error:', sseError)
      // SSE hatası sipariş oluşturmayı engellemez
    }

    // Email gönder
    const emailAddress = session?.user?.email || address?.email
    if (emailAddress) {
      try {
        await sendOrderConfirmationEmail(emailAddress, {
          orderId: order.id,
          name: address?.fullName || session?.user?.name || 'Müşteri',
          total: order.total,
          orderNote: order.orderNote,
          items: items || [],
          shippingAddress: {
            fullName: address?.fullName || '',
            phone: address?.phone || '',
            city: address?.city || '',
            district: address?.district || '',
            fullAddress: address?.fullAddress || '',
          },
          paymentMethod: paymentMethod || 'Belirtilmemiş',
        })
        console.log('✅ Order confirmation email sent to:', emailAddress)
      } catch (emailError) {
        console.error('❌ Email send error:', emailError)
        // Email hatası sipariş oluşturmayı engellemez
      }
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('❌ Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Sipariş oluşturulamadı' },
      { status: 500 }
    )
  }
}

