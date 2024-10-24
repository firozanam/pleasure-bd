'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const { cart, getCartItemCount } = useCart()
    const [cartItemCount, setCartItemCount] = useState(0)

    useEffect(() => {
        setCartItemCount(getCartItemCount())
    }, [cart, getCartItemCount])

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between">
                    <div className="flex space-x-7">
                        <div>
                            <Link href="/" className="flex items-center py-4 px-2">
                                <span className="font-semibold text-foreground text-lg">Pleasure BD</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-1">
                            <Link href="/" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">Home</Link>
                            <Link href="/products" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">Products</Link>
                            <Link href="/about" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">About</Link>
                            <Link href="/contact" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">Contact</Link>
                        </div>
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
                </div>
            </div>
        </nav>
    )
}
