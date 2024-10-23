'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from "@/components/ui/toast-context"
import { Loader2 } from 'lucide-react'

export default function AccountPage() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const { data: session, status } = useSession()
    const { toast } = useToast()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user')
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`)
                }
                const data = await response.json()
                setUserData(data)
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

        if (status === 'authenticated') {
            fetchUserData()
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
    }, [status, toast])

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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Account Page</h1>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {/* Add more user data fields as needed */}
        </div>
    )
}
