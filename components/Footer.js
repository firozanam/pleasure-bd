import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">© 2023 Pleasure BD. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
