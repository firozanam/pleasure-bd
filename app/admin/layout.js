'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react'

export default function AdminLayout({ children }) {
    const pathname = usePathname()

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
        { name: 'Home Setting', icon: <Package size={20} />, path: '/admin/home-settings' },
        { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
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
