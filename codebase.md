# .cspell.json

```json
{
    "version": "0.2",
    "language": "en",
    "words": [
        "lucide",
        "NEXTAUTH",
        "nextauth",
        "Cloudinary",
        "CLOUDINARY",
        "cloudinary",
        "hebbkx",
        "anhila",
        "clsx",
        "tailwindcss",
        "firozanam",
        "atlascode"
    ]
}



```

# .eslintrc.js

```js
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.css', '**/*.css'],
      rules: {
        'at-rule-no-unknown': null,
      },
    },
  ],
}

```

# .eslintrc.json

```json
{
  "extends": "next/core-web-vitals"
}

```

# .stylelintrc.json

```json
{
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss"
  ],
  "rules": {
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }
    ],
    "no-descending-specificity": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "custom-property-empty-line-before": null
  }
}

```

# .vscode/settings.json

```json
{
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "stylelint.validate": ["css", "scss"],
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.validate": true
}

```

# app/about/page.js

```js
'use client';

import { useEffect } from 'react';

export default function AboutPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Pleasure BD</h1>
      <p className="mb-4">
        Pleasure BD is a leading e-commerce platform dedicated to providing high-quality products to our customers. Our mission is to offer a seamless shopping experience with a wide range of products, exceptional customer service, and fast delivery.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
      <p className="mb-4">
        Founded in 2023, Pleasure BD started with a vision to revolutionize the online shopping experience in Bangladesh. We began with a small team of passionate individuals committed to bringing the best products to our customers.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Customer Satisfaction: We prioritize our customers' needs and strive to exceed their expectations.</li>
        <li>Quality Products: We offer a curated selection of products that meet our high standards of quality.</li>
        <li>Innovation: We continuously seek new ways to improve our platform and services.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
      <p className="mb-4">
        Our team is composed of dedicated professionals with diverse backgrounds in technology, marketing, and customer service. We work together to ensure that Pleasure BD remains a trusted and reliable platform for our customers.
      </p>
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions or feedback, please feel free to contact us. We are always here to help and look forward to hearing from you.
      </p>
    </div>
  );
}

```

# app/account/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, User, MapPin, CreditCard, Package, FileText, Settings, Edit, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency } from '@/lib/utils'

