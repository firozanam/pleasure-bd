'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/toast-context"
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import OrderDetailsModal from '@/components/OrderDetailsModal'

// Add this new component for status badges
const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    )
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders')
            if (!res.ok) throw new Error('Failed to fetch orders')
            const data = await res.json()
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast({
                title: "Error",
                description: "Failed to fetch orders",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const openOrderDetails = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(orders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
        ))
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{order.name || 'Guest'}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="relative w-12 h-12">
                                            <Image
                                                src={item.image || '/images/placeholder.png'}
                                                alt={item.name || 'Product'}
                                                width={48}
                                                height={48}
                                                className="rounded object-cover"
                                            />
                                            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                {item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>৳{(order.total || 0).toFixed(2)}</TableCell>
                            <TableCell>
                                <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                                <Button 
                                    onClick={() => openOrderDetails(order)} 
                                    variant="outline"
                                    size="sm"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                isAdmin={true}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    )
}