import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createCheckoutForm } from '@/lib/iyzico'
import { z } from 'zod'

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  couponCode: z.string().optional(),
  discount: z.number().default(0),
  shippingAddress: z.object({
    contactName: z.string(),
    city: z.string(),
    address: z.string(),
    phone: z.string(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Giriş yapmalısınız' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { items, couponCode, discount, shippingAddress } =
      checkoutSchema.parse(body)

    // Toplam tutarı hesapla
    let total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const discountAmount = (total * discount) / 100
    const paidPrice = total - discountAmount

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: parseInt(session.user.id),
        total,
        discount: discountAmount,
        status: 'pending',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Iyzico checkout form oluştur
    const basketItems = order.items.map((item) => ({
      id: item.product.id.toString(),
      name: item.product.name,
      category1: 'Food',
      itemType: 'PHYSICAL' as const,
      price: (item.price * item.quantity).toFixed(2),
    }))

    const iyzicoRequest = {
      locale: 'tr',
      conversationId: order.id.toString(),
      price: total.toFixed(2),
      paidPrice: paidPrice.toFixed(2),
      currency: 'TRY',
      basketId: order.id.toString(),
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/callback`,
      enabledInstallments: [1],
      buyer: {
        id: session.user.id,
        name: shippingAddress.contactName.split(' ')[0] || 'Ad',
        surname: shippingAddress.contactName.split(' ')[1] || 'Soyad',
        gsmNumber: shippingAddress.phone,
        email: session.user.email || 'email@example.com',
        identityNumber: '11111111111',
        registrationAddress: shippingAddress.address,
        ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
        city: shippingAddress.city,
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: 'Turkey',
        address: shippingAddress.address,
      },
      billingAddress: {
        contactName: shippingAddress.contactName,
        city: shippingAddress.city,
        country: 'Turkey',
        address: shippingAddress.address,
      },
      basketItems,
    }

    const iyzicoResult = await createCheckoutForm(iyzicoRequest)

    if (iyzicoResult.status === 'success') {
      return NextResponse.json({
        orderId: order.id,
        checkoutFormContent: iyzicoResult.checkoutFormContent,
        paymentPageUrl: iyzicoResult.paymentPageUrl,
      })
    } else {
      // Sipariş başarısız olarak işaretle
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'failed' },
      })

      return NextResponse.json(
        { error: 'Ödeme sayfası oluşturulamadı' },
        { status: 400 }
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Ödeme işlemi sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}