export default function AccountPage() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [billingAddresses, setBillingAddresses] = useState([])
    const [shippingAddresses, setShippingAddresses] = useState([])
    const [newBillingAddress, setNewBillingAddress] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    })
    const [newShippingAddress, setNewShippingAddress] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    })
    const [showNewBillingForm, setShowNewBillingForm] = useState(false)
    const [showNewShippingForm, setShowNewShippingForm] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [orders, setOrders] = useState([])
    const { data: session, status } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            if (status !== 'authenticated' || !session?.user) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/user')
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                setUserData(data)
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                })
                setBillingAddresses(data.billingAddresses || [])
                setShippingAddresses(data.shippingAddresses || [])
            } catch (error) {
                console.error('Error fetching user data:', error)
                toast({
                    title: "Error",
                    description: `Failed to load user data: ${error.message}`,
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        const fetchOrders = async () => {
            if (status !== 'authenticated' || !session?.user) {
                return
            }

            try {
                const response = await fetch('/api/orders')
                if (!response.ok) {
                    throw new Error('Failed to fetch orders')
                }
                const data = await response.json()
                setOrders(data.orders)
            } catch (error) {
                console.error('Error fetching orders:', error)
                toast({
                    title: "Error",
                    description: "Failed to load orders",
                    variant: "destructive",
                })
            }
        }

        fetchUserData()
        fetchOrders()
    }, [status, session, toast])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleBillingAddressChange = (e) => {
        const { name, value } = e.target
        setNewBillingAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleShippingAddressChange = (e) => {
        const { name, value } = e.target
        setNewShippingAddress(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update profile')
            }
            const updatedData = await response.json()
            setUserData(updatedData)
            setEditMode(false)
            toast({
                title: "Success",
                description: "Profile updated successfully",
            })
        } catch (error) {
            console.error('Error updating profile:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAddBillingAddress = async (e) => {
        e.preventDefault()
        const updatedBillingAddresses = [...billingAddresses, newBillingAddress]
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, billingAddresses: updatedBillingAddresses })
            })
            if (!response.ok) {
                throw new Error('Failed to add billing address')
            }
            const updatedData = await response.json()
            setBillingAddresses(updatedData.billingAddresses)
            setNewBillingAddress({ name: '', email: '', address: '', phone: '' })
            setShowNewBillingForm(false)
            toast({
                title: "Success",
                description: "Billing address added successfully",
            })
        } catch (error) {
            console.error('Error adding billing address:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const handleAddShippingAddress = async (e) => {
        e.preventDefault()
        const updatedShippingAddresses = [...shippingAddresses, newShippingAddress]
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, shippingAddresses: updatedShippingAddresses })
            })
            if (!response.ok) {
                throw new Error('Failed to add shipping address')
            }
            const updatedData = await response.json()
            setShippingAddresses(updatedData.shippingAddresses)
            setNewShippingAddress({ name: '', email: '', address: '', phone: '' })
            setShowNewShippingForm(false)
            toast({
                title: "Success",
                description: "Shipping address added successfully",
            })
        } catch (error) {
            console.error('Error adding shipping address:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const handleRemoveAddress = async (type, index) => {
        const updatedAddresses = type === 'billing' 
            ? billingAddresses.filter((_, i) => i !== index)
            : shippingAddresses.filter((_, i) => i !== index)
        
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...userData, 
                    [type === 'billing' ? 'billingAddresses' : 'shippingAddresses']: updatedAddresses 
                })
            })
            if (!response.ok) {
                throw new Error(`Failed to remove ${type} address`)
            }
            const updatedData = await response.json()
            if (type === 'billing') {
                setBillingAddresses(updatedData.billingAddresses)
            } else {
                setShippingAddresses(updatedData.shippingAddresses)
            }
            toast({
                title: "Success",
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} address removed successfully`,
            })
        } catch (error) {
            console.error(`Error removing ${type} address:`, error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const handleEditAddress = (type, address, index) => {
        setEditingAddress({ type, address, index })
    }

    const handleUpdateAddress = async (e) => {
        e.preventDefault()
        const { type, address, index } = editingAddress
        const updatedAddresses = type === 'billing'
            ? billingAddresses.map((addr, i) => i === index ? address : addr)
            : shippingAddresses.map((addr, i) => i === index ? address : addr)

        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...userData,
                    [type === 'billing' ? 'billingAddresses' : 'shippingAddresses']: updatedAddresses
                })
            })
            if (!response.ok) {
                throw new Error(`Failed to update ${type} address`)
            }
            const updatedData = await response.json()
            if (type === 'billing') {
                setBillingAddresses(updatedData.billingAddresses)
            } else {
                setShippingAddresses(updatedData.shippingAddresses)
            }
            setEditingAddress(null)
            toast({
                title: "Success",
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} address updated successfully`,
            })
        } catch (error) {
            console.error(`Error updating ${type} address:`, error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const renderAddressCard = (address, type, index) => (
        <Card key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
            <CardContent className="p-4">
                <div className="text-sm">
                    <p className="font-semibold">{address.name}</p>
                    <p className="text-gray-600 truncate">{address.email}</p>
                    <p className="text-gray-600 truncate">{address.address}</p>
                    <p className="text-gray-600">{address.phone}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditAddress(type, address, index)}>
                        <Edit className="h-3 w-3" />
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Address Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                                <p><strong>Name:</strong> {address.name}</p>
                                <p><strong>Email:</strong> {address.email}</p>
                                <p><strong>Address:</strong> {address.address}</p>
                                <p><strong>Phone:</strong> {address.phone}</p>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveAddress(type, index)}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )

    // Add this function to handle navigation to /orders
    const handleViewAllOrders = () => {
        router.push('/orders')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return <div>Please log in to view your account information.</div>
    }

    if (!userData) {
        return <div>No user data available. Please try refreshing the page.</div>
    }

    const totalSpent = orders.reduce((total, order) => total + order.total, 0)
    const recentOrders = orders.slice(0, 5)

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile"><User className="mr-2" /> Profile</TabsTrigger>
                    <TabsTrigger value="addresses"><MapPin className="mr-2" /> Addresses</TabsTrigger>
                    <TabsTrigger value="orders"><Package className="mr-2" /> Orders</TabsTrigger>
                    <TabsTrigger value="billing"><CreditCard className="mr-2" /> Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {editMode ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Leave blank to keep current password"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Update Profile'
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <p><strong>Name:</strong> {userData.name}</p>
                                    <p><strong>Email:</strong> {userData.email}</p>
                                    <Button onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="addresses">
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Addresses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {billingAddresses.map((address, index) => renderAddressCard(address, 'billing', index))}
                                </div>
                                {!showNewBillingForm && (
                                    <Button onClick={() => setShowNewBillingForm(true)} className="mt-4">
                                        Add New Billing Address
                                    </Button>
                                )}
                                {showNewBillingForm && (
                                    <form onSubmit={handleAddBillingAddress} className="mt-4 space-y-4">
                                        <h3 className="text-lg font-semibold">Add New Billing Address</h3>
                                        <div>
                                            <label htmlFor="billing-name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <Input
                                                id="billing-name"
                                                name="name"
                                                value={newBillingAddress.name}
                                                onChange={handleBillingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billing-email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                                            <Input
                                                id="billing-email"
                                                name="email"
                                                type="email"
                                                value={newBillingAddress.email}
                                                onChange={handleBillingAddressChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billing-address" className="block text-sm font-medium text-gray-700">Billing Address</label>
                                            <Textarea
                                                id="billing-address"
                                                name="address"
                                                value={newBillingAddress.address}
                                                onChange={handleBillingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="billing-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <Input
                                                id="billing-phone"
                                                name="phone"
                                                type="tel"
                                                value={newBillingAddress.phone}
                                                onChange={handleBillingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button type="submit">Add Billing Address</Button>
                                            <Button type="button" variant="outline" onClick={() => setShowNewBillingForm(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Addresses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    {shippingAddresses.map((address, index) => renderAddressCard(address, 'shipping', index))}
                                </div>
                                {!showNewShippingForm && (
                                    <Button onClick={() => setShowNewShippingForm(true)} className="mt-4">
                                        Add New Shipping Address
                                    </Button>
                                )}
                                {showNewShippingForm && (
                                    <form onSubmit={handleAddShippingAddress} className="mt-4 space-y-4">
                                        <h3 className="text-lg font-semibold">Add New Shipping Address</h3>
                                        <div>
                                            <label htmlFor="shipping-name" className="block text-sm font-medium text-gray-700">Name</label>
                                            <Input
                                                id="shipping-name"
                                                name="name"
                                                value={newShippingAddress.name}
                                                onChange={handleShippingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="shipping-email" className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                                            <Input
                                                id="shipping-email"
                                                name="email"
                                                type="email"
                                                value={newShippingAddress.email}
                                                onChange={handleShippingAddressChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                                            <Textarea
                                                id="shipping-address"
                                                name="address"
                                                value={newShippingAddress.address}
                                                onChange={handleShippingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                            <Input
                                                id="shipping-phone"
                                                name="phone"
                                                type="tel"
                                                value={newShippingAddress.phone}
                                                onChange={handleShippingAddressChange}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button type="submit">Add Shipping Address</Button>
                                            <Button type="button" variant="outline" onClick={() => setShowNewShippingForm(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orders.length > 0 ? (
                                    <>
                                        <ul className="space-y-4">
                                            {orders.slice(0, 5).map(order => (
                                                <li key={order._id} className="border p-4 rounded-lg">
                                                    <p><strong>Order ID:</strong> {order._id}</p>
                                                    <p><strong>Status:</strong> <StatusBadge status={order.status} /></p>
                                                    <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">Showing last 5 orders</p>
                                            <Button onClick={handleViewAllOrders}>
                                                View All Orders
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <p>No recent orders available.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p><strong>Total Orders:</strong> {orders.length}</p>
                                <p><strong>Total Spent:</strong> ৳{totalSpent.toFixed(2)}</p>
                                <p><strong>Delivered Orders:</strong> {orders.filter(order => order.status === 'Delivered').length}</p>
                                <p><strong>Pending Orders:</strong> {orders.filter(order => order.status === 'Pending').length}</p>
                                <p><strong>Canceled Orders:</strong> {orders.filter(order => order.status === 'Canceled').length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {editingAddress && (
                <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit {editingAddress.type.charAt(0).toUpperCase() + editingAddress.type.slice(1)} Address</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateAddress} className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    value={editingAddress.address.name}
                                    onChange={(e) => setEditingAddress({
                                        ...editingAddress,
                                        address: { ...editingAddress.address, name: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    value={editingAddress.address.email}
                                    onChange={(e) => setEditingAddress({
                                        ...editingAddress,
                                        address: { ...editingAddress.address, email: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">Address</label>
                                <Textarea
                                    id="edit-address"
                                    name="address"
                                    value={editingAddress.address.address}
                                    onChange={(e) => setEditingAddress({
                                        ...editingAddress,
                                        address: { ...editingAddress.address, address: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <Input
                                    id="edit-phone"
                                    name="phone"
                                    type="tel"
                                    value={editingAddress.address.phone}
                                    onChange={(e) => setEditingAddress({
                                        ...editingAddress,
                                        address: { ...editingAddress.address, phone: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="submit">Update Address</Button>
                                <Button type="button" variant="outline" onClick={() => setEditingAddress(null)}>Cancel</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

```

# app/admin-register/page.js

```js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminRegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [adminCode, setAdminCode] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/auth/register-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, adminCode }),
            })

            if (res.ok) {
                router.push('/login')
            } else {
                const data = await res.json()
                setError(data.error || 'Registration failed')
            }
        } catch (error) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Registration</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="adminCode">Admin Code</Label>
                        <Input
                            id="adminCode"
                            type="password"
                            value={adminCode}
                            onChange={(e) => setAdminCode(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                <Button type="submit" className="w-full mt-6">
                    Register as Admin
                </Button>
            </form>
        </div>
    )
}

```

# app/admin/filemanager/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Trash2, Eye, Copy } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from "@/components/ui/toast-context"

export default function FileManager() {
    const { toast } = useToast()
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploadingFile, setUploadingFile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchFiles()
    }, [])

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/admin/files')
            if (response.ok) {
                const data = await response.json()
                setFiles(data)
            } else {
                console.error('Failed to fetch files:', await response.text())
            }
        } catch (error) {
            console.error('Error fetching files:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setUploadingFile(file.name)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "File uploaded successfully",
                })
                fetchFiles() // Refresh the file list
            } else {
                toast({
                    title: "Error",
                    description: "Failed to upload file",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            toast({
                title: "Error",
                description: "An error occurred while uploading the file",
                variant: "destructive",
            })
        } finally {
            setUploadingFile(null)
        }
    }

    const handleDeleteFile = async (filename) => {
        try {
            const response = await fetch(`/api/delete?filename=${encodeURIComponent(filename)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const result = await response.json();
                toast({
                    title: "Success",
                    description: result.message,
                });
                // Remove the file from the state regardless of whether it existed or not
                setFiles(prevFiles => prevFiles.filter(file => file !== filename));
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error",
                    description: errorData.error || "Failed to delete file",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            toast({
                title: "Error",
                description: "An error occurred while deleting the file",
                variant: "destructive",
            });
        }
    }

    const handleViewFile = (file) => {
        setSelectedFile(file)
        setIsModalOpen(true)
    }

    const handleCopyLink = (file) => {
        const url = `${window.location.origin}/images/${file}`
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: "Success",
                description: "Link copied to clipboard!",
            });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
            toast({
                title: "Error",
                description: "Failed to copy link",
                variant: "destructive",
            });
        });
    }

    const getImageUrl = (file) => {
        // Assuming your images are stored in a public 'images' folder
        return `/images/${encodeURIComponent(file)}`
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">File Manager</h1>
            <div className="mb-4">
                <Input type="file" onChange={handleFileUpload} accept="image/*" />
                {uploadingFile && <p className="mt-2">Uploading: {uploadingFile}</p>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file) => (
                    <div key={file} className="relative group bg-background rounded-lg shadow-md overflow-hidden">
                        <div className="w-full h-[150px] relative">
                            <img
                                src={getImageUrl(file)}
                                alt={file}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    console.error(`Error loading image: ${file}`)
                                    e.target.src = '/placeholder-image.jpg' // Replace with an actual placeholder image
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex flex-col space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewFile(file)}
                                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full"
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> View
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyLink(file)}
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                                    >
                                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteFile(file)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <p className="mt-2 text-sm truncate p-2">{file}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="w-full h-[500px] relative mb-4">
                            <Image
                                src={getImageUrl(selectedFile)}
                                alt={selectedFile}
                                layout="fill"
                                objectFit="contain"
                                unoptimized
                            />
                        </div>
                        <p className="text-center mb-4 text-sm">{selectedFile}</p>
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

```

# app/admin/home-settings/page.js

```js
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

```

# app/admin/layout.js

```js
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { LayoutDashboard, Package, ShoppingCart, Users, FileImage, Home } from 'lucide-react'

export default function AdminLayout({ children }) {
    const pathname = usePathname()

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { name: 'Home Setting', icon: <Home size={20} />, path: '/admin/home-settings' },
        { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        { name: 'File Manager', icon: <FileImage size={20} />, path: '/admin/filemanager' },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar className="h-full">
                <Menu>
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.name}
                            icon={item.icon}
                            component={<Link href={item.path} />}
                            className={pathname === item.path ? 'bg-gray-200' : ''}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Sidebar>
            <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
    )
}

```

# app/admin/orders/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/toast-context"
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency } from '@/lib/utils'
import { ORDER_STATUSES } from '@/lib/constants'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')
    const { toast } = useToast()

    useEffect(() => {
        fetchOrders()
    }, [statusFilter])

    const fetchOrders = async () => {
        try {
            const url = statusFilter === 'all' 
                ? '/api/admin/orders' 
                : `/api/admin/orders?status=${statusFilter}`
            const res = await fetch(url)
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

    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter)

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
            <div className="mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {ORDER_STATUSES.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
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
                    {filteredOrders.map((order) => (
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
                orderStatuses={ORDER_STATUSES}
            />
        </div>
    )
}

```

# app/admin/page.js

```js
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

```

# app/admin/products/add/page.js

```js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/toast-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddProductPage() {
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('price', parseFloat(price))
        formData.append('description', description)
        formData.append('category', category)
        formData.append('stock', parseInt(stock))
        if (image) {
            formData.append('image', image)
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to add product')
            }

            toast({
                title: "Success",
                description: "Product added successfully",
            })
            router.push('/admin/products')
        } catch (error) {
            console.error('Error adding product:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Add New Product</h1>
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
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Magic Condom">Magic Condom</SelectItem>
                            <SelectItem value="Dradon Condom">Dradon Condom</SelectItem>
                            <SelectItem value="Lock Love Condom">Lock Love Condom</SelectItem>
                            <SelectItem value="Love Toy Condom">Love Toy Condom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </Button>
            </form>
        </div>
    )
}

```

# app/admin/products/edit/[id]/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast-context"
import Image from 'next/image'

export default function EditProduct({ params }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch product')
                }
                const data = await response.json()
                setProduct(data.product)
                setImagePreview(data.product.image)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            for (const key in product) {
                if (key !== '_id' && key !== 'image') {
                    if (key === 'price') {
                        formData.append(key, parseFloat(product[key]))
                    } else {
                        formData.append(key, product[key])
                    }
                }
            }
            if (image) {
                formData.append('image', image)
            }

            const response = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to update product')
            }

            toast({
                title: "Success",
                description: "Product updated successfully",
            })
            router.push('/admin/products')
        } catch (err) {
            setError(err.message)
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!product) return <div>Product not found</div>

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input type="text" id="name" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <Input 
                        type="number" 
                        id="price" 
                        name="price" 
                        value={product.price} 
                        onChange={handleChange} 
                        step="0.01" 
                        min="0" 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Textarea id="description" name="description" value={product.description} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <Select name="category" value={product.category} onValueChange={(value) => handleChange({ target: { name: 'category', value } })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Magic Condom">Magic Condom</SelectItem>
                            <SelectItem value="Dradon Condom">Dradon Condom</SelectItem>
                            <SelectItem value="Lock Love Condom">Lock Love Condom</SelectItem>
                            <SelectItem value="Love Toy Condom">Love Toy Condom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                    <Input type="number" id="stock" name="stock" value={product.stock} onChange={handleChange} min="0" required />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <Image
                                src={imagePreview}
                                alt="Product preview"
                                width={100}
                                height={100}
                                className="object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </div>
    )
}

```

# app/admin/products/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/toast-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function AdminProductsPage() {
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

    const deleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete product')
            await fetchProducts()
            toast({
                title: "Success",
                description: "Product deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting product:', error)
            toast({
                title: "Error",
                description: "Failed to delete product",
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
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <Button asChild>
                    <Link href="/admin/products/add">Add New Product</Link>
                </Button>
            </div>
            {products && products.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>
                                    <Image 
                                        src={product.image || '/images/placeholder.png'} 
                                        alt={product.name} 
                                        width={50} 
                                        height={50}
                                        className="object-cover"
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <Button asChild variant="outline" className="mr-2">
                                        <Link href={`/admin/products/edit/${product._id}`}>Edit</Link>
                                    </Button>
                                    <Button onClick={() => deleteProduct(product._id)} variant="destructive">
                                        Delete
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

```

# app/admin/users/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/toast-context"
import { Loader2, Eye, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminUsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [userToView, setUserToView] = useState(null)
    const [userToEdit, setUserToEdit] = useState(null)
    const [adminPassword, setAdminPassword] = useState('')
    const { toast } = useToast()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            if (!res.ok) throw new Error('Failed to fetch users')
            const data = await res.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleViewUser = (user) => {
        setUserToView(user)
        setViewDialogOpen(true)
    }

    const handleUpdateUser = (user) => {
        setUserToEdit({ ...user })
        setEditDialogOpen(true)
    }

    const handleDeleteUser = (user) => {
        setUserToDelete(user)
        setDeleteDialogOpen(true)
    }

    const confirmDeleteUser = async () => {
        if (!userToDelete) return

        try {
            const res = await fetch(`/api/admin/users/${userToDelete._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminPassword: userToDelete.isAdmin ? adminPassword : undefined }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to delete user')
            }

            setUsers(users.filter(user => user._id !== userToDelete._id))
            toast({
                title: "Success",
                description: "User deleted successfully",
            })
        } catch (error) {
            console.error('Error deleting user:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setDeleteDialogOpen(false)
            setUserToDelete(null)
            setAdminPassword('')
        }
    }

    const confirmUpdateUser = async () => {
        if (!userToEdit) return

        try {
            const res = await fetch(`/api/admin/users/${userToEdit._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToEdit),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to update user')
            }

            setUsers(users.map(user => user._id === userToEdit._id ? userToEdit : user))
            toast({
                title: "Success",
                description: "User updated successfully",
            })
        } catch (error) {
            console.error('Error updating user:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setEditDialogOpen(false)
            setUserToEdit(null)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Manage Users</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => handleViewUser(user)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateUser(user)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteUser(user)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View User Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {userToView && (
                            <div>
                                <p><strong>Name:</strong> {userToView.name}</p>
                                <p><strong>Email:</strong> {userToView.email}</p>
                                <p><strong>Role:</strong> {userToView.isAdmin ? 'Admin' : 'User'}</p>
                            </div>
                        )}
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {userToEdit && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={userToEdit.name}
                                        onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={userToEdit.email}
                                        onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isAdmin"
                                        checked={userToEdit.isAdmin}
                                        onCheckedChange={(checked) => setUserToEdit({ ...userToEdit, isAdmin: checked })}
                                    />
                                    <Label htmlFor="isAdmin">Is Admin</Label>
                                </div>
                            </div>
                        )}
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setEditDialogOpen(false)} variant="outline">Cancel</Button>
                        <Button onClick={confirmUpdateUser}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete User</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </DialogDescription>
                    {userToDelete?.isAdmin && (
                        <div className="mt-4">
                            <Label htmlFor="adminPassword">Admin Password</Label>
                            <Input
                                type="password"
                                id="adminPassword"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDeleteDialogOpen(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={confirmDeleteUser} variant="destructive">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

```

# app/api/admin/files/[filename]/route.js

```js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function DELETE(request, { params }) {
    const { filename } = params
    const filePath = path.join(process.cwd(), 'public', 'images', filename)

    try {
        fs.unlinkSync(filePath)
        return NextResponse.json({ message: 'File deleted successfully' })
    } catch (error) {
        console.error('Error deleting file:', error)
        return NextResponse.json({ error: 'Error deleting file' }, { status: 500 })
    }
}

```

# app/api/admin/files/route.js

```js
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    const directory = path.join(process.cwd(), 'public', 'images');
    
    try {
        const files = await fs.promises.readdir(directory);
        return NextResponse.json(files);
    } catch (error) {
        console.error('Error reading directory:', error);
        return NextResponse.json({ error: 'Failed to read files' }, { status: 500 });
    }
}

```

# app/api/admin/files/upload/route.js

```js
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = path.extname(file.name)
    const fileName = `${uuidv4()}${fileExtension}`
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    const filePath = path.join(uploadDir, fileName)

    try {
        await mkdir(uploadDir, { recursive: true })
        await writeFile(filePath, buffer)
        return NextResponse.json({ message: 'File uploaded successfully', fileName })
    } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json({ error: 'Error saving file' }, { status: 500 })
    }
}

```

# app/api/admin/orders/[id]/route.js

```js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { status } = await req.json()

        await dbConnect()
        const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true })

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Order updated successfully', order })
    } catch (error) {
        console.error('Failed to update order:', error)
        return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 })
    }
}

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await dbConnect()
        const order = await Order.findById(params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name image price')
        
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // Serialize the order object
        const serializedOrder = {
            ...order.toObject(),
            _id: order._id.toString(),
            user: order.user ? {
                _id: order.user._id.toString(),
                name: order.user.name,
                email: order.user.email
            } : null,
            items: order.items.map(item => ({
                ...item.toObject(),
                _id: item._id.toString(),
                product: item.product ? {
                    _id: item.product._id.toString(),
                    name: item.product.name,
                    image: item.product.image,
                    price: item.product.price
                } : null
            }))
        }

        return NextResponse.json(serializedOrder)
    } catch (error) {
        console.error('Failed to fetch order:', error)
        return NextResponse.json({ error: 'Failed to fetch order', details: error.message }, { status: 500 })
    }
}

```

# app/api/admin/orders/route.js

```js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        const db = await getDatabase()
        let query = {}
        if (status && status !== 'all') {
            query.status = status
        }

        const orders = await db.collection('orders')
            .find(query)
            .sort({ createdAt: -1 })
            .toArray()

        // Ensure all orders have a total field, a shippingAddress, and a status
        const ordersWithTotalAndAddress = orders.map(order => ({
            ...order,
            total: order.total || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingAddress: order.shippingAddress || 'Address not provided',
            status: order.status || 'Pending' // Provide a default status if it's missing
        }))

        return NextResponse.json(ordersWithTotalAndAddress)
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
        }

        const { orderId, status } = await request.json()
        const db = await getDatabase()

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Order status updated successfully' })
    } catch (error) {
        console.error('Failed to update order status:', error)
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }
}

```

# app/api/admin/stats/route.js

```js
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import User from '@/models/User'
import Product from '@/models/Product'
import Order from '@/models/Order'

export async function GET(request) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const timeRange = searchParams.get('timeRange') || '7d'

        const { startDate, endDate } = getDateRange(timeRange)

        console.log('Fetching stats for date range:', { startDate, endDate })

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            userGrowth,
            productGrowth,
            orderGrowth,
            revenueGrowth,
            orderTrend,
            revenueTrend,
            topProducts
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
            calculateGrowth(User, startDate, endDate),
            calculateGrowth(Product, startDate, endDate),
            calculateGrowth(Order, startDate, endDate),
            calculateRevenueGrowth(startDate, endDate),
            getOrderTrend(startDate, endDate),
            getRevenueTrend(startDate, endDate),
            getTopProducts(startDate, endDate)
        ])

        console.log('Stats fetched successfully')
        console.log('Total Users:', totalUsers)
        console.log('Total Products:', totalProducts)
        console.log('Total Orders:', totalOrders)
        console.log('Total Revenue:', totalRevenue)
        console.log('Top Products:', topProducts)

        const response = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            userGrowth,
            productGrowth,
            orderGrowth,
            revenueGrowth,
            orderTrend,
            revenueTrend,
            topProducts
        }

        console.log('Full response:', JSON.stringify(response, null, 2))

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

function getDateRange(timeRange) {
    const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 7
    const endDate = new Date()
    const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000)
    return { startDate, endDate }
}

async function calculateGrowth(Model, startDate, endDate) {
    const currentCount = await Model.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } })
    const previousStartDate = new Date(startDate - (endDate - startDate))
    const previousCount = await Model.countDocuments({ createdAt: { $gte: previousStartDate, $lt: startDate } })
    return previousCount === 0 ? 100 : ((currentCount - previousCount) / previousCount) * 100
}

async function calculateRevenueGrowth(startDate, endDate) {
    const currentRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const previousStartDate = new Date(startDate - (endDate - startDate))
    const previousRevenue = await Order.aggregate([
        { $match: { createdAt: { $gte: previousStartDate, $lt: startDate } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const current = currentRevenue[0]?.total || 0
    const previous = previousRevenue[0]?.total || 0
    return previous === 0 ? 100 : ((current - previous) / previous) * 100
}

async function getOrderTrend(startDate, endDate) {
    const orders = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ])
    return orders.map(item => ({ date: item._id, orders: item.orders }))
}

async function getRevenueTrend(startDate, endDate) {
    const revenue = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: '$total' } } },
        { $sort: { _id: 1 } }
    ])
    return revenue.map(item => ({ date: item._id, revenue: item.revenue }))
}

async function getTopProducts(startDate, endDate) {
    try {
        console.log('Fetching top products for date range:', { startDate, endDate })
        
        const ordersInRange = await Order.find({ createdAt: { $gte: startDate, $lte: endDate } })
        console.log('Orders in range:', ordersInRange.length)

        if (ordersInRange.length === 0) {
            console.log('No orders found in the specified date range')
            return []
        }

        // Log a sample order to check its structure
        if (ordersInRange.length > 0) {
            console.log('Sample order:', JSON.stringify(ordersInRange[0], null, 2))
        }

        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $unwind: '$items' },
            { 
                $group: { 
                    _id: '$items.productId', 
                    name: { $first: '$items.name' },
                    sales: { $sum: '$items.quantity' } 
                } 
            },
            { $sort: { sales: -1 } },
            { $limit: 5 },
            { $project: { name: 1, sales: 1, _id: 0 } }
        ])

        console.log('Top Products (raw):', topProducts)

        if (topProducts.length === 0) {
            console.log('No top products found after aggregation')
        }

        return topProducts
    } catch (error) {
        console.error('Error fetching top products:', error)
        return []
    }
}

```

# app/api/admin/users/[id]/route.js

```js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const user = await db.collection('users').findOne(
            { _id: new ObjectId(params.id) },
            { projection: { password: 0 } }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { name, email, isAdmin } = await req.json();

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { name, email, isAdmin } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const userToDelete = await db.collection('users').findOne({ _id: new ObjectId(params.id) });

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userToDelete.isAdmin) {
            const { adminPassword } = await req.json();
            const adminUser = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
            const isPasswordValid = await bcrypt.compare(adminPassword, adminUser.password);

            if (!isPasswordValid) {
                return NextResponse.json({ error: 'Invalid admin password' }, { status: 400 });
            }
        }

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

```

# app/api/admin/users/route.js

```js
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import User from '@/models/User'

export async function GET() {
    try {
        const db = await getDatabase()
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray()
        return NextResponse.json(users.map(user => ({
            ...user,
            _id: user._id.toString() // Convert ObjectId to string
        })))
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const { id, role } = await req.json()
        const db = await getDatabase()
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { role } }
        )
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'User updated successfully' })
    } catch (error) {
        console.error('Failed to update user:', error)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

```

# app/api/auth/[...nextauth]/route.js

```js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getDatabase } from '@/lib/mongodb'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const db = await getDatabase()
        const user = await db.collection("users").findOne({ email: credentials.email })

        if (!user || !(await compare(credentials.password, user.password))) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin || false,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

