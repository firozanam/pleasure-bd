'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/toast-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'

export default function EditProductPage({ params }) {
    const [product, setProduct] = useState(null)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        fetchProduct()
    }, [])

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${params.id}`)
            if (!res.ok) throw new Error('Failed to fetch product')
            const data = await res.json()
            setProduct(data)
            setName(data.name)
            setPrice(data.price)
            setDescription(data.description)
            setCategory(data.category)
            setStock(data.stock)
        } catch (error) {
            console.error('Error fetching product:', error)
            toast({
                title: "Error",
                description: "Failed to fetch product",
                variant: "destructive",
            })
        }
    }

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
            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                body: formData,
            })

            if (!res.ok) {
                throw new Error('Failed to update product')
            }

            toast({
                title: "Success",
                description: "Product updated successfully",
            })
            router.push('/admin/products')
        } catch (error) {
            console.error('Error updating product:', error)
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (!product) return <div>Loading...</div>

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Edit Product</h1>
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
                    />
                </div>
                {product.image && (
                    <div>
                        <Label>Current Image</Label>
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="mt-2"
                        />
                    </div>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </div>
    )
}
