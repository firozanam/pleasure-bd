import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        const db = await getDatabase();
        const settings = await db.collection('settings').findOne({ key: 'homePageSettings' });
        return NextResponse.json(settings || { featuredProductId: null, featuredProductIds: [] });
    } catch (error) {
        console.error('Error fetching home settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { featuredProductId, featuredProductIds } = await request.json();
        const db = await getDatabase();

        const result = await db.collection('settings').findOneAndUpdate(
            { key: 'homePageSettings' },
            { $set: { featuredProductId, featuredProductIds } },
            { upsert: true, returnDocument: 'after' }
        );

        if (!result.value) {
            console.error('Failed to update setting');
            return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Home page settings updated successfully' });
    } catch (error) {
        console.error('Error updating home settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
