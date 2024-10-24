import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    const imagesDirectory = path.join(process.cwd(), 'public', 'images')
    const files = fs.readdirSync(imagesDirectory)
    return NextResponse.json(files)
}
