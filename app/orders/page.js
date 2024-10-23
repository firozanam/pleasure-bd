'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchOrders()
        }
    }, [status, router])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            if (!res.ok) throw new Error('Failed to fetch orders')
            const data = await res.json()
            if (Array.isArray(data.orders)) {
                setOrders(data.orders)
            } else {
                throw new Error('Invalid data format: expected an array')
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast({
                title: "Error",
                description: "Failed to load orders. Please try again later.",
                variant: "destructive",
            })
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>
                <p className="text-xl text-center">You haven't placed any orders yet.</p>
                <div className="text-center mt-4">
                    <Button onClick={() => router.push('/')}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            <div className="space-y-8">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Order #{order._id.substring(0, 8)}</h2>
                            <span className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Status: <span className="capitalize">{order.status}</span></p>
                            <p>Total: {formatCurrency(order.total)}</p>
                        </div>
                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-2">Items:</h3>
                            <ul className="space-y-2">
                                {order.items.map((item, index) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
