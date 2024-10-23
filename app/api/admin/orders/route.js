import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const db = await getDatabase()
        const orders = await db.collection('orders')
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        // Ensure all orders have a total field and a shippingAddress
        const ordersWithTotalAndAddress = orders.map(order => ({
            ...order,
            total: order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingAddress: order.shippingAddress || 'Address not provided'
        }))

        return NextResponse.json(ordersWithTotalAndAddress)
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const { orderId, status } = await request.json()
        const db = await getDatabase()

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Order status updated successfully' })
    } catch (error) {
        console.error('Failed to update order status:', error)
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }
}
