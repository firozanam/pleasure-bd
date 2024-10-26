import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import Product from '@/models/Product'
import Order from '@/models/Order'

export async function GET(request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const timeRange = searchParams.get('timeRange') || '7d'

        const { startDate, endDate } = getDateRange(timeRange)

        console.log('Fetching stats for date range:', { startDate, endDate })

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            userGrowth,
            productGrowth,
            orderGrowth,
            revenueGrowth,
            orderTrend,
            revenueTrend,
            topProducts
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
            calculateGrowth(User, startDate, endDate),
            calculateGrowth(Product, startDate, endDate),
            calculateGrowth(Order, startDate, endDate),
            calculateRevenueGrowth(startDate, endDate),
            getOrderTrend(startDate, endDate),
            getRevenueTrend(startDate, endDate),
            getTopProducts(startDate, endDate)
        ])

        console.log('Stats fetched successfully')
        console.log('Total Users:', totalUsers)
        console.log('Total Products:', totalProducts)
        console.log('Total Orders:', totalOrders)
        console.log('Total Revenue:', totalRevenue)
        console.log('Top Products:', topProducts)

        const response = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            userGrowth,
            productGrowth,
            orderGrowth,
            revenueGrowth,
            orderTrend,
            revenueTrend,
            topProducts
        }

        console.log('Full response:', JSON.stringify(response, null, 2))

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function getDateRange(timeRange) {
    const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 7
    const endDate = new Date()
    const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000)
    return { startDate, endDate }
}

async function calculateGrowth(Model, startDate, endDate) {
    const currentCount = await Model.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
    const previousStartDate = new Date(startDate - (endDate - startDate))
    const previousCount = await Model.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } })
    return previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100
}

async function calculateRevenueGrowth(startDate, endDate) {
    const currentRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const previousStartDate = new Date(startDate - (endDate - startDate))
    const previousRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lt: startDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const current = currentRevenue[0]?.total || 0
    const previous = previousRevenue[0]?.total || 0
    return previous === 0 ? 100 : ((current - previous) / previous) * 100
}

async function getOrderTrend(startDate, endDate) {
    const orders = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ])
    return orders.map(item => ({ date: item._id, orders: item.orders }))
}

async function getRevenueTrend(startDate, endDate) {
    const revenue = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } }
    ])
    return revenue.map(item => ({ date: item._id, revenue: item.revenue }))
}

async function getTopProducts(startDate, endDate) {
    try {
        console.log('Fetching top products for date range:', { startDate, endDate })
        
        const ordersInRange = await Order.find({ createdAt: { $gte: startDate, $lte: endDate } })
        console.log('Orders in range:', ordersInRange.length)

        if (ordersInRange.length === 0) {
            console.log('No orders found in the specified date range')
            return []
        }

        // Log a sample order to check its structure
        if (ordersInRange.length > 0) {
            console.log('Sample order:', JSON.stringify(ordersInRange[0], null, 2))
        }

        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $unwind: '$items' },
            { 
                $group: { 
                    _id: '$items.productId', 
                    name: { $first: '$items.name' },
                    sales: { $sum: '$items.quantity' } 
                } 
            },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            { $project: { name: 1, sales: 1, _id: 0 } }
        ])

        console.log('Top Products (raw):', topProducts)

        if (topProducts.length === 0) {
            console.log('No top products found after aggregation')
        }

        return topProducts
    } catch (error) {
        console.error('Error fetching top products:', error)
        return []
    }
}