```

# app/api/auth/login/route.js

```js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        const response = NextResponse.json({ message: 'Login successful', token, isAdmin: user.isAdmin });
        response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

```

# app/api/auth/register-admin/route.js

```js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password, adminCode } = await req.json();

        // Check if the admin code is correct
        if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
            return NextResponse.json({ error: 'Invalid admin code' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, isAdmin: true });
        await newUser.save();

        console.log('Admin user created successfully:', newUser.email);
        return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in admin registration:', error);
        if (error.name === 'MongoServerError' && error.code === 8000) {
            return NextResponse.json({ error: 'Database connection error. Please try again later.' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
    }
}

```

# app/api/auth/register/route.js

```js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user using the User model
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: false, // Set default value
        });

        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}

```

# app/api/categories/route.js

```js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();
        const categories = await Product.distinct('category');
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

```

# app/api/contact/route.js

```js
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Failed to send contact form message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

```

# app/api/debug/orders/route.js

```js
import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request) {
    try {
        await dbConnect()
        
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '10')

        const orders = await Order.find().sort({ createdAt: -1 }).limit(limit).lean()

        console.log('Debug: Recent orders:', orders)

        return NextResponse.json({
            orderCount: await Order.countDocuments(),
            recentOrders: orders
        })
    } catch (error) {
        console.error('Error fetching debug order info:', error)
        return NextResponse.json({ error: 'Failed to fetch debug order info' }, { status: 500 })
    }
}

```

# app/api/delete/route.js

```js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', 'images', filename);

  try {
    await fs.promises.unlink(filePath);
    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`File not found, but continuing: ${filename}`);
      return NextResponse.json({ message: 'File does not exist or was already deleted' });
    }
    console.error('Error deleting file:', err);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}

```

# app/api/image-proxy/route.js

```js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('content-type');

    if (!contentType.startsWith('image/')) {
      return new NextResponse('Invalid image', { status: 400 });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}

```

# app/api/orders/[id]/route.js

```js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
    const db = await getDatabase();
    try {
        const order = await db.collection('orders').findOne({ _id: new ObjectId(params.id) });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const db = await getDatabase();
        const { status } = await request.json();

        const result = await db.collection('orders').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Failed to update order status:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}

```

# app/api/orders/route.js

```js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/mailer';

export async function POST(request) {
    try {
        const db = await getDatabase();
        const session = await getServerSession(authOptions);
        const { name, shippingAddress, mobile, items, total, email, status, userId } = await request.json();

        console.log('Received order data:', { name, shippingAddress, mobile, items, total, email, status, userId });

        // Fetch product details for each item
        const itemsWithDetails = await Promise.all(items.map(async (item) => {
            const product = await db.collection('products').findOne({ _id: new ObjectId(item.id) });
            return {
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            };
        }));

        const order = {
            userId: userId || null,
            name,
            email,
            shippingAddress,
            mobile,
            items: itemsWithDetails,
            total,
            status: status || 'Pending',
            createdAt: new Date()
        };

        const result = await db.collection('orders').insertOne(order);
        const newOrder = { ...order, _id: result.insertedId };

        let emailErrors = [];

        // Send order confirmation email to customer
        if (email) {
            try {
                await sendOrderConfirmationEmail(newOrder);
            } catch (emailError) {
                console.error('Failed to send order confirmation email:', emailError);
                emailErrors.push('Failed to send order confirmation email');
            }
        }

        // Send order notification email to admin
        try {
            await sendAdminOrderNotificationEmail(newOrder);
        } catch (emailError) {
            console.error('Failed to send admin order notification email:', emailError);
            emailErrors.push('Failed to send admin order notification email');
        }

        return NextResponse.json({ 
            message: 'Order created successfully', 
            orderId: result.insertedId,
            emailErrors: emailErrors.length > 0 ? emailErrors : undefined
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const orders = await db.collection('orders')
            .find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        // Check if each product in the order has been reviewed
        const productsWithReviews = await db.collection('products')
            .find({ 'reviews.userId': new ObjectId(session.user.id) })
            .project({ _id: 1 })
            .toArray();

        const reviewedProductIds = new Set(productsWithReviews.map(p => p._id.toString()));

        const ordersWithReviewInfo = orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                ...item,
                reviewed: reviewedProductIds.has(item.id)
            }))
        }));

        return NextResponse.json({ orders: ordersWithReviewInfo });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

