import { listBlobFiles } from '@/lib/blobStorage';
import FileManagerClient from './FileManagerClient';

export default async function FileManager() {
    // Fetch initial files from Vercel Blob
    const blobFiles = await listBlobFiles();
    
    // Fetch local files
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/files`;
    
    const response = await fetch(apiUrl, { cache: 'no-store' });
    const data = await response.json();
    
    // Combine and deduplicate files
    const allFiles = [
        ...blobFiles,
        ...data.files.map(file => typeof file === 'string' ? { name: file, url: `/images/${file}` } : file)
    ];
    const uniqueFiles = Array.from(new Set(allFiles.map(f => f.name || f.pathname)))
        .map(name => allFiles.find(f => (f.name || f.pathname) === name));

    return <FileManagerClient initialFiles={uniqueFiles} />;
}
