'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast-context"
import { Loader2, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('7d')
    const [orderTrend, setOrderTrend] = useState([])
    const [revenueTrend, setRevenueTrend] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const { toast } = useToast()

    useEffect(() => {
        fetchStats()
    }, [timeRange])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/stats?timeRange=${timeRange}`)
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to fetch admin stats')
            }
            const data = await res.json()
            setStats(data)
            setOrderTrend(data.orderTrend || [])
            setRevenueTrend(data.revenueTrend || [])
            setTopProducts(data.topProducts || [])
            console.log('Fetched stats:', data)
        } catch (error) {
            console.error('Error fetching admin stats:', error)
            toast({
                title: "Error",
                description: error.message || "Failed to fetch admin stats",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const StatCard = ({ title, value, icon, trend }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {trend && (
                    <p className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? <TrendingUp className="inline mr-1" /> : <TrendingDown className="inline mr-1" />}
                        {Math.abs(trend)}% from last period
                    </p>
                )}
            </CardContent>
        </Card>
    )

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
            
            <div className="flex justify-between items-center mb-5">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                </Select>
                <Button onClick={fetchStats} disabled={loading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard 
                            title="Total Users" 
                            value={stats.totalUsers} 
                            icon={<Users className="h-4 w-4 text-muted-foreground" />}
                            trend={stats.userGrowth}
                        />
                        <StatCard 
                            title="Total Products" 
                            value={stats.totalProducts} 
                            icon={<Package className="h-4 w-4 text-muted-foreground" />}
                            trend={stats.productGrowth}
                        />
                        <StatCard 
                            title="Total Orders" 
                            value={stats.totalOrders} 
                            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                            trend={stats.orderGrowth}
                        />
                        <StatCard 
                            title="Total Revenue" 
                            value={formatCurrency(stats.totalRevenue)} 
                            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                            trend={stats.revenueGrowth}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={orderTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="orders" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Top Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {topProducts && topProducts.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={topProducts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="sales" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>No top selling products data available. This could be due to no orders in the selected time range or an issue with data processing. Please check the server logs for more information.</p>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