```

# app/api/products/[id]/reviews/route.js

```js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const db = await getDatabase()
        const { rating, comment, name, isAnonymous } = await req.json()
        
        // Input validation
        if (!rating || !comment || (typeof isAnonymous !== 'boolean')) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
        }

        if (!params.id || typeof params.id !== 'string') {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
        }

        let productId
        try {
            productId = new ObjectId(params.id)
        } catch (error) {
            return NextResponse.json({ error: 'Invalid product ID format' }, { status: 400 })
        }

        const product = await db.collection('products').findOne({ _id: productId })
        
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Ensure product.reviews is an array
        if (!Array.isArray(product.reviews)) {
            await db.collection('products').updateOne(
                { _id: productId },
                { $set: { reviews: [], avgRating: 0 } }
            )
            product.reviews = []
            product.avgRating = 0
        }

        // Check if the user has purchased the product and if the order is delivered
        const order = await db.collection('orders').findOne({
            userId: session.user.id,
            'items.id': params.id,
            status: 'Delivered'
        })

        if (!order) {
            return NextResponse.json({ error: 'You are not eligible to review this product' }, { status: 403 })
        }

        // Check if the user has already reviewed this product
        const existingReview = product.reviews.find(review => review.userId.toString() === session.user.id)
        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 403 })
        }

        const newReview = {
            _id: new ObjectId(),
            userId: new ObjectId(session.user.id),
            rating: Number(rating),
            comment,
            name: isAnonymous ? 'Anonymous' : name,
            isAnonymous,
            createdAt: new Date()
        }

        const result = await db.collection('products').updateOne(
            { _id: productId },
            { 
                $push: { reviews: newReview },
                $set: { 
                    avgRating: ((product.avgRating || 0) * product.reviews.length + Number(rating)) / (product.reviews.length + 1)
                }
            }
        )

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Failed to add review' }, { status: 500 })
        }

        return NextResponse.json({ message: 'Review added successfully', review: newReview })
    } catch (error) {
        console.error('Failed to add review:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

```

# app/api/products/[id]/route.js

```js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request, { params }) {
    const db = await getDatabase();
    const { id } = params;

    try {
        const product = await db.collection('products').findOne(
            { _id: new ObjectId(id) },
            { projection: { reviews: 1, name: 1, price: 1, description: 1, category: 1, stock: 1, image: 1 } }
        );

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Ensure reviews is always an array
        product.reviews = Array.isArray(product.reviews) ? product.reviews : [];

        return NextResponse.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { id } = params;
        const db = await getDatabase();
        const collection = db.collection('products');

        const formData = await request.formData();
        const updatedProduct = Object.fromEntries(formData.entries());

        // Convert price to number
        if (updatedProduct.price) {
            updatedProduct.price = parseFloat(updatedProduct.price);
        }

        // Convert stock to number
        if (updatedProduct.stock) {
            updatedProduct.stock = parseInt(updatedProduct.stock, 10);
        }

        // Handle image upload if a new image is provided
        if (formData.get('image') && formData.get('image').size > 0) {
            const file = formData.get('image');
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate a unique filename
            const uniqueFilename = `${uuidv4()}${path.extname(file.name)}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', uniqueFilename);

            // Save the file
            await writeFile(imagePath, buffer);
            updatedProduct.image = `/images/${uniqueFilename}`;
        } else {
            // If no new image is provided, remove the image field to keep the existing image
            delete updatedProduct.image;
        }

        // Remove the _id field from the update operation
        delete updatedProduct._id;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedProduct }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(params.id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req, { params }) {
    const db = await getDatabase();
    try {
        const { rating, comment, name } = await req.json();
        
        const product = await db.collection('products').findOne({ _id: new ObjectId(params.id) });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const newReview = {
            rating,
            comment,
            name,
            createdAt: new Date()
        };

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(params.id) },
            { 
                $push: { reviews: newReview },
                $set: { 
                    avgRating: (product.avgRating * product.reviews.length + rating) / (product.reviews.length + 1)
                }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Failed to add review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}

```

# app/api/products/route.js

```js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

export async function GET() {
    const db = await getDatabase();

    try {
        const products = await db.collection('products').find({}).toArray();
        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const formData = await request.formData();
        const name = formData.get('name');
        const price = formData.get('price');
        const description = formData.get('description');
        const category = formData.get('category');
        const stock = formData.get('stock');
        const image = formData.get('image');

        // Validate the incoming data
        if (!name || !price || !description || !category || !stock) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure price and stock are numbers
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);

        if (isNaN(parsedPrice) || isNaN(parsedStock)) {
            return NextResponse.json({ error: 'Invalid price or stock value' }, { status: 400 });
        }

        let imagePath = '';
        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uniqueFilename = `${uuidv4()}${path.extname(image.name)}`;
            imagePath = path.join(process.cwd(), 'public', 'images', uniqueFilename);

            await writeFile(imagePath, buffer);
            imagePath = `/images/${uniqueFilename}`;
        }

        const newProduct = {
            name,
            price: parsedPrice,
            description,
            category,
            stock: parsedStock,
            image: imagePath,
            reviews: [], // Initialize reviews as an empty array
            avgRating: 0
        };

        const result = await db.collection('products').insertOne(newProduct);

        return NextResponse.json({ message: 'Product created successfully', productId: result.insertedId });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const db = await getDatabase();
        const formData = await request.formData();
        const id = formData.get('id');
        const name = formData.get('name');
        const price = formData.get('price');
        const description = formData.get('description');
        const category = formData.get('category');
        const stock = formData.get('stock');
        const image = formData.get('image');

        const updateData = {
            name,
            price: parseFloat(price),
            description,
            category,
            stock: parseInt(stock, 10)
        };

        if (image && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uniqueFilename = `${uuidv4()}${path.extname(image.name)}`;
            const imagePath = path.join(process.cwd(), 'public', 'images', uniqueFilename);

            await writeFile(imagePath, buffer);
            updateData.image = `/images/${uniqueFilename}`;
        }

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        const db = await getDatabase();
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

```

# app/api/products/search/route.js

```js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const term = searchParams.get('term');
        const category = searchParams.get('category');
        const sortBy = searchParams.get('sortBy');

        let query = {};
        if (term) {
            query.$or = [
                { name: { $regex: term, $options: 'i' } },
                { description: { $regex: term, $options: 'i' } },
            ];
        }
        if (category) {
            query.category = category;
        }

        let sort = {};
        if (sortBy === 'price_asc') {
            sort.price = 1;
        } else if (sortBy === 'price_desc') {
            sort.price = -1;
        } else {
            sort.name = 1;
        }

        const products = await Product.find(query).sort(sort);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
```

# app/api/reviews/route.js

```js
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import clientPromise from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let client
  try {
    client = await clientPromise
  } catch (error) {
    console.error('Failed to connect to the database:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }

  const db = client.db('sample_mflix')

  const { movieId, review, rating } = await req.json()
  
  if (!movieId || !review || rating === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const newReview = {
    name: session.user.name,
    user_id: session.user.email,
    movie_id: new ObjectId(movieId),
    review,
    rating: parseInt(rating),
    date: new Date(),
  }

  try {
    const result = await db.collection('reviews').insertOne(newReview)
    console.log('Review added successfully:', result.insertedId)
    return NextResponse.json({ message: 'Review added successfully', reviewId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json({ error: 'Error adding review', details: error.message }, { status: 500 })
  }
}

```

# app/api/settings/home/route.js

```js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const validateImageUrl = (url) => {
    return url.startsWith('/') || url.match(/^https?:\/\/.+/);
};

export async function GET() {
    try {
        const db = await getDatabase();
        const settings = await db.collection('settings').findOne({ key: 'homePageSettings' });
        return NextResponse.json(settings || {
            featuredProductId: null,
            featuredProductIds: [],
            videoUrl: 'https://www.youtube.com/embed/P2gW89OxtJY?si=vw-kbKkYT2MSjon8',
            heroHeading: '100% সিলিকনের তৈরি অরিজিনাল ম্যাজিক কনডম',
            heroParagraph: 'যৌন দুর্বলতা থেকে মুক্তি পেতে এবং দীর্ঘক্ষণ সঙ্গম করতে পারবেন, ৩০-৪০ মিনিট পর্যন্ত সঙ্গম করতে পারবেন।',
            heroImage: '/images/hero-bg.jpg'
        });
    } catch (error) {
        console.error('Error fetching home settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const { featuredProductId, featuredProductIds, videoUrl, heroHeading, heroParagraph, heroImage } = await request.json();
        
        if (heroImage && !validateImageUrl(heroImage)) {
            return NextResponse.json({ error: 'Invalid hero image URL' }, { status: 400 });
        }

        const db = await getDatabase();

        const result = await db.collection('settings').findOneAndUpdate(
            { key: 'homePageSettings' },
            { $set: { featuredProductId, featuredProductIds, videoUrl, heroHeading, heroParagraph, heroImage } },
            { upsert: true, returnDocument: 'after' }
        );

        if (!result.value) {
            console.error('Failed to update setting');
            return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Home page settings updated successfully' });
    } catch (error) {
        console.error('Error updating home settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

```

# app/api/test-email/route.js

```js
import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';

export async function GET() {
    try {
        console.log('Verifying SMTP connection...');
        await transporter.verify();
        console.log('SMTP connection verified successfully');
        
        console.log('Sending test email...');
        const testResult = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: 'SMTP Test Email',
            text: 'If you receive this email, your SMTP configuration is working correctly.',
        });
        console.log('Test email sent successfully:', testResult);

        return NextResponse.json({ message: 'Test email sent successfully', result: testResult });
    } catch (error) {
        console.error('Failed to send test email:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            command: error.command,
            response: error.response,
        });
        return NextResponse.json({ 
            error: 'Failed to send test email', 
            details: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        }, { status: 500 });
    }
}

```

# app/api/update-legacy-images/route.js

```js
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await getDatabase();
        const Product = db.collection('products');

        const result = await Product.updateMany(
            { image: '/placeholder.jpg' },
            { $set: { image: '/images/placeholder.png' } }
        );

        return NextResponse.json({ message: 'Updated legacy image paths', modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating legacy image paths:', error);
        return NextResponse.json({ error: 'Failed to update legacy image paths' }, { status: 500 });
    }
}

```

# app/api/upload/route.js

```js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use the correct upload directory
  const uploadDir = path.join(process.cwd(), 'public', 'images');
  
  try {
    // Ensure the upload directory exists
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    return NextResponse.json({ message: 'File uploaded successfully', fileName });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}

```

# app/api/user/route.js

```js
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ObjectId } from 'mongodb'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const db = await getDatabase()
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { password: 0 } }
        )

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            billingAddresses: user.billingAddresses || [],
            shippingAddresses: user.shippingAddresses || []
        })
    } catch (error) {
        console.error('Error in GET /api/user:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const { name, email, billingAddresses, shippingAddresses } = await req.json()

        const db = await getDatabase()
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(session.user.id) },
            { $set: { 
                name, 
                email, 
                billingAddresses: billingAddresses || [],
                shippingAddresses: shippingAddresses || []
            } }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fetch the updated user data
        const updatedUser = await db.collection('users').findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { password: 0 } }
        )

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error in PUT /api/user:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

```

# app/cart/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import CartSummary from '@/components/CartSummary'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, getCartItemCount, getCartTotal, isLoading } = useCart()
    const [imgSrc, setImgSrc] = useState('/images/placeholder.png')

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-16 w-16 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Cart ({getCartItemCount()} items)</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <Image 
                                                    src={item.image || imgSrc}
                                                    alt={item.name || 'Product'} 
                                                    width={50} 
                                                    height={50}
                                                    onError={() => setImgSrc('/images/placeholder.png')}
                                                    className="mr-4"
                                                />
                                                {item.name || 'Unknown Product'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatCurrency(item.price)}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                                                className="w-20"
                                            />
                                        </TableCell>
                                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                                        <TableCell>
                                            <Button variant="destructive" onClick={() => removeFromCart(item._id)}>
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div>
                        <CartSummary total={getCartTotal()} />
                        <div className="mt-4">
                            <Link href="/checkout">
                                <Button size="lg" className="w-full">Proceed to Checkout</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

```

# app/checkout/page.js

```js
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [shippingAddress, setShippingAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGuest, setIsGuest] = useState(false)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [shippingAddresses, setShippingAddresses] = useState([])
    const [selectedAddressIndex, setSelectedAddressIndex] = useState('')
    const { cart, getCartTotal, clearCart } = useCart()
    const router = useRouter()
    const { toast } = useToast()
    const { data: session, status } = useSession()

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === 'authenticated' && session?.user) {
                try {
                    const response = await fetch('/api/user')
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data')
                    }
                    const userData = await response.json()
                    setName(userData.name || '')
                    setEmail(userData.email || '')
                    setShippingAddresses(userData.shippingAddresses || [])
                    if (userData.shippingAddresses && userData.shippingAddresses.length > 0) {
                        setSelectedAddressIndex('0')
                        fillShippingInfo(userData.shippingAddresses[0])
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                    toast({
                        title: "Error",
                        description: "Failed to load user data",
                        variant: "destructive",
                    })
                }
            } else if (status === 'unauthenticated') {
                setShowAuthDialog(true)
            }
        }

        fetchUserData()
    }, [status, session, toast])

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

    const fillShippingInfo = (address) => {
        setName(address.name)
        setEmail(address.email)
        setShippingAddress(address.address)
        setPhone(address.phone)
    }

    const handleAddressSelect = (index) => {
        setSelectedAddressIndex(index)
        fillShippingInfo(shippingAddresses[parseInt(index)])
    }

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
                shippingAddress,
                name,
                email,
                mobile: phone,
                total: getCartTotal(),
                status: 'Pending',
                userId: session?.user?.id || null
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
                    {status === 'authenticated' && shippingAddresses.length > 0 && (
                        <div className="mb-4">
                            <Label htmlFor="addressSelect">Select Shipping Address</Label>
                            <Select onValueChange={handleAddressSelect} value={selectedAddressIndex}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an address" />
                                </SelectTrigger>
                                <SelectContent>
                                    {shippingAddresses.map((address, index) => (
                                        <SelectItem key={index} value={index.toString()}>
                                            {address.name} - {address.address.split('\n')[0]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
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
                            <Label htmlFor="shippingAddress">Shipping Address</Label>
                            <Textarea
                                id="shippingAddress"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
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

```

# app/contact/page.js

```js
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-context"

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        toast({
          title: "Message sent",
          description: "Thank you for contacting us. We will get back to you soon.",
        })
        setName('')
        setEmail('')
        setMessage('')
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription>
            If you have any questions or feedback, please feel free to contact us using the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Your message"
                className="min-h-[150px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

```

# app/error.js

```js
'use client'

import { useEffect } from 'react'

export default function Error({ error }) {
  useEffect(() => {
    // Log the error (this replaces the onError functionality from next.config.js)
    console.error('NextJS Error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4">
        {error?.digest
          ? `An error occurred on the server (${error.digest})`
          : 'An error occurred on the client'}
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  )
}

```

# app/favicon.ico

This is a binary file of the type: Binary

# app/fonts/GeistMonoVF.woff

This is a binary file of the type: Binary

# app/fonts/GeistVF.woff

This is a binary file of the type: Binary

# app/globals.css

```css
/* stylelint-disable */
@tailwind base;
@tailwind components;
@tailwind utilities;
/* stylelint-enable */

@layer base {
  :root {
    --background: 220 33% 98%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 340 82% 52%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

```

# app/layout.js

```js
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/components/ui/toast-context'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pleasure BD',
  description: 'Your one-stop shop for pleasure products',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <Providers>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 flex flex-col bg-background">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              <Footer />
            </ToastProvider>
          </Providers>
        </CartProvider>
      </body>
    </html>
  )
}

```

# app/login/page.js

```js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      // Fetch user data to check if the user is an admin
      const userResponse = await fetch('/api/user')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        if (userData.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className="flex-1 bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h2 className="text-center text-3xl font-bold text-foreground mb-6">
          Login
        </h2>
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

```

# app/not-found.js

```js
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-4">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go back home
      </a>
    </div>
  )
}

```

# app/order-confirmation/[id]/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast-context'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

export default function OrderConfirmationPage({ params }) {
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchOrder = async () => {
            if (!params.id) {
                console.error('Order ID is undefined')
                toast({
                    title: "Error",
                    description: "Invalid order ID",
                    variant: "destructive",
                })
                router.push('/orders')
                return
            }

            try {
                const res = await fetch(`/api/orders/${params.id}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch order')
                }
                const data = await res.json()
                setOrder(data)
            } catch (error) {
                console.error('Error fetching order:', error)
                toast({
                    title: "Error",
                    description: "Failed to fetch order details",
                    variant: "destructive",
                })
                router.push('/orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [params.id, router, toast])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
                <p>We couldn't find the order you're looking for.</p>
                <Button onClick={() => router.push('/orders')} className="mt-4">
                    View All Orders
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
            <p className="text-lg mb-4">Thank you for your order!</p>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Order Details</h2>
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> {formatCurrency(order.total)}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
                <ul className="space-y-2">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex items-center space-x-4">
                            <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: {formatCurrency(item.price)}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Information</h3>
                <p><strong>Name:</strong> {order.name}</p>
                <p><strong>Mobile:</strong> {order.mobile}</p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
            </div>
            <Button onClick={() => router.push('/orders')} className="mt-6">
                View All Orders
            </Button>
        </div>
    )
}

```

# app/orders/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrdersPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const fetchOrders = async () => {
            if (status !== 'authenticated') {
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/orders')
                if (!response.ok) {
                    throw new Error('Failed to fetch orders')
                }
                const data = await response.json()
                setOrders(data.orders)
            } catch (error) {
                console.error('Error fetching orders:', error)
                toast({
                    title: "Error",
                    description: "Failed to load orders",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [status, toast])

    const handleReviewClick = (productId) => {
        router.push(`/products/${productId}/review`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (!session) {
        return <div>Please log in to view your orders.</div>
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
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
            <div className="space-y-8">
                {orders.map((order) => (
                    <Card key={order._id}>
                        <CardHeader>
                            <CardTitle className="text-xl">Order #{order._id.substring(0, 8)}</CardTitle>
                            <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="font-semibold">Status: <StatusBadge status={order.status} /></p>
                                <p>Total: {formatCurrency(order.total)}</p>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Items:</h3>
                                <ul className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>{formatCurrency(item.price * item.quantity)}</span>
                                            {order.status === 'Delivered' && (
                                                <Link href={`/products/${item.id}/review`} passHref>
                                                    <Button variant="outline" size="sm">
                                                        Submit Review
                                                    </Button>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

```

# app/page.js

```js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function Home() {
  // State variables
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [homePageProduct, setHomePageProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [homeProductImgSrc, setHomeProductImgSrc] = useState(
    "/images/placeholder.png"
  );
  const [quantity, setQuantity] = useState(1);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/P2gW89OxtJY?si=vw-kbKkYT2MSjon8");
  const [heroHeading, setHeroHeading] = useState("100% সিলিকনের তৈরি অরিজিনাল ম্যাজিক কনডম");
  const [heroParagraph, setHeroParagraph] = useState("যৌন দুর্বলতা থেকে মুক্তি পেতে এবং দীর্ঘক্ষণ সঙ্গম করতে পারবেন, ৩০-৪০ মিনিট পর্যন্ত সঙ্গম করতে পারবেন।");
  const [heroImage, setHeroImage] = useState("/images/hero-bg.png");
  const [heroImageError, setHeroImageError] = useState(false);

  // Hooks
  const { toast } = useToast();
  const router = useRouter();
  const { addToCart } = useCart();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch("/api/settings/home"),
          fetch("/api/products"),
        ]);

        if (!settingsRes.ok)
          throw new Error("Failed to fetch home page settings");
        if (!productsRes.ok) throw new Error("Failed to fetch products");

        const settingsData = await settingsRes.json();
        const productsData = await productsRes.json();

        if (settingsData.featuredProductId) {
          const homeProductRes = await fetch(
            `/api/products/${settingsData.featuredProductId}`
          );
          if (homeProductRes.ok) {
            const homeProductData = await homeProductRes.json();
            setHomePageProduct(homeProductData.product);
            setHomeProductImgSrc(homeProductData.product.image);
          } else {
            console.error("Failed to fetch home page product");
            setHomePageProduct(null);
          }
        } else {
          setHomePageProduct(null);
        }

        const featuredProductIds = settingsData.featuredProductIds || [];
        const featuredProducts = productsData.products.filter((product) =>
          featuredProductIds.includes(product._id)
        );
        setFeaturedProducts(featuredProducts);

        setVideoUrl(settingsData.videoUrl || "https://www.youtube.com/embed/P2gW89OxtJY?si=vw-kbKkYT2MSjon8");
        setHeroHeading(settingsData.heroHeading || "100% সিলিকনের তৈরি অরিজিনাল ম্যাজিক কনডম");
        setHeroParagraph(settingsData.heroParagraph || "যৌন দুর্বলতা থেকে মুক্তি পেতে এ���ং দীর্ঘক্ষণ সঙ্গম করতে পারবেন, ৩০-৪০ মিনিট পর্যন্ত সঙ্গম করতে পারবেন।");
        setHeroImage(settingsData.heroImage || "/images/hero-bg.png");
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load page data",
          variant: "destructive",
        });
        setFeaturedProducts([]);
        setHomePageProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (homePageProduct) {
        const orderData = {
          items: [{
            id: homePageProduct._id,
            name: homePageProduct.name,
            price: homePageProduct.price,
            quantity: quantity,
            image: homePageProduct.image
          }],
          shippingAddress: address,
          name,
          mobile: phone,
          total: homePageProduct.price * quantity,
          isGuest: true
        };

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const data = await response.json();
        toast({
          title: "Success",
          description: "Order placed successfully",
        });
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        throw new Error("No product selected for order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProxiedImageUrl = (url) => {
    if (url.startsWith('/')) {
      return url;
    }
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground mb-4"> {/* Added pt-5 for 20px top padding */}
      {/* Hero Section */}
      <section className="relative h-[450px] w-full">
        <Image
          src={heroImageError ? "/images/hero-bg.png" : getProxiedImageUrl(heroImage)}
          alt="Pleasure BD Hero"
          fill
          style={{ objectFit: "cover" }}
          priority
          onError={() => {
            setHeroImageError(true);
            toast({
              title: "Error",
              description: "Failed to load hero image. Using default image.",
              variant: "destructive",
            });
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-start">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              {heroHeading}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground mb-10 max-w-2xl">
              {heroParagraph}
            </p>
            <Button
              asChild
              size="lg"
              className="text-xl py-6 px-10"
            >
              <Link href="#order-form">অর্ডার করতে চাই
              <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-far-hand-point-down ml-2 w-6 h-6"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white" // Add this line to make the SVG color white
                >
                  <path d="M188.8 512c45.616 0 83.2-37.765 83.2-83.2v-35.647a93.148 93.148 0 0 0 22.064-7.929c22.006 2.507 44.978-3.503 62.791-15.985C409.342 368.1 448 331.841 448 269.299V248c0-60.063-40-98.512-40-127.2v-2.679c4.952-5.747 8-13.536 8-22.12V32c0-17.673-12.894-32-28.8-32H156.8C140.894 0 128 14.327 128 32v64c0 8.584 3.048 16.373 8 22.12v2.679c0 6.964-6.193 14.862-23.668 30.183l-.148.129-.146.131c-9.937 8.856-20.841 18.116-33.253 25.851C48.537 195.798 0 207.486 0 252.8c0 56.928 35.286 92 83.2 92 8.026 0 15.489-.814 22.4-2.176V428.8c0 45.099 38.101 83.2 83.2 83.2zm0-48c-18.7 0-35.2-16.775-35.2-35.2V270.4c-17.325 0-35.2 26.4-70.4 26.4-26.4 0-35.2-20.625-35.2-44 0-8.794 32.712-20.445 56.1-34.926 14.575-9.074 27.225-19.524 39.875-30.799 18.374-16.109 36.633-33.836 39.596-59.075h176.752C364.087 170.79 400 202.509 400 248v21.299c0 40.524-22.197 57.124-61.325 50.601-8.001 14.612-33.979 24.151-53.625 12.925-18.225 19.365-46.381 17.787-61.05 4.95V428.8c0 18.975-16.225 35.2-35.2 35.2zM328 64c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24z" />
                </svg>
                </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main content wrapper with margin */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Featured Products Section */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No featured products available.
            </p>
          )}
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-purple-900 text-white rounded-3xl p-12 md:p-10">
          <h2 className="text-4xl font-bold mb-10 text-center">
            কেন নিবেন এই ম্যাজিক কনডম?
          </h2>
          <p className="text-xl mb-10 text-center max-w-3xl mx-auto">
            আপনি কি আপনার স্ত্রীকে খুশি দেখে চান? আপনি ক আপনার স্ত্রীকে আরও
            আনন্দ দিত চান? তাহলে সাধারণ কনডমের রিবর্তে ম্যাজিক কনডম ব্যহার কুন
            (এই কনডমটি সিলিকন দিয়ে তৈরি)।
          </p>
          <ul className="space-y-6 max-w-2xl mx-auto">
            {[
              "৩০ থেকে ৪০ মিনিট পর্যন্ত অবিরাম সঙ্গম করতে সক্ষম হবেন।",
              "এই কনডমটি খব নরম এবং পিচ্ছিল।",
              "সঙ্গী এতে কোনও ব্যথা অনুভব করবে না (সাধারণ কনডমের মতোই নরম)।",
              "এটি ব্যবহারে কোনও ক্ষতি নেই।",
              "একটি কনডম ৫০০ বারেরও বেশি ব্যবহার করা যায়।",
              "এই কনডমটি সব লিঙ্গের মানুষ ব্যবহার করতে পারে।",
            ].map((item, index) => (
              <li key={index} className="flex items-center text-lg">
                <svg
                  className="w-6 h-6 mr-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="text-xl py-6 px-10"
            >
              <Link href="#order-form">অর্ডার করতে চাই
              <svg
                  aria-hidden="true"
                  className="e-font-icon-svg e-far-hand-point-down ml-2 w-6 h-6"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white" // Add this line to make the SVG color white
                >
                  <path d="M188.8 512c45.616 0 83.2-37.765 83.2-83.2v-35.647a93.148 93.148 0 0 0 22.064-7.929c22.006 2.507 44.978-3.503 62.791-15.985C409.342 368.1 448 331.841 448 269.299V248c0-60.063-40-98.512-40-127.2v-2.679c4.952-5.747 8-13.536 8-22.12V32c0-17.673-12.894-32-28.8-32H156.8C140.894 0 128 14.327 128 32v64c0 8.584 3.048 16.373 8 22.12v2.679c0 6.964-6.193 14.862-23.668 30.183l-.148.129-.146.131c-9.937 8.856-20.841 18.116-33.253 25.851C48.537 195.798 0 207.486 0 252.8c0 56.928 35.286 92 83.2 92 8.026 0 15.489-.814 22.4-2.176V428.8c0 45.099 38.101 83.2 83.2 83.2zm0-48c-18.7 0-35.2-16.775-35.2-35.2V270.4c-17.325 0-35.2 26.4-70.4 26.4-26.4 0-35.2-20.625-35.2-44 0-8.794 32.712-20.445 56.1-34.926 14.575-9.074 27.225-19.524 39.875-30.799 18.374-16.109 36.633-33.836 39.596-59.075h176.752C364.087 170.79 400 202.509 400 248v21.299c0 40.524-22.197 57.124-61.325 50.601-8.001 14.612-33.979 24.151-53.625 12.925-18.225 19.365-46.381 17.787-61.05 4.95V428.8c0 18.975-16.225 35.2-35.2 35.2zM328 64c0-13.255 10.745-24 24-24s24 10.745 24 24-10.745 24-24 24-24-10.745-24-24z" />
                </svg>
              </Link>
            </Button>
          </div>
        </section>

        {/* Video Section */}
        <section>
        <h4 className="mt-6 text-center text-xl mb-4">
            আমাদের ম্যাজিক কনডম সম্পর্কে আরও জানুন এবং এর অসাধারণ সুবিধাগুলি
            দেখুন।
          </h4>
          <div className="aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden">
            <iframe
              src={videoUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Order Form Section */}
        {homePageProduct ? (
          <section
            id="order-form"
            className="bg-card text-card-foreground rounded-3xl p-12 md:p-10 shadow-lg mb-4"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">অর্ডার ফর্ম</h2>
            <div className="flex flex-col md:flex-row gap-12 mb-5"> {/* Added mb-5 here for 20px bottom margin */}
              {/* Left side - Form fields */}
              <div className="md:w-1/2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      নাম
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার নাম লিখুনঃ"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ঠিকানা
                    </Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার ঠিকানা লিখুনঃ"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ফোন নাম্বার
                    </Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="আপনার ফোন নাম্বার লিখুনঃ"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        অর্ডার প্রক্রিয়াধীন...
                      </>
                    ) : (
                      "অর্ডার করুন"
                    )}
                  </Button>
                </form>
              </div>
              {/* Right side - Product details */}
              <div className="md:w-1/2">     
                <div className="flex flex-col">
                  <div className="flex items-start space-x-4 mb-4">
                  <div className="relative w-1/1 aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={homeProductImgSrc}
                        alt={homePageProduct.name}
                        width={100}
                        height={100}
                        className="rounded-lg mb-4"
                        onError={() =>
                          setHomeProductImgSrc("/images/placeholder.png")
                        }
                      />
                    </div>
                    <div className="w-2/3">
                      <h3 className="text-xl font-semibold">
                        {homePageProduct.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600 mb-4 line-clamp-3">{homePageProduct.description}</p>
                    <p className="text-gray-600">
                      ক্যাটাগরি: {homePageProduct.category}
                    </p>
                    <p className="text-xl font-bold">
                      মূল্য: {formatCurrency(homePageProduct.price)}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="quantity" className="font-medium">
                        পরিমাণ:
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-20 pr-8"
                          style={{
                            WebkitAppearance: 'textfield',
                            MozAppearance: 'textfield',
                            appearance: 'textfield',
                          }}
                        />
                        <style jsx>{`
                          input[type="number"]::-webkit-inner-spin-button,
                          input[type="number"]::-webkit-outer-spin-button {
                            opacity: 1;
                            background: transparent;
                            border-width: 0px;
                            margin: 0;
                            position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            width: 1.5em;
                          }
                        `}</style>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section
            id="order-form"
            className="bg-card text-card-foreground rounded-3xl p-12 md:p-20 shadow-lg mb-24"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">
              No Product Available
            </h2>
            <p className="text-center text-lg mb-5"> {/* Added mb-5 here for 20px bottom margin */}
              Sorry, there is currently no product available for order. Please
              check back later.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

```

# app/privacy/page.js

```js
'use client';

import { useEffect } from 'react';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Welcome to Pleasure BD. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        We collect information that you provide to us directly, such as when you create an account, place an order, or contact us for support.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to process your orders, improve our services, and communicate with you about your account or transactions.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Sharing Your Information</h2>
      <p className="mb-4">
        We do not share your personal information with third parties except as necessary to provide our services or as required by law.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
      </p>
      <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
      </p>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, please contact us.
      </p>
    </div>
  );
}

```

# app/products/[id]/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/toast-context"
import Reviews from '@/components/Reviews'
import ReviewForm from '@/components/ReviewForm'
import { formatCurrency } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Input } from '@/components/ui/input'

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [canReview, setCanReview] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data = await response.json()
        // Ensure reviews is always an array
        data.product.reviews = Array.isArray(data.product.reviews) ? data.product.reviews : [];
        setProduct(data.product)

        // Check if the user can review
        if (session?.user) {
          const orderResponse = await fetch(`/api/orders?productId=${params.id}`)
          if (orderResponse.ok) {
            const orderData = await orderResponse.json()
            setCanReview(orderData.canReview)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, session, toast])

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit review')
      }

      const { review } = await response.json()
      setProduct(prevProduct => ({
        ...prevProduct,
        reviews: [...(prevProduct.reviews || []), review]
      }))

      toast({
        title: "Success",
        description: "Your review has been submitted successfully",
      })
      setCanReview(false)
    } catch (error) {
      console.error('Error submitting review:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Success",
      description: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`,
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">{formatCurrency(product.price)}</p>
          <p className="mb-4">{product.description}</p>
          <p className="mb-4">Category: {product.category}</p>
          <p className="mb-4">In Stock: {product.stock}</p>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                className="w-20"
              />
              <Button onClick={handleAddToCart} disabled={product.stock === 0} className="flex-grow">
                Add to Cart
              </Button>
            </div>
            <Button onClick={() => router.push(`/products/${params.id}/review`)} variant="outline" className="w-full">
              Write a Review
            </Button>
          </div>
        </div>
      </div>
      {canReview && <ReviewForm onSubmit={handleReviewSubmit} />}
      <Reviews productId={params.id} initialReviews={product.reviews} />
    </div>
  )
}

```

# app/products/[id]/review/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useToast } from "@/components/ui/toast-context"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, StarIcon } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function SubmitReviewPage({ params }) {
    const [product, setProduct] = useState(null)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { data: session, status } = useSession()
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch product')
                }
                const data = await response.json()
                setProduct(data.product)
                setName(session?.user?.name || '')
            } catch (error) {
                console.error('Error fetching product:', error)
                toast({
                    title: "Error",
                    description: "Failed to load product information",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchProduct()
        } else if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [params.id, status, toast, router, session])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch(`/api/products/${params.id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    rating, 
                    comment, 
                    name: isAnonymous ? 'Anonymous' : name,
                    isAnonymous 
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to submit review')
            }

            toast({
                title: "Success",
                description: "Your review has been submitted successfully",
            })
            router.push(`/products/${params.id}`)
        } catch (error) {
            console.error('Error submitting review:', error)
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setSubmitting(false)
        }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="rounded-lg"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold mb-4">{formatCurrency(product.price)}</p>
                    <p className="mb-4">{product.description}</p>
                    <p className="mb-4">Category: {product.category}</p>
                    <p className="mb-4">In Stock: {product.stock}</p>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-6">Submit Review for {product.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                {!isAnonymous && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isAnonymous}
                        />
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="anonymous"
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                    />
                    <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                        Submit as anonymous
                    </label>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <Textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Review'
                    )}
                </Button>
            </form>
        </div>
    )
}

```

# app/products/page.js

```js
'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/toast-context"

export default function ProductsPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
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
                    description: "Failed to load products",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [toast])

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

```

# app/register/page.js

```js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-context";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        router.push("/login");
        toast({
          title: "Success",
          description: "Registration successful. Please log in.",
        });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h2 className="text-center text-3xl font-bold text-foreground mb-6">
          Registration
        </h2>
        <div className="bg-card text-card-foreground rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I accept all{" "}
                <span>
                  <Link href="/terms" className="text-primary hover:underline">
                    terms & conditions
                  </Link>
                </span>
              </label>
            </div>
            <Button type="submit" className="w-full">
              Register Now
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

```

# app/terms/page.js

```js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
  const router = useRouter();

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        Welcome to Pleasure BD. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Use of the Site</h2>
      <p className="mb-4">
        You may use the site for lawful purposes only. You agree not to use the site in any way that could damage, disable, overburden, or impair the site.
      </p>
      <h2 className="text-2xl font-semibold mb-4">2. Intellectual Property</h2>
      <p className="mb-4">
        All content on this site, including text, graphics, logos, and images, is the property of Pleasure BD or its content suppliers and is protected by international copyright laws.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Limitation of Liability</h2>
      <p className="mb-4">
        Pleasure BD will not be liable for any damages of any kind arising from the use of this site, including, but not limited to, direct, indirect, incidental, punitive, and consequential damages.
      </p>
      <h2 className="text-2xl font-semibold mb-4">4. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to make changes to our site, policies, and these Terms of Service at any time. Your continued use of the site following any changes indicates your acceptance of the new terms.
      </p>
      <p className="mb-4">
        If you have any questions about these Terms of Service, please contact us.
      </p>
    </div>
  );
}

```

# components.json

```json
{
  "৳schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

# components/AddToCartButton.js

```js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useToast } from "@/components/ui/toast-context"

export default function AddToCartButton({ product }) {
    const [isAdding, setIsAdding] = useState(false)
    const { addToCart } = useCart()
    const { toast } = useToast()

    const handleAddToCart = async () => {
        setIsAdding(true)
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
            setIsAdding(false)
        }
    }

    return (
        <Button onClick={handleAddToCart} disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
    )
}

```

# components/AdminLayout.js

```js
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <ul className="flex flex-col py-4">
          <li>
            <Link href="/admin" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Products</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/featured-products" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Featured Products</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/home-setting" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Home Setting</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Orders</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-200">
              <span className="mx-3">Users</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Button onClick={handleLogout}>Logout</Button>
        </header>

        {/* Mobile sidebar */}
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setIsOpen(false)}>
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Mobile sidebar content */}
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {/* Add mobile navigation items here */}
                  <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Dashboard</Link>
                  <Link href="/admin/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Products</Link>
                  <Link href="/admin/featured-products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Featured Products</Link>
                  <Link href="/admin/home-setting" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home Setting</Link>
                  <Link href="/admin/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Orders</Link>
                  <Link href="/admin/users" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Users</Link>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

