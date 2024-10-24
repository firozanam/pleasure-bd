import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const validateImageUrl = (url) => {
    return url.startsWith('/') || url.match(/^https?:\/\/.+/);
};

export async function GET() {
    try {
        const db = await getDatabase();
        const settings = await db.collection('settings').findOne({ key: 'homePageSettings' });
        return NextResponse.json(settings || {
            featuredProductId: null,
            featuredProductIds: [],
            videoUrl: 'https://www.youtube.com/embed/P2gW89OxtJY?si=vw-kbKkYT2MSjon8',
            heroHeading: '100% সিলিকনের তৈরি অরিজিনাল ম্যাজিক কনডম',
            heroParagraph: 'যৌন দুর্বলতা থেকে মুক্তি পেতে এবং দীর্ঘক্ষণ সঙ্গম করতে পারবেন, ৩০-৪০ মিনিট পর্যন্ত সঙ্গম করতে পারবেন।',
            heroImage: '/images/hero-bg.jpg'
        });
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

        const { featuredProductId, featuredProductIds, videoUrl, heroHeading, heroParagraph, heroImage } = await request.json();
        
        if (heroImage && !validateImageUrl(heroImage)) {
            return NextResponse.json({ error: 'Invalid hero image URL' }, { status: 400 });
        }

        const db = await getDatabase();

        const result = await db.collection('settings').findOneAndUpdate(
            { key: 'homePageSettings' },
            { $set: { featuredProductId, featuredProductIds, videoUrl, heroHeading, heroParagraph, heroImage } },
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
