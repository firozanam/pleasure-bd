import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  console.log('Received upload request');
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = file.name;
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    const filepath = path.join(uploadDir, filename);

    console.log('Attempting to save file:', filepath);
    await writeFile(filepath, buffer);
    console.log('File saved successfully');

    return NextResponse.json({ success: true, fileUrl: `/images/${filename}` });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
