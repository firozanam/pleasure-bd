import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request, { params }) {
    const db = await getDatabase();
    const { id } = params;

    try {
        const product = await db.collection('products').findOne(
            { _id: new ObjectId(id) },
            { projection: { reviews: 1, name: 1, price: 1, description: 1, category: 1, stock: 1, image: 1 } }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Ensure reviews is always an array
        product.reviews = Array.isArray(product.reviews) ? product.reviews : [];

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

        const { id } = params;
        const db = await getDatabase();
        const collection = db.collection('products');

        const formData = await request.formData();
        const updatedProduct = Object.fromEntries(formData.entries());

        // Convert price to number
        if (updatedProduct.price) {
            updatedProduct.price = parseFloat(updatedProduct.price);
        }

        // Convert stock to number
        if (updatedProduct.stock) {
            updatedProduct.stock = parseInt(updatedProduct.stock, 10);
        }

        // Handle image upload if a new image is provided
        if (formData.get('image') && formData.get('image').size > 0) {
            const file = formData.get('image');
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate a unique filename
            const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', uniqueFilename);

            // Save the file
            await writeFile(imagePath, buffer);
            updatedProduct.image = `/images/${uniqueFilename}`;
        } else {
            // If no new image is provided, remove the image field to keep the existing image
            delete updatedProduct.image;
        }

        // Remove the _id field from the update operation
        delete updatedProduct._id;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedProduct }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
