import { StarIcon } from 'lucide-react'

export default function Reviews({ initialReviews }) {
    return (
        <div className="space-y-4">
            {initialReviews.length === 0 ? (
                <p>No reviews yet.</p>
            ) : (
                initialReviews.map((review, index) => (
                    <div key={index} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="font-semibold">{review.name}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                    </div>
                ))
            )}
        </div>
    )
}
