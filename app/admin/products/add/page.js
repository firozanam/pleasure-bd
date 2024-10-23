'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/toast-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AddProductPage() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('stock', stock)
        if (image) {
            formData.append('image', image)
        }

        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                throw new Error('Failed to add product')
            }

            toast({
                title: "Success",
                description: "Product added successfully",
            })
            router.push('/admin/products')
        } catch (error) {
            console.error('Error adding product:', error)
            toast({
                title: "Error",
                description: "Failed to add product",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </Button>
            </form>
        </div>
    )
}
