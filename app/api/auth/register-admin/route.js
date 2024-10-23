import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password, adminCode } = await req.json();

        // Check if the admin code is correct
        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return NextResponse.json({ error: 'Invalid admin code' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, isAdmin: true });
        await newUser.save();

        return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
