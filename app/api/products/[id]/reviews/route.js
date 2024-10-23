import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { rating, comment } = await req.json()

        await dbConnect()
        const product = await Product.findById(params.id)
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        product.reviews.push({
            user: session.user.id,
            rating,
            comment,
        })

        await product.save()

        return NextResponse.json({ message: 'Review added successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}