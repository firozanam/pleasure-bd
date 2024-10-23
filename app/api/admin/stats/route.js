import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const db = await getDatabase()

        // Fetch total users
        const totalUsers = await db.collection('users').countDocuments()

        // Fetch total products
        const totalProducts = await db.collection('products').countDocuments()

        // Fetch total orders
        const totalOrders = await db.collection('orders').countDocuments()

        // Fetch total revenue
        const revenueResult = await db.collection('orders').aggregate([
            { $match: { status: { $nin: ['cancelled', 'pending'] } } },
            { $group: { _id: null, total: { $sum: { $toDouble: '$total' } } } }
        ]).toArray()

        console.log('Revenue calculation result:', revenueResult);

        // Log all orders for debugging
        const allOrders = await db.collection('orders').find({}).toArray()
        console.log('All orders:', allOrders);

        const totalRevenue = revenueResult[0]?.total || 0

        console.log('Total revenue:', totalRevenue);

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: parseFloat(totalRevenue.toFixed(2))
        })
    } catch (error) {
        console.error('Failed to fetch admin stats:', error)
        return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
    }
}