```

# components/AsyncWrapper.js

```js
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AsyncWrapper({ children, loadingMessage = 'Loading...', errorMessage = 'An error occurred. Please try again.' }) {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all(
                    React.Children.map(children, (child) =>
                        child.type.fetchData ? child.type.fetchData() : Promise.resolve()
                    )
                )
                setIsLoading(false)
            } catch (err) {
                setError(err)
                setIsLoading(false)
            }
        }

        loadData()
    }, [children])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p>{loadingMessage}</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <p>{errorMessage}</p>
            </div>
        )
    }

    return <>{children}</>
}
```

# components/AuthDialog.js

```js
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "@/components/ui/toast-context"
import Link from 'next/link'

export default function AuthDialog({ onClose, onGuestCheckout }) {
    const [isLogin, setIsLogin] = useState(true)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isLogin) {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })
            if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                })
            } else {
                onClose()
            }
        } else {
            if (password !== confirmPassword) {
                toast({
                    title: "Error",
                    description: "Passwords do not match",
                    variant: "destructive",
                })
                return
            }
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullName, email, password }),
                })
                if (res.ok) {
                    await signIn('credentials', {
                        redirect: false,
                        email,
                        password,
                    })
                    onClose()
                } else {
                    const data = await res.json()
                    throw new Error(data.error || 'Registration failed')
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
            }
        }
    }

    return (
        <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">
                        {isLogin ? 'Login' : 'Create an Account'}
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-500">
                        {isLogin 
                            ? 'Log in to your account or continue as a guest.'
                            : 'Join our community and enjoy exclusive benefits!'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required={!isLogin}
                                className="w-full"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={!isLogin}
                                className="w-full"
                            />
                        </div>
                    )}
                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Button
                            variant="link"
                            className="p-0 text-blue-600 hover:underline"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up now' : 'Log in here'}
                        </Button>
                    </p>
                </div>
                {isLogin && (
                    <div className="mt-4">
                        <Button 
                            onClick={onGuestCheckout} 
                            variant="secondary" 
                            className="w-full bg-pink-100 text-pink-600 hover:bg-pink-200"
                        >
                            Continue as Guest
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

```

# components/Cart.js

```js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart, isLoading, getCartItemCount } = useCart()
    const [imgSrc, setImgSrc] = useState('/images/placeholder.png')
    const [itemCount, setItemCount] = useState(0)

    useEffect(() => {
        setItemCount(getCartItemCount())
    }, [cart, getCartItemCount])

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0)

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Your Cart ({itemCount} items)</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeItem={removeFromCart} />
                            ))}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-xl font-bold">Total: ৳{total.toFixed(2)}</p>
                        <Link href="/checkout">
                            <Button size="lg">Proceed to Checkout</Button>
                        </Link>
                    </div>
                    {cart.length > 0 && (
                        <div className="mt-4">
                            <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function CartItem({ item, updateQuantity, removeItem }) {
    const [imgSrc, setImgSrc] = useState('/images/placeholder.png')

    useEffect(() => {
        if (item.image) {
            setImgSrc(item.image === '/placeholder.jpg' ? '/images/placeholder.png' : item.image)
        }
    }, [item.image])

    return (
        <TableRow>
            <TableCell>
                <Image 
                    src={imgSrc}
                    alt={item.name} 
                    width={50} 
                    height={50}
                    onError={() => setImgSrc('/images/placeholder.png')}
                />
                {item.name}
            </TableCell>
            <TableCell>৳{(parseFloat(item.price) || 0).toFixed(2)}</TableCell>
            <TableCell>
                <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-16 p-1 border rounded"
                />
            </TableCell>
            <TableCell>৳{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}</TableCell>
            <TableCell>
                <Button variant="destructive" onClick={() => removeItem(item.id)}>
                    Remove
                </Button>
            </TableCell>
        </TableRow>
    )
}

```

# components/CartContext.js

```js
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
        setIsLoading(false)
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id)
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prevCart, { 
                id: product.id, 
                name: product.name, 
                price: parseFloat(product.price) || 0, 
                quantity: 1,
                image: product.image
            }]
        })
    }

    const updateQuantity = (id, quantity) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        )
    }

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, isLoading }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}

```

# components/CartSummary.js

```js
import { useCart } from '@/contexts/CartContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CartSummary() {
    const { cart } = useCart()

    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1), 0)
    const tax = subtotal * 0.0 // Assuming 10% tax
    const total = subtotal + tax

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (00%):</span>
                        <span>৳{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>৳{total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
```

# components/ClientLayout.js

```js
'use client'

import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Providers } from '@/components/Providers'

export function ClientLayout({ children }) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
    </Providers>
  )
}

```

# components/ClientToastProvider.js

```js
"use client"

import { ToastProvider } from '@/components/ui/toast'
import { ToastContext } from '@/components/ui/toast'
import { useState, useCallback } from 'react'

export default function ClientToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, action, ...props }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, action, ...props },
    ])
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      <ToastProvider>
        {children}
        {/* Render toasts here */}
      </ToastProvider>
    </ToastContext.Provider>
  )
}

```

# components/ErrorBoundary.js

```js
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
                    <p className="text-xl mb-8">We're sorry for the inconvenience. Please try again later.</p>
                    <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
```

# components/Footer.js

```js
import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-0">© 2024 Pleasure BD. All rights reserved.</p>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-2 sm:space-x-4">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm mb-1 sm:mb-0">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm mb-1 sm:mb-0">Terms of Service</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm mb-1 sm:mb-0">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm mb-1 sm:mb-0">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

