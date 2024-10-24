'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast-context"
import Image from 'next/image'

export default function EditProduct({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch product')
                }
                const data = await response.json()
                setProduct(data.product)
                setImagePreview(data.product.image)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            for (const key in product) {
                if (key !== '_id' && key !== 'image') {
                    if (key === 'price') {
                        formData.append(key, parseFloat(product[key]))
                    } else {
                        formData.append(key, product[key])
                    }
                }
            }
            if (image) {
                formData.append('image', image)
            }

            const response = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to update product')
            }

            toast({
                title: "Success",
                description: "Product updated successfully",
            })
            router.push('/admin/products')
        } catch (err) {
            setError(err.message)
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!product) return <div>Product not found</div>

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input type="text" id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <Input 
                        type="number" 
                        id="price" 
                        name="price" 
                        value={product.price} 
                        onChange={handleChange} 
                        step="0.01" 
                        min="0" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Textarea id="description" name="description" value={product.description} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <Select name="category" value={product.category} onValueChange={(value) => handleChange({ target: { name: 'category', value } })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Magic Condom">Magic Condom</SelectItem>
                            <SelectItem value="Dradon Condom">Dradon Condom</SelectItem>
                            <SelectItem value="Lock Love Condom">Lock Love Condom</SelectItem>
                            <SelectItem value="Love Toy Condom">Love Toy Condom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                    <Input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} min="0" required />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <Image
                                src={imagePreview}
                                alt="Product preview"
                                width={100}
                                height={100}
                                className="object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </div>
    )
}
