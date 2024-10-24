import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/toast-context"
import SafeImage from './SafeImage'

export default function ProductCard({ product }) {
    const [imgSrc, setImgSrc] = useState(product.image || '/images/placeholder.png')
    const [addingToCart, setAddingToCart] = useState(false)
    const { addToCart } = useCart()
    const { toast } = useToast()

    useEffect(() => {
        if (product.image) {
            setImgSrc(product.image)
        }
    }, [product.image])

    const handleAddToCart = async () => {
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

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full">
            <div className="relative w-full pt-[100%]">
                <SafeImage
                    src={imgSrc}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    onError={() => setImgSrc('/images/placeholder.png')}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">{product.name}</h3>
                <p className="text-xl font-bold mb-4 mt-auto">{formatCurrency(product.price)}</p>
                <div className="flex justify-between items-center mt-auto">
                    <Link href={`/products/${product._id}`} className="text-blue-500 hover:underline">
                        View Details
                    </Link>
                    <Button
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.stock <= 0}
                        className="w-1/2"
                    >
                        {addingToCart ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : product.stock <= 0 ? (
                            'Out of Stock'
                        ) : (
                            'Add to Cart'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
