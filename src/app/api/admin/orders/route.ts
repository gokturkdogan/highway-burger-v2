import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderStatusEmail } from '@/lib/email'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status && status !== 'all' ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, status, paymentStatus } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Eğer sipariş durumu değiştiyse mail gönder
    if (status && status !== 'received') {
      try {
        // Mail gönderilecek email adresini belirle
        const email = order.user?.email || order.deliveryEmail
        const name = order.user?.name || order.deliveryName || 'Müşteri'

        if (email) {
          // Sipariş verilerini hazırla
          const orderData = {
            orderId: order.id,
            name: name,
            status: status,
            total: order.total,
            items: order.items.map(item => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
              extraText: item.product.extraText || undefined,
              selectedOption: item.selectedOption || undefined,
            })),
            shippingAddress: {
              fullName: order.deliveryName || name,
              phone: order.deliveryPhone || '',
              city: order.deliveryCity || '',
              district: order.deliveryDistrict || '',
              fullAddress: order.deliveryAddress || '',
            },
            paymentMethod: order.paymentMethod || 'Bilinmiyor',
          }

          // Mail gönder
          await sendOrderStatusEmail(email, orderData)
        }
      } catch (emailError) {
        console.error('Order status email error:', emailError)
        // Mail hatası olsa bile sipariş güncelleme başarılı
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

