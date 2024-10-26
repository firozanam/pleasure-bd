'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Eye, Copy } from 'lucide-react'
import { useToast } from "@/components/ui/toast-context"
import { ErrorBoundary } from 'react-error-boundary'
import { getBlobImageUrl, uploadToBlob, deleteFromBlob, listBlobFiles } from '@/lib/blobStorage';

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

export default function FileManagerClient({ initialFiles }) {
    const { toast } = useToast()
    const [files, setFiles] = useState(initialFiles)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingFile, setUploadingFile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const [error, setError] = useState(null)

    async function fetchFiles() {
        setIsLoading(true);
        try {
            const blobs = await listBlobFiles();
            setFiles(blobs);
        } catch (err) {
            console.error('Error fetching files:', err);
            setError(`Failed to fetch files: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setUploadingFile(file.name)
        setUploadStatus('Uploading...')

        try {
            const url = await uploadToBlob(file);
            setUploadStatus('File uploaded successfully')
            fetchFiles() // Refresh the file list
        } catch (error) {
            console.error('Error uploading file:', error)
            setUploadStatus(`Upload failed: ${error.message}`)
            toast({
                title: "Error",
                description: `An error occurred while uploading the file: ${error.message}`,
                variant: "destructive",
            })
        } finally {
            setUploadingFile(null)
        }
    }

    const handleDeleteFile = async (url) => {
        try {
            await deleteFromBlob(url);
            toast({
                title: "Success",
                description: "File deleted successfully",
            });
            fetchFiles(); // Refresh the file list after deletion
        } catch (error) {
            console.error('Error deleting file:', error);
            toast({
                title: "Error",
                description: error.message || "An error occurred while deleting the file",
                variant: "destructive",
            });
        }
    }

    const handleViewFile = (file) => {
        setSelectedFile(file)
        setIsModalOpen(true)
    }

    const handleCopyLink = (file) => {
        const url = getFileUrl(file)
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

    const getFileUrl = (file) => {
        return file.url;
    }

    const getImageUrl = (file) => {
        return getBlobImageUrl(file.url);
    }

    const getFileName = (file) => {
        return file.pathname.split('/').pop();
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">File Manager</h1>
                <div className="mb-4">
                    <Input type="file" onChange={handleFileUpload} accept="image/*" />
                    {uploadingFile && <p className="mt-2">Uploading: {uploadingFile}</p>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group bg-background rounded-lg shadow-md overflow-hidden">
                            <div className="w-full h-[150px] relative">
                                <Image
                                    src={getImageUrl(file)}
                                    alt={getFileName(file)}
                                    layout="fill"
                                    objectFit="cover"
                                    onError={(e) => {
                                        console.error(`Error loading image: ${getFileName(file)}`);
                                        e.target.src = '/placeholder-image.jpg';
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
                                            onClick={() => handleDeleteFile(file.url)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 text-sm truncate p-2">{getFileName(file)}</p>
                        </div>
                    ))}
                </div>

                {isModalOpen && selectedFile && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-background p-6 rounded-lg shadow-lg max-w-3xl w-full">
                            <div className="w-full h-[500px] relative mb-4">
                                <Image
                                    src={getImageUrl(selectedFile)}
                                    alt={getFileName(selectedFile)}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                            <p className="text-center mb-4 text-sm">{getFileName(selectedFile)}</p>
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
        </ErrorBoundary>
    )
}
