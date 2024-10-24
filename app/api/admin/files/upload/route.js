import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = path.extname(file.name)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(process.cwd(), 'public', 'images', fileName)

    try {
        fs.writeFileSync(filePath, buffer)
        return NextResponse.json({ message: 'File uploaded successfully', fileName })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ error: 'Error saving file' }, { status: 500 })
    }
}
