import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { useToast } from "@/components/ui/toast-context"

// Add the StatusBadge component here as well
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

export default function OrderDetailsModal({ order, isOpen, onClose, isAdmin = false, onStatusUpdate }) {
    const [status, setStatus] = useState(order?.status || '')
    const { toast } = useToast()

    if (!order) return null

    const updateOrderStatus = async (newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id, status: newStatus }),
            })
            if (!res.ok) throw new Error('Failed to update order status')
            setStatus(newStatus)
            onStatusUpdate(order._id, newStatus)
            toast({
                title: "Success",
                description: "Order status updated successfully",
            })
        } catch (error) {
            console.error('Error updating order status:', error)
            toast({
                title: "Error",
                description: "Failed to update order status",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Order Details</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-gray-700">
                    <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                    <p><span className="font-semibold">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><span className="font-semibold">Total:</span> {formatCurrency(order.total)}</p>
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">Status:</span>
                        {isAdmin ? (
                            <Select value={status} onValueChange={updateOrderStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select status">
                                        <StatusBadge status={status} />
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <StatusBadge status={status} />
                        )}
                    </div>
                    
                    <h3 className="font-bold text-lg mt-4 mb-2 text-gray-900">Shipping Details:</h3>
                    <p><span className="font-semibold">Name:</span> {order.name}</p>
                    <p><span className="font-semibold">Address:</span> {order.address}</p>
                    <p><span className="font-semibold">Mobile:</span> {order.mobile}</p>
                    
                    {isAdmin && order.user && (
                        <>
                            <h3 className="font-bold text-lg mt-4 mb-2 text-gray-900">Customer Details:</h3>
                            <p><span className="font-semibold">Customer ID:</span> {order.user._id}</p>
                            <p><span className="font-semibold">Name:</span> {order.user.name}</p>
                            <p><span className="font-semibold">Email:</span> {order.user.email}</p>
                        </>
                    )}
                    
                    <h3 className="font-bold text-lg mt-4 mb-2 text-gray-900">Items:</h3>
                    <ul className="space-y-2">
                        {order.items.map((item, index) => (
                            <li key={index} className="flex items-center">
                                <Image
                                    src={item.image || '/images/placeholder.png'}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    className="mr-2 rounded"
                                />
                                <span className="flex-grow">
                                    <span className="font-semibold">{item.name}</span><br />
                                    Quantity: {item.quantity} - Price: {formatCurrency(item.price)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </DialogDescription>
                <Button onClick={onClose} className="mt-4 w-full">Close</Button>
            </DialogContent>
        </Dialog>
    )
}
