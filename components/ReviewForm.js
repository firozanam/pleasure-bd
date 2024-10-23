'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast-context'
import { StarIcon } from 'lucide-react'

export default function ReviewForm({ productId, onReviewAdded }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (rating === 0) {
            toast({
                title: "Error",
                description: "Please select a rating",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment, name }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit review')
            }

            const data = await response.json()
            toast({
                title: "Success",
                description: "Your review has been submitted",
            })
            setRating(0)
            setComment('')
            setName('')
            if (onReviewAdded) {
                onReviewAdded(data.review)
            }
        } catch (error) {
            console.error('Error submitting review:', error)
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
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
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    )
}
