'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import AuthDialog from '@/components/AuthDialog'

export default function CheckoutPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGuest, setIsGuest] = useState(false)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const { cart, getCartTotal, clearCart } = useCart()
    const router = useRouter()
    const { toast } = useToast()
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setName(session.user.name || '')
            setEmail(session.user.email || '')
        } else if (status === 'unauthenticated') {
            setShowAuthDialog(true)
        }
    }, [status, session])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (showAuthDialog) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [showAuthDialog])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const orderData = {
                items: cart.map(item => ({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingAddress: address,
                name,
                email: email || undefined, // Only include email if it's provided
                mobile: phone,
                total: getCartTotal(),
                isGuest
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })

            if (!response.ok) {
                throw new Error('Failed to create order')
            }

            const data = await response.json()
            clearCart()
            toast({
                title: "Success",
                description: "Order placed successfully",
            })
            router.push(`/order-confirmation/${data.orderId}`)
        } catch (error) {
            console.error('Error placing order:', error)
            toast({
                title: "Error",
                description: "Failed to place order",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGuestCheckout = () => {
        setIsGuest(true)
        setShowAuthDialog(false)
    }

    if (cart.length === 0) {
        return <div className="text-center py-10">Your cart is empty</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            {showAuthDialog && (
                <AuthDialog
                    onClose={() => setShowAuthDialog(false)}
                    onGuestCheckout={handleGuestCheckout}
                />
            )}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
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
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                    </form>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-4">
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{formatCurrency(getCartTotal())}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}