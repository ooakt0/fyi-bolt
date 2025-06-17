import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { ImageMetadata } from '../../types/imageTypes';
import S3Image from './S3Image';

interface ScrollableGalleryProps {
  images: ImageMetadata[];
  onImageClick: (image: ImageMetadata) => void;
  isCreator: boolean;
  onTogglePrivacy?: (image: ImageMetadata) => void;
  onDeleteImage?: (imageId: string) => void;
}

const ScrollableGallery: React.FC<ScrollableGalleryProps> = ({
  images,
  onImageClick,
  isCreator,
  onTogglePrivacy,
  onDeleteImage
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // Check if scroll arrows should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    };
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScroll();
      scrollContainer.addEventListener('scroll', checkScroll);
      
      // Initial check if right arrow is needed
      setShowRightArrow(scrollContainer.scrollWidth > scrollContainer.clientWidth);
      
      return () => scrollContainer.removeEventListener('scroll', checkScroll);
    }
  }, [images]);
  
  // Handle scroll button clicks
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75; // Scroll 75% of the view width

    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="relative">
      {/* Left scroll indicator */}
      {showLeftArrow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute left-0 top-0 bottom-0 flex items-center z-10"
        >
          <button 
            onClick={() => handleScroll('left')}
            className="h-10 w-10 ml-1 flex items-center justify-center bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
        </motion.div>
      )}
      
      {/* Right scroll indicator */}
      {showRightArrow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute right-0 top-0 bottom-0 flex items-center z-10"
        >
          <button 
            onClick={() => handleScroll('right')}
            className="h-10 w-10 mr-1 flex items-center justify-center bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
        {/* Image scroll container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
      >
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="relative aspect-square group flex-shrink-0"
            style={{ width: 'calc(25% - 12px)', minWidth: '180px', maxWidth: '250px' }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity z-10 rounded-lg pointer-events-none" />
            
            {/* Image */}
            <div
              className="w-full h-full cursor-pointer rounded-lg overflow-hidden"
              onClick={() => onImageClick(image)}
            >
              <S3Image
                src={image.image_url}
                isPrivate={image.is_private}
                className="w-full h-full rounded-lg object-cover"
                alt={image.caption || "Image"}
              />
            </div>
            
            {/* Creator controls - shown on hover */}
            {isCreator && onTogglePrivacy && onDeleteImage && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity z-20">
                {/* Privacy toggle button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePrivacy(image);
                  }}
                  className={`
                    p-2 rounded-full backdrop-blur-sm
                    ${image.is_private 
                      ? 'bg-yellow-500/50 text-yellow-100' 
                      : 'bg-green-500/50 text-green-100'}
                  `}
                >
                  {image.is_private ? "🔒" : "🔓"}
                </button>
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteImage(image.id);
                  }}
                  className="p-2 rounded-full backdrop-blur-sm bg-red-500/50 text-red-100"
                >
                  🗑️
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
        {/* Scrollbar is hidden via CSS in the parent component */}
    </div>
  );
};

export default ScrollableGallery;
