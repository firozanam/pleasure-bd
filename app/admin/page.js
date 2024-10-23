'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast-context"
import { Loader2 } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/admin/stats')
                if (!res.ok) throw new Error('Failed to fetch admin stats')
                const data = await res.json()
                setStats(data)
                console.log('Fetched stats:', data); // Add this line for debugging
            } catch (error) {
                console.error('Error fetching admin stats:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch admin stats",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [toast])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Admin Dashboard</h1>
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Users</h2>
                        <p className="text-2xl">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Products</h2>
                        <p className="text-2xl">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Orders</h2>
                        <p className="text-2xl">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">Total Revenue</h2>
                        <p className="text-2xl">
                            ৳{typeof stats.totalRevenue === 'number' 
                                ? stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : '0.00'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
