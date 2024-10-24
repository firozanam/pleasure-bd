import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);
        const { name, address, mobile, items, total } = await request.json();

        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const product = await db.collection('products').findOne({ _id: new ObjectId(item.id) });
            return {
                product: item.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.image
            };
        }));

        const order = {
            user: session?.user?.id,
            name,
            address,
            mobile,
            items: itemsWithDetails,
            total,
            createdAt: new Date()
        };

        const result = await db.collection('orders').insertOne(order);

        return NextResponse.json({ message: 'Order created successfully', orderId: result.insertedId });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const orders = await db.collection('orders')
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
