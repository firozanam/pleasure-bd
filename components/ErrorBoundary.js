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