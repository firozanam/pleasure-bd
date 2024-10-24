import React from 'react'

export const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        const normalizedStatus = (status || 'pending').toLowerCase();
        switch (normalizedStatus) {
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
            {status || 'Pending'}
        </span>
    )
}
