import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req) {
    try {
        await dbConnect();

        const result = await Product.updateMany(
            { image: '/placeholder.jpg' },
            { ৳set: { image: '/images/placeholder.png' } }
        );

        return NextResponse.json({ message: 'Updated legacy image paths', modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Failed to update legacy image paths:', error);
        return NextResponse.json({ error: 'Failed to update legacy image paths' }, { status: 500 });
    }
}
