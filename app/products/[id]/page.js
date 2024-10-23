'use client'

import Image from 'next/image'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'
import ReviewForm from '@/components/ReviewForm'
import Reviews from '@/components/Reviews'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast-context'
import { Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ProductPage({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState(false)
    const { toast } = useToast()
    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch product')
                }
                const data = await res.json()
                setProduct(data.product)
            } catch (error) {
                console.error('Error fetching product:', error)
                toast({
                    title: "Error",
                    description: "Failed to load product details",
                    variant: "destructive",
                })
                notFound()
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [params.id, toast])

    const handleAddToCart = async () => {
        if (!product) return

        setAddingToCart(true)
        try {
            await addToCart(product)
            toast({
                title: "Success",
                description: "Product added to cart",
            })
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast({
                title: "Error",
                description: "Failed to add product to cart",
                variant: "destructive",
            })
        } finally {
            setAddingToCart(false)
        }
    }

    const handleReviewAdded = (newReview) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            reviews: [...prevProduct.reviews, newReview]
        }))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!product) {
        return notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={500} 
                        height={500} 
                        className="rounded-lg object-cover w-full h-auto"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-xl mb-4">{formatCurrency(product.price)}</p>
                    <p className="mb-4">{product.description}</p>
                    <p className="mb-4">Category: {product.category}</p>
                    <p className="mb-4">In Stock: {product.stock}</p>
                    <Button
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.stock <= 0}
                        className="w-full md:w-auto"
                    >
                        {addingToCart ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding to Cart...
                            </>
                        ) : product.stock <= 0 ? (
                            'Out of Stock'
                        ) : (
                            'Add to Cart'
                        )}
                    </Button>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                <Reviews productId={product._id} initialReviews={product.reviews} />
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                    <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
                </div>
            </div>
        </div>
    )
}
