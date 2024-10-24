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
