import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { total, status, paymentMethod } = body

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ? parseInt(session.user.id) : null,
        total: parseFloat(total),
        status: status || 'pending',
        paymentMethod: paymentMethod || null,
      },
    })

    console.log('✅ Order created:', order.id, 'Payment method:', paymentMethod)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('❌ Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Sipariş oluşturulamadı' },
      { status: 500 }
    )
  }
}

