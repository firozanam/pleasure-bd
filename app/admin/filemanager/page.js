'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Eye, Copy } from 'lucide-react'

export default function FileManager() {
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploadingFile, setUploadingFile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/admin/files')
            if (response.ok) {
                const data = await response.json()
                setFiles(data)
            } else {
                console.error('Failed to fetch files')
            }
        } catch (error) {
            console.error('Error fetching files:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setUploadingFile(file.name)

        try {
            const response = await fetch('/api/admin/files/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                await fetchFiles()
            } else {
                console.error('Failed to upload file')
            }
        } catch (error) {
            console.error('Error uploading file:', error)
        } finally {
            setUploadingFile(null)
        }
    }

    const handleDeleteFile = async (filename) => {
        try {
            const response = await fetch(`/api/admin/files/${encodeURIComponent(filename)}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                await fetchFiles()
            } else {
                console.error('Failed to delete file')
            }
        } catch (error) {
            console.error('Error deleting file:', error)
        }
    }

    const handleViewFile = (file) => {
        setSelectedFile(file)
        setIsModalOpen(true)
    }

    const handleCopyLink = (file) => {
        const url = `${window.location.origin}/images/${file}`
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">File Manager</h1>
            <div className="mb-4">
                <Input type="file" onChange={handleFileUpload} accept="image/*" />
                {uploadingFile && <p className="mt-2">Uploading: {uploadingFile}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => (
                    <div key={file} className="relative group">
                        <Image
                            src={`/images/${file}`}
                            alt={file}
                            width={100}
                            height={100}
                            className="object-cover w-full h-48"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewFile(file)}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                            >
                                <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyLink(file)}
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                                <Copy className="h-4 w-4 mr-1" /> Copy Link
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteFile(file)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                        </div>
                        <p className="mt-2 text-sm truncate">{file}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-background p-4 rounded shadow-lg">
                        <Image
                            src={`/images/${selectedFile}`}
                            alt={selectedFile}
                            width={400}
                            height={400}
                            className="object-cover"
                        />
                        <Button
                            variant="outline"
                            className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
