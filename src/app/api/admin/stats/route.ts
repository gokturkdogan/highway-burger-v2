import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total orders
    const totalOrders = await prisma.order.count()

    // Get total revenue
    const orders = await prisma.order.findMany({
      select: { total: true },
    })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get total products
    const totalProducts = await prisma.product.count()

    // Get pending orders
    const pendingOrders = await prisma.order.count({
      where: { status: 'received' },
    })

    // Get preparing orders
    const preparingOrders = await prisma.order.count({
      where: { status: 'preparing' },
    })

    // Get on the way orders
    const onTheWayOrders = await prisma.order.count({
      where: { status: 'on_the_way' },
    })

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      pendingOrders,
      preparingOrders,
      onTheWayOrders,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

