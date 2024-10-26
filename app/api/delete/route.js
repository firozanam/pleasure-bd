import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'images', filename);

  try {
    await fs.promises.unlink(filePath);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`File not found, but continuing: ${filename}`);
      return NextResponse.json({ message: 'File does not exist or was already deleted' });
    }
    console.error('Error deleting file:', err);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}
