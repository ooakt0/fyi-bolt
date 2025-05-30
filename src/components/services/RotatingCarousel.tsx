import React, { useState, useEffect } from 'react';

/**
 * RotatingCarousel Component
 *
 * A 3D rotating carousel for displaying images with optional auto-rotation.
 *
 * Props:
 * - images: { src: string; alt: string; title?: string }[] - List of images to display.
 * - autoRotateInterval?: number - Interval in milliseconds for auto-rotation (default: 3000ms).
 *
 * Usage:
 * <RotatingCarousel
 *   images={[
 *     { src: '/images/static-web-1.png', alt: 'Landing page design' },
 *     { src: '/images/static-web-2.png', alt: 'E-commerce sample' },
 *   ]}
 * />
 */

interface ImageProps {
  src: string;
  alt: string;
  title?: string;
}

interface RotatingCarouselProps {
  images: ImageProps[];
  autoRotateInterval?: number;
}

const RotatingCarousel: React.FC<RotatingCarouselProps> = ({
  images,
  autoRotateInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoRotateInterval);
      return () => clearInterval(interval);
    }
  }, [isHovered, autoRotateInterval, images.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div
      className="relative w-full max-w-3xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 perspective-1000">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          style={{
            transform: `rotateY(${currentIndex * -90}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s ease-in-out',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute w-64 h-64 bg-cover bg-center rounded-lg shadow-lg"
              style={{
                backgroundImage: `url(${image.src})`,
                transform: `rotateY(${index * 90}deg) translateZ(300px)`,
              }}
            >
              <span className="sr-only">{image.alt}</span>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <button
          onClick={handlePrev}
          className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          &lt;
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <button
          onClick={handleNext}
          className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          &gt;
        </button>
      </div> */}
    </div>
  );
};

export default RotatingCarousel;
