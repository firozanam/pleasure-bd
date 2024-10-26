import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadToBlob } from '@/lib/blobStorage';

export async function GET() {
    const db = await getDatabase();

    try {
        const products = await db.collection('products').find({}).toArray();
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const formData = await request.formData();
        const name = formData.get('name');
        const price = formData.get('price');
        const description = formData.get('description');
        const category = formData.get('category');
        const stock = formData.get('stock');
        const image = formData.get('image');

        // Validate the incoming data
        if (!name || !price || !description || !category || !stock) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure price and stock are numbers
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);

        if (isNaN(parsedPrice) || isNaN(parsedStock)) {
            return NextResponse.json({ error: 'Invalid price or stock value' }, { status: 400 });
        }

        let imageUrl = '';
        if (image) {
            imageUrl = await uploadToBlob(image);
        }

        const newProduct = {
            name,
            price: parsedPrice,
            description,
            category,
            stock: parsedStock,
            image: imageUrl,
            reviews: [],
            avgRating: 0
        };

        const result = await db.collection('products').insertOne(newProduct);

        return NextResponse.json({ message: 'Product created successfully', productId: result.insertedId });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const formData = await request.formData();
        const id = formData.get('id');
        const name = formData.get('name');
        const price = formData.get('price');
        const description = formData.get('description');
        const category = formData.get('category');
        const stock = formData.get('stock');
        const image = formData.get('image');

        const updateData = {
            name,
            price: parseFloat(price),
            description,
            category,
            stock: parseInt(stock, 10)
        };

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uniqueFilename = `${uuidv4()}${path.extname(image.name)}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', uniqueFilename);

            await writeFile(imagePath, buffer);
            updateData.image = `/images/${uniqueFilename}`;
        }

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDatabase();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
