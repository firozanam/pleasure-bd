'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Eye, Copy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from "@/components/ui/toast-context"
import axios from 'axios'

export default function FileManager() {
    const { toast } = useToast()
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploadingFile, setUploadingFile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')

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
                console.error('Failed to fetch files:', await response.text())
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
        setUploadStatus('Uploading...')

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            if (response.data.success) {
                setUploadStatus('File uploaded successfully')
                console.log('File uploaded:', response.data.fileUrl)
                fetchFiles() // Refresh the file list
            } else {
                throw new Error(response.data.error || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            setUploadStatus(`Upload failed: ${error.message}`)
            toast({
                title: "Error",
                description: "An error occurred while uploading the file",
                variant: "destructive",
            })
        } finally {
            setUploadingFile(null)
        }
    }

    const handleDeleteFile = async (filename) => {
        try {
            const response = await fetch(`/api/delete?filename=${encodeURIComponent(filename)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Success",
                    description: result.message,
                });
                // Remove the file from the state regardless of whether it existed or not
                setFiles(prevFiles => prevFiles.filter(file => file !== filename));
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.error || "Failed to delete file",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the file",
                variant: "destructive",
            });
        }
    }

    const handleViewFile = (file) => {
        setSelectedFile(file)
        setIsModalOpen(true)
    }

    const handleCopyLink = (file) => {
        const url = `${window.location.origin}/images/${file}`
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Success",
                description: "Link copied to clipboard!",
            });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            toast({
                title: "Error",
                description: "Failed to copy link",
                variant: "destructive",
            });
        });
    }

    const getImageUrl = (file) => {
        // Assuming your images are stored in a public 'images' folder
        return `/images/${encodeURIComponent(file)}`
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
                    <div key={file} className="relative group bg-background rounded-lg shadow-md overflow-hidden">
                        <div className="w-full h-[150px] relative">
                            <img
                                src={getImageUrl(file)}
                                alt={file}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error(`Error loading image: ${file}`)
                                    e.target.src = '/placeholder-image.jpg' // Replace with an actual placeholder image
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex flex-col space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewFile(file)}
                                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyLink(file)}
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                                    >
                                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteFile(file)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-sm truncate p-2">{file}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="w-full h-[500px] relative mb-4">
                            <Image
                                src={getImageUrl(selectedFile)}
                                alt={selectedFile}
                                layout="fill"
                                objectFit="contain"
                                unoptimized
                            />
                        </div>
                        <p className="text-center mb-4 text-sm">{selectedFile}</p>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
