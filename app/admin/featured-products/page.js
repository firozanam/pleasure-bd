'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

export default function AdminFeaturedProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/products')
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            setProducts(data.products)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast({
                title: "Error",
                description: "Failed to fetch products",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const toggleFeatured = async (productId, isFeatured) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !isFeatured }),
            })
            if (!res.ok) throw new Error('Failed to update product')
            await fetchProducts()
            toast({
                title: "Success",
                description: `Product ${isFeatured ? 'removed from' : 'added to'} featured products`,
            })
        } catch (error) {
            console.error('Error updating product:', error)
            toast({
                title: "Error",
                description: "Failed to update product",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Manage Featured Products</h1>
            {products && products.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <Image src={product.image} alt={product.name} width={50} height={50} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>{product.featured ? 'Yes' : 'No'}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => toggleFeatured(product._id, product.featured)}
                                        variant="outline"
                                    >
                                        {product.featured ? 'Remove from Featured' : 'Add to Featured'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    )
}