```

# components/FormInput.js

```js
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FormInput = ({ label, id, ...props }) => {
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} {...props} />
        </div>
    )
}

export default FormInput

```

# components/Header.js

```js
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'

export default function Header() {
    const { data: session } = useSession()
    const { cart } = useCart()

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-gray-800">Pleasure BD</Link>
                    <div className="flex items-center">
                        <Link href="/products" className="text-gray-600 hover:text-gray-900 px-3 py-2">Products</Link>
                        <Link href="/cart" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                            Cart ({cart.length})
                        </Link>
                        {session ? (
                            <>
                                <Link href="/account" className="text-gray-600 hover:text-gray-900 px-3 py-2">Account</Link>
                                <Button onClick={() => signOut()} variant="outline" className="ml-3">Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2">Login</Link>
                                <Link href="/register" className="text-gray-600 hover:text-gray-900 px-3 py-2">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

```

# components/Navbar.js

```js
'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Menu, X } from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const { cart, getCartItemCount } = useCart()
    const [cartItemCount, setCartItemCount] = useState(0)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        setCartItemCount(getCartItemCount())
    }, [cart, getCartItemCount])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="font-semibold text-foreground text-lg">Pleasure BD</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <Link href="/" className="py-2 px-3 text-foreground hover:text-primary transition duration-300">Home</Link>
                        <Link href="/products" className="py-2 px-3 text-foreground hover:text-primary transition duration-300">Products</Link>
                        <Link href="/about" className="py-2 px-3 text-foreground hover:text-primary transition duration-300">About</Link>
                        <Link href="/contact" className="py-2 px-3 text-foreground hover:text-primary transition duration-300">Contact</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-3">
                        <Button asChild variant="outline" className="relative">
                            <Link href="/cart" className="flex items-center">
                                <ShoppingCart className="h-5 w-5 mr-1" />
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            </Link>
                        </Button>
                        {session ? (
                            <>
                                <Button asChild variant="outline">
                                    <Link href="/account">Account</Link>
                                </Button>
                                <Button asChild>
                                    <Link href="/api/auth/signout">Sign Out</Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button asChild>
                                    <Link href="/api/auth/signin">Sign In</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/register">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <Button asChild variant="outline" className="relative mr-2">
                            <Link href="/cart" className="flex items-center">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            </Link>
                        </Button>
                        <button onClick={toggleMenu} className="text-foreground focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <Link href="/" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Home</Link>
                        <Link href="/products" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Products</Link>
                        <Link href="/about" className="block py-2 px-4 text-sm text-foreground hover:text-primary">About</Link>
                        <Link href="/contact" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Contact</Link>
                        {session ? (
                            <>
                                <Link href="/account" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Account</Link>
                                <Link href="/api/auth/signout" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Sign Out</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/api/auth/signin" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Sign In</Link>
                                <Link href="/register" className="block py-2 px-4 text-sm text-foreground hover:text-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

```

# components/OrderDetailsModal.js

```js
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { useToast } from "@/components/ui/toast-context"
import { StatusBadge } from '@/components/StatusBadge'
import { ORDER_STATUSES } from '@/lib/constants'

export default function OrderDetailsModal({ order, isOpen, onClose, isAdmin = false, onStatusUpdate, orderStatuses }) {
    const [status, setStatus] = useState(order?.status || '')
    const { toast } = useToast()

    useEffect(() => {
        if (order) {
            setStatus(order.status || '')
        }
    }, [order])

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
                                    {orderStatuses.map((statusOption) => (
                                        <SelectItem key={statusOption} value={statusOption}>
                                            <StatusBadge status={statusOption} />
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <StatusBadge status={status} />
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="font-bold text-lg mt-4 mb-2 text-gray-900">Shipping Details:</h3>
                        <p><span className="font-semibold">Name:</span> {order.name}</p>
                        <p><span className="font-semibold">Address:</span> {order.shippingAddress}</p>
                        <p><span className="font-semibold">Mobile:</span> {order.mobile}</p>
                        
                        {isAdmin && order.userId && (
                            <>
                                <h3 className="font-bold text-lg mt-4 mb-2 text-gray-900">Customer Details:</h3>
                                <p><span className="font-semibold">Customer ID:</span> {order.userId}</p>
                                <p><span className="font-semibold">Name:</span> {order.name}</p>
                                <p><span className="font-semibold">Email:</span> {order.email}</p>
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
                    </div>
                </DialogDescription>
                <Button onClick={onClose} className="mt-4 w-full">Close</Button>
            </DialogContent>
        </Dialog>
    )
}

```

# components/ProductCard.js

```js
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

```

# components/ProductList.js

```js
import ProductCard from './ProductCard'

export default function ProductList({ products }) {
  console.log('ProductList received products:', products) // Add this line for debugging

  if (!products || !Array.isArray(products) || products.length === 0) {
    return <div className="text-center py-8">No products available.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

```

# components/Providers.js

```js
'use client'

import { SessionProvider } from "next-auth/react"
import { ToastProvider } from '@/components/ui/toast-context'
import { CartProvider } from '@/contexts/CartContext'

export function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </SessionProvider>
  )
}

```

# components/ReviewForm.js

```js
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { StarIcon, Loader2 } from 'lucide-react'

export default function ReviewForm({ productId, onSubmit }) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        await onSubmit({ 
            rating, 
            comment, 
            name: isAnonymous ? 'Anonymous' : name, 
            isAnonymous 
        })
        setSubmitting(false)
        setRating(5)
        setComment('')
        setName('')
        setIsAnonymous(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
            </div>
            {!isAnonymous && (
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isAnonymous}
                    />
                </div>
            )}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                />
                <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                    Submit as anonymous
                </label>
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                <Textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>
            <div>
            <p className="text-sm text-gray-600 mb-4">
              You must purchase and receive the product before submitting a review.
              You will find the review submission option in your <span>
                <Link href="/orders" className="text-primary hover:underline">( Order List ) </Link>
              </span> once the product is delivered.
            </p>
            </div>
            <Button type="submit" disabled={submitting}>
                {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    'Submit Review'
                )}
            </Button>
        </form>
    )
}

```

# components/ReviewItem.js

```js
import React from 'react'

export default function ReviewItem({ review }) {
    return (
        <div className="border-b py-4">
            <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{review.name || 'Anonymous'}</span>
                <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
            </div>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500 mt-1">
                {new Date(review.createdAt).toLocaleDateString()}
            </p>
        </div>
    )
}

```

# components/Reviews.js

```js
'use client';

import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';

export default function Reviews({ productId, initialReviews = [] }) {
    const [reviews, setReviews] = useState(initialReviews);

    useEffect(() => {
        if (Array.isArray(initialReviews)) {
            setReviews(initialReviews);
        } else {
            console.error('initialReviews is not an array:', initialReviews);
            setReviews([]);
        }
    }, [initialReviews]);

    return (
        <div>
            <h2>Customer Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewItem key={review._id} review={review} />
                ))
            ) : (
                <p>No reviews yet.</p>
            )}
        </div>
    );
}

```

# components/SafeImage.js

```js
import Image from 'next/image';
import { useState } from 'react';

const SafeImage = ({ src, alt, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleError = () => {
        console.error(`Failed to load image: ${src}`);
        setImageSrc('/images/placeholder.jpg'); // Replace with your placeholder image path
    };

    return (
        <Image
            src={imageSrc}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;

```

# components/SearchFilter.js

```js
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function SearchFilter({ categories, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const handleSearch = () => {
    onSearch({ searchTerm, category: selectedCategory })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow"
      />
      <Select
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="w-full sm:w-48"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  )
}
```

# components/StatusBadge.js

```js
import React from 'react'
import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }) {
    let variant = 'default'
    switch (status.toLowerCase()) {
        case 'pending':
            variant = 'pending'
            break
        case 'processing':
            variant = 'processing'
            break
        case 'shipped':
            variant = 'info'
            break
        case 'delivered':
            variant = 'success'
            break
        case 'cancelled':
            variant = 'destructive'
            break
    }

    return (
        <Badge variant={variant}>{status}</Badge>
    )
}

```

# components/ui/badge.jsx

```jsx
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        pending:
          "border-transparent bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
        processing:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

```

# components/ui/button.js

```js
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-pink-500 text-white hover:bg-pink-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

```

# components/ui/card.js

```js
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

```

# components/ui/card.jsx

```jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

# components/ui/checkbox.jsx

```jsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

```

# components/ui/dialog.jsx

```jsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}>
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

# components/ui/input.js

```js
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

```

# components/ui/label.jsx

```jsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

# components/ui/select.js

```js
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn("p-1", position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}

```

# components/ui/select.jsx

```jsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}

```

# components/ui/table.jsx

```jsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-primary font-medium text-primary-foreground", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

```

# components/ui/tabs.jsx

```jsx
import React, { useState } from 'react';

export function Tabs({ children, defaultValue }) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    
    // Create a context object containing both the active tab and setter
    const tabsContent = React.Children.map(children, child => {
        // Only clone and pass props to valid React elements
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                activeTab,
                onTabChange: setActiveTab
            });
        }
        return child;
    });

    return <div>{tabsContent}</div>;
}

export function TabsList({ children, activeTab, onTabChange }) {
    // Pass down activeTab and onTabChange to TabsTrigger children
    const triggers = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                activeTab,
                onTabChange
            });
        }
        return child;
    });

    return <div className="flex space-x-4">{triggers}</div>;
}

export function TabsTrigger({ value, children, activeTab, onTabChange }) {
    return (
        <button
            className={`px-4 py-2 ${activeTab === value ? 'bg-gray-200' : ''}`}
            onClick={() => onTabChange(value)}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, activeTab }) {
    return activeTab === value ? <div>{children}</div> : null;
}
```

# components/ui/textarea.jsx

```jsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

```

# components/ui/toast-context.js

```js
"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { ToastProvider as RadixToastProvider } from './toast'
import { Toaster } from './Toaster'

const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...toast }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback((props) => {
    addToast(props)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toast, removeToast, toasts }}>
      <RadixToastProvider>
        {children}
        <Toaster />
      </RadixToastProvider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

```

# components/ui/toast.js

```js
"use client"

import React, { useEffect } from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

```

# components/ui/Toaster.js

```js
"use client"

import { useToast } from "./toast-context"
import { Toast, ToastClose, ToastDescription, ToastTitle, ToastViewport } from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastViewport>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
    </ToastViewport>
  )
}

```

# contexts/CartContext.js

```js
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                setCart(JSON.parse(savedCart))
            }
            setIsLoading(false)
        }
        loadCart()
    }, [])

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart, isLoading])

    const addToCart = useCallback((product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id)
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            } else {
                return [...prevCart, { ...product, quantity }]
            }
        })
    }, [])

    const updateQuantity = useCallback((productId, quantity) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === productId ? { ...item, quantity } : item
            )
        )
    }, [])

    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId))
    }, [])

    const clearCart = useCallback(() => {
        setCart([])
        localStorage.removeItem('cart')
    }, [])

    const getCartItemCount = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }, [cart])

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0)
    }, [cart])

    const value = {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
        isLoading
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

```

# create-admin.js

```js
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpassword123';

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create new admin user
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new User({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            isAdmin: true
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdminUser();

```

# Fresh Copy V1.zip

This is a binary file of the type: Compressed Archive

# hooks/useForceUpdate.js

```js
import { useState, useCallback, useEffect } from 'react'

export function useForceUpdate() {
  const [, setTick] = useState(0)
  const update = useCallback(() => {
    setTick(tick => tick + 1)
  }, [])
  return update
}

export function useCartUpdate(cart) {
  const forceUpdate = useForceUpdate()
  
  useEffect(() => {
    forceUpdate()
  }, [cart, forceUpdate])
}

```

# jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}

```

# lib/constants.js

```js
export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// Add any other constants that might be needed across the application

```

# lib/data.js

```js
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function fetchProduct(id) {
  const client = await clientPromise;
  const db = client.db('your_database_name');
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return product;
}

export async function fetchReviews(productId) {
  const client = await clientPromise;
  const db = client.db('your_database_name');
  const reviews = await db.collection('reviews').find({ product_id: new ObjectId(productId) }).toArray();
  return reviews;
}

```

# lib/mailer.js

```js
import nodemailer from 'nodemailer'
import { formatCurrency } from '@/lib/utils'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
};

// Verify SMTP connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP connection is ready to take our messages');
  }
});

