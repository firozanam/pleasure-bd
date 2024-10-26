'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const getProxiedImageUrl = (url) => {
  if (url.startsWith('/')) {
    return url;
  }
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};

export default function AdminHomeSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [featuredProductIds, setFeaturedProductIds] = useState([])
    const [currentProduct, setCurrentProduct] = useState(null)
    const [products, setProducts] = useState([])
    const [videoUrl, setVideoUrl] = useState('')
    const [heroHeading, setHeroHeading] = useState('')
    const [heroParagraph, setHeroParagraph] = useState('')
    const [heroImage, setHeroImage] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        fetchSettings()
        fetchProducts()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/home')
            if (!res.ok) throw new Error('Failed to fetch settings')
            const data = await res.json()
            setFeaturedProductId(data.featuredProductId || '')
            setFeaturedProductIds(data.featuredProductIds || [])
            setVideoUrl(data.videoUrl || '')
            setHeroHeading(data.heroHeading || '')
            setHeroParagraph(data.heroParagraph || '')
            setHeroImage(data.heroImage || '')
            if (data.featuredProductId) {
                fetchFeaturedProduct(data.featuredProductId)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            toast({
                title: "Error",
                description: "Failed to fetch home settings",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
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
        }
    }

    const fetchFeaturedProduct = async (id) => {
        try {
            const res = await fetch(`/api/products/${id}`)
            if (!res.ok) throw new Error('Failed to fetch featured product')
            const data = await res.json()
            setCurrentProduct(data.product)
        } catch (error) {
            console.error('Error fetching featured product:', error)
            toast({
                title: "Error",
                description: "Failed to fetch featured product",
                variant: "destructive",
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/settings/home', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featuredProductId, featuredProductIds, videoUrl, heroHeading, heroParagraph, heroImage }),
            })
            if (!res.ok) throw new Error('Failed to update settings')
            toast({
                title: "Success",
                description: "Home settings updated successfully",
            })
            fetchFeaturedProduct(featuredProductId)
        } catch (error) {
            console.error('Error updating settings:', error)
            toast({
                title: "Error",
                description: "Failed to update home settings",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFeaturedProductChange = (selectedId) => {
        if (selectedId && !featuredProductIds.includes(selectedId)) {
            if (featuredProductIds.length < 4) {
                setFeaturedProductIds([...featuredProductIds, selectedId])
            } else {
                toast({
                    title: "Warning",
                    description: "You can select a maximum of 4 featured products",
                    variant: "warning",
                })
            }
        }
    }

    const removeFeaturedProduct = (id) => {
        setFeaturedProductIds(featuredProductIds.filter(productId => productId !== id))
    }

    const validateImageUrl = (url) => {
        return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    };

    const handleHeroImageChange = (e) => {
        const url = e.target.value;
        setHeroImage(url);
        if (!validateImageUrl(url)) {
            toast({
                title: "Warning",
                description: "Please enter a valid image URL (starting with / for local images or http:// or https:// for external images)",
                variant: "warning",
            });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Home Page Settings</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Home Page Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="featuredProduct" className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Promoted Product Here
                                </label>
                                <Select
                                    value={featuredProductId}
                                    onValueChange={(value) => {
                                        setFeaturedProductId(value)
                                        fetchFeaturedProduct(value)
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product._id} value={product._id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="featuredProducts" className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Products (Select up to 4)
                                </label>
                                <Select
                                    value=""
                                    onValueChange={handleFeaturedProductChange}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Add a featured product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product._id} value={product._id}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="mt-2 space-y-2">
                                    {featuredProductIds.map((id) => {
                                        const product = products.find(p => p._id === id)
                                        return product ? (
                                            <div key={id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                                <div className="flex items-center space-x-2">
                                                    <div className="relative aspect-square rounded-sm overflow-hidden">
                                                        <Image
                                                            src={product.image || "/images/placeholder.png"}
                                                            alt={product.name}
                                                            width={50}
                                                            height={50}
                                                            objectFit="cover"
                                                            className="rounded"
                                                        />
                                                    </div>
                                                    <span>{product.name}</span>
                                                </div>
                                                <Button 
                                                    onClick={() => removeFeaturedProduct(id)}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : null
                                    })}
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Settings'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Promoted Product</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentProduct ? (
                            <div className="space-y-4">
                                <div className="relative w-1/1 aspect-square rounded-lg overflow-hidden">
                                    <Image
                                        src={getProxiedImageUrl(currentProduct.image)}
                                        alt={currentProduct.name}
                                        objectFit="cover"
                                        className="rounded-md"
                                        width={250}
                                        height={250}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold">{currentProduct.name}</h3>
                                <p className="text-sm line-clamp-4">{currentProduct.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm"><span className="font-semibold">Category:</span> {currentProduct.category || 'N/A'}</p>
                                    <p className="text-2xl font-bold">{formatCurrency(currentProduct.price)}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No main featured product selected</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section & YouTube Video</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 w-full">
                            <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    YouTube Video URL
                                </label>
                                <Input
                                    id="videoUrl"
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="Enter YouTube embed URL"
                                />
                            </div>
                            <div>
                                <label htmlFor="heroHeading" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hero Heading
                                </label>
                                <Input
                                    id="heroHeading"
                                    type="text"
                                    value={heroHeading}
                                    onChange={(e) => setHeroHeading(e.target.value)}
                                    placeholder="Enter hero heading"
                                />
                            </div>
                            <div>
                                <label htmlFor="heroParagraph" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hero Paragraph
                                </label>
                                <Textarea
                                    id="heroParagraph"
                                    value={heroParagraph}
                                    onChange={(e) => setHeroParagraph(e.target.value)}
                                    placeholder="Enter hero paragraph"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label htmlFor="heroImage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hero Image URL
                                </label>
                                <Input
                                    id="heroImage"
                                    type="text"
                                    value={heroImage}
                                    onChange={handleHeroImageChange}
                                    placeholder="Enter hero image URL (e.g., /images/hero.jpg or https://example.com/image.jpg)"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter a local image path (starting with /) or a full URL (starting with http:// or https://).
                                    For best results, use local images or images from stable hosting services.
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Settings'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
