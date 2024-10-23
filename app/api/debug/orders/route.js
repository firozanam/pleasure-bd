import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
    try {
        const db = await getDatabase()
        const orders = await db.collection('orders').find({}).toArray()
        
        console.log('All orders:', orders)
        
        const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)
        
        return NextResponse.json({
            orderCount: orders.length,
            totalRevenue: totalRevenue,
            orders: orders
        })
    } catch (error) {
        console.error('Failed to fetch debug order info:', error)
        return NextResponse.json({ error: 'Failed to fetch debug order info' }, { status: 500 })
    }
}