function logSmtpConfig() {
  console.log('SMTP Configuration:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
  });
}

export async function sendOrderConfirmationEmail(order) {
  try {
    logSmtpConfig();
    const message = {
      from: process.env.SMTP_FROM,
      to: order.email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order #${order._id} has been received and is being processed.</p>
        <h2>Order Details:</h2>
        <ul>
          ${order.items.map(item => `<li>${item.name} - ${formatCurrency(item.price)} x ${item.quantity}</li>`).join('')}
        </ul>
        <p><strong>Total: ${formatCurrency(order.total)}</strong></p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress || 'Not provided'}</p>
        <p>We'll notify you when your order has been shipped.</p>
      `,
    }

    await transporter.sendMail(message)
    console.log('Order confirmation email sent successfully')
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error;
  }
}

export async function sendAdminOrderNotificationEmail(order) {
  try {
    logSmtpConfig();
    const message = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received - Order #${order._id}`,
      html: `
        <h1>New Order Received</h1>
        <p>A new order has been placed. Order details are as follows:</p>
        <h2>Order #${order._id}</h2>
        <p><strong>Customer:</strong> ${order.name} (${order.email || 'Guest'})</p>
        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <h3>Items:</h3>
        <ul>
          ${order.items.map(item => `<li>${item.name} - ${formatCurrency(item.price)} x ${item.quantity}</li>`).join('')}
        </ul>
        <p><strong>Total: ${formatCurrency(order.total)}</strong></p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${order.mobile}</p>
        <p>Please log in to the admin panel to process this order.</p>
      `,
    }

    await transporter.sendMail(message)
    console.log('Admin order notification email sent successfully')
  } catch (error) {
    console.error('Error sending admin order notification email:', error)
    throw error;
  }
}

```

# lib/mongodb.js

```js
import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

const uri = process.env.MONGODB_URI
const dbName = 'pleasurebd' // Explicitly set the database name

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

async function connect() {
  try {
    if (client) {
      return client
    }
    client = new MongoClient(uri, options)
    await client.connect()
    console.log('Connected to MongoDB')
    return client
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  clientPromise = connect()
}

export async function getDatabase() {
  try {
    const client = await clientPromise
    return client.db(dbName) // Use the specified database name
  } catch (error) {
    console.error('Error getting database:', error)
    throw error
  }
}

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      ...options,
      dbName: dbName // Specify the database name for Mongoose
    })
    console.log('Connected to MongoDB via Mongoose')
    return mongoose.connection.db
  } catch (error) {
    console.error('Failed to connect to MongoDB via Mongoose:', error)
    throw error
  }
}

export { clientPromise }

// Export an object with all functions for backwards compatibility
export default { dbConnect, getDatabase, clientPromise }

```

# lib/utils.js

```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    return '৳0.00';
  }
  return `৳${amount.toFixed(2)}`;
}

```

# middleware.js

```js
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const token = await getToken({ req: request })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return null
  }

  if (!isAuth && !request.nextUrl.pathname.startsWith('/checkout')) {
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/orders/:path*', '/login', '/register']
}

```

# middleware/auth.js

```js
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'Please log in to view this resource');
    res.redirect('/login');
  },
  ensureAdmin: function(req, res, next) {
    if (req.user && req.user.isAdmin) {
      return next();
    }
    req.flash('error', 'You do not have permission to view this resource');
    res.redirect('/dashboard');
  }
};

```

# models/Order.js

```js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String }
    }],
    total: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

```

# models/Product.js

```js
import { Schema, model, models } from 'mongoose';

const ReviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { 
        type: Number, 
        required: true,
        set: v => parseFloat(v).toFixed(2)  // Ensure price is always stored with 2 decimal places
    },
    image: { type: String, required: true },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    stock: { type: Number, required: true, default: 0 },
    reviews: [ReviewSchema],
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;

// Export a function to create a product object compatible with MongoDB driver
export function createProductObject(data) {
    return {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price).toFixed(2),
        image: data.image,
        category: data.category,
        featured: data.featured === true || data.featured === 'true',
        stock: parseInt(data.stock) || 0,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

```

# models/Setting.js

```js
import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);

```

# models/Settings.js

```js
import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

```

# models/User.js

```js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);

```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'pleasurebd.com'],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                punycode: false,
            };
        }
        return config;
    },
}

module.exports = nextConfig

```

# package.json

```json
{
  "name": "pleasure-bd",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "update-legacy-images": "curl -X POST http://localhost:3000/api/update-legacy-images",
    "lint:css": "stylelint '**/*.css'",
    "lint:css:fix": "stylelint '**/*.css' --fix",
    "test-db": "node --require dotenv/config test-db-connection.js",
    "migrate-product-reviews": "node scripts/migrateProductReviews.js"
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.2",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.6.1",
    "clsx": "^1.2.1",
    "crypto-browserify": "^3.12.1",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.244.0",
    "mongodb": "^5.7.0",
    "mongoose": "^7.8.2",
    "next": "^13.4.19",
    "next-auth": "^4.24.8",
    "nodemailer": "^6.9.15",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-pro-sidebar": "^1.1.0",
    "recharts": "^2.13.0",
    "tailwind-merge": "^1.14.0",
    "tailwindcss": "^3.3.2",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "eslint": "8.43.0",
    "eslint-config-next": "13.4.7",
    "postcss": "^8.4.47",
    "postcss-nesting": "^13.0.0",
    "stylelint": "^15.11.0",
    "stylelint-config-standard": "^34.0.0",
    "stylelint-config-tailwindcss": "^0.0.7"
  }
}

```

# postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# public/images/0d2bb184-71ac-4e5b-8be7-76a004f38b65.webp

This is a binary file of the type: Image

# public/images/1af0271b-8a3a-4ed1-a4d5-d5813336cb9d.webp

This is a binary file of the type: Image

# public/images/1ce4eb22-de12-47c1-a816-43eab0a06ba1.webp

This is a binary file of the type: Image

# public/images/7f4739ef-d3f5-4d37-9698-cb738d5be790.webp

This is a binary file of the type: Image

# public/images/08fec875-9aff-4558-880d-01688cf943df.webp

This is a binary file of the type: Image

# public/images/10c89f1d-eb3a-4482-8340-40dab6bc2c0c.webp

This is a binary file of the type: Image

# public/images/80596bb2-d853-41eb-94e5-c3a967ab7854.jpg

This is a binary file of the type: Image

# public/images/1729499819702-shoes.webp

This is a binary file of the type: Image

# public/images/1729500183944-ring light.webp

This is a binary file of the type: Image

# public/images/1729505903263-2bc2c4028c185f71e8c0b4e520187b29.jpg_720x720q80.jpg_.webp

This is a binary file of the type: Image

# public/images/1729516350561-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp

This is a binary file of the type: Image

# public/images/1729630027851-9fa427c9a9fbf9af41377f0895ff02cf.jpg_720x720q80.jpg_.webp

This is a binary file of the type: Image

# public/images/1729636600720-1f551943e2ee4eabd92986569c14f577.jpg_720x720q80.jpg_.webp

This is a binary file of the type: Image

# public/images/hero-bg.png

This is a binary file of the type: Image

# public/images/placeholder.jpg

This is a binary file of the type: Image

# public/images/placeholder.png

This is a binary file of the type: Image

# Review System Fixed.zip

This is a binary file of the type: Compressed Archive

# routes/auth.js

```js
const User = require('../models/User');

router.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'You have successfully logged in.');
      // Check if the user is an admin and redirect accordingly
      if (user.isAdmin) {
        return res.redirect('/admin');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/aspect-ratio'),
  ],
}

```

# test-db-connection.js

```js
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load environment variables
if (fs.existsSync(path.join(__dirname, '.env.local'))) {
  require('dotenv').config({ path: '.env.local' });
} else {
  console.warn('Warning: .env.local file not found. Make sure your MongoDB URI is set in the environment.');
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = 'pleasurebd'; // Explicitly set the database name

  if (!uri) {
    console.error('Error: MONGODB_URI is not set in the environment variables.');
    process.exit(1);
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB');
    const db = client.db(dbName); // Use the specified database name
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    await client.close();
  }
}

testConnection();

```

