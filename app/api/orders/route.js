import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { name, address, mobile, items, total } = await req.json();

        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.id);
            return {
                product: item.id,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                image: product.image // Include the product image URL
            };
        }));

        const order = new Order({
            user: session?.user?.id,
            name,
            address,
            mobile,
            items: itemsWithDetails,
            total
        });

        await order.save();

        return NextResponse.json({ message: 'Order created successfully', orderId: order._id });
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
