import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    try {
        const db = await getDatabase();
        const product = await db.collection('products').findOne({ _id: new ObjectId(params.id) });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const body = await request.json();

        // Validate the incoming data
        if (!body.name || body.price === undefined || !body.description || !body.category || body.stock === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure price and stock are numbers
        const price = parseFloat(body.price);
        const stock = parseInt(body.stock, 10);

        if (isNaN(price) || isNaN(stock)) {
            return NextResponse.json({ error: 'Invalid price or stock value' }, { status: 400 });
        }

        const updatedProduct = {
            name: body.name,
            price: price,
            description: body.description,
            category: body.category,
            stock: stock,
            image: body.image // Assuming image URL is optional
        };

        const result = await db.collection('products').findOneAndUpdate(
            { _id: new ObjectId(params.id) },
            { $set: updatedProduct },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully', product: result.value });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    const db = await getDatabase();
    try {
        const { rating, comment, name } = await req.json();
        
        const product = await db.collection('products').findOne({ _id: new ObjectId(params.id) });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const newReview = {
            rating,
            comment,
            name,
            createdAt: new Date()
        };

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(params.id) },
            { 
                $push: { reviews: newReview },
                $set: { 
                    avgRating: (product.avgRating * product.reviews.length + rating) / (product.reviews.length + 1)
                }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Failed to add review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}
