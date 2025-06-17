import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Lock, Unlock, Trash2, X } from 'lucide-react';
import { getIdeaImages, deleteImage, toggleImagePrivacy } from '../../services/imageService';
import { ImageMetadata, ImageUploadResult } from '../../types/imageTypes';
import S3Image from './S3Image';
import ImageUploader from './ImageUploader';
import log from '../../utils/logger';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import required modules
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
// Import custom Swiper styles
import './swiper-gallery.css';

interface IdeaGalleryProps {
  ideaId: string;
  ideaName: string;
  isCreator: boolean;
  className?: string;
}

const IdeaGallery: React.FC<IdeaGalleryProps> = ({
  ideaId,
  ideaName,
  isCreator,
  className = ''
}) => {  
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const swiperRef = useRef<any>(null);
  
  useEffect(() => {
    fetchImages();
  }, [ideaId]);
  
  // Update Swiper when images change
  useEffect(() => {
    if (swiperRef.current && !loading) {
      // Need to update Swiper after images change
      setTimeout(() => {
        swiperRef.current.update();
      }, 100);
    }
  }, [images, loading]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedImages = await getIdeaImages(ideaId);
      setImages(fetchedImages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load images';
      setError(message);
      log.error('Failed to fetch images', {
        action: 'IdeaGallery.fetchImages',
        error: err,
        ideaId
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (result: ImageUploadResult) => {
    if (result.success && result.image) {
      // Add the new image to the list
      setImages(prev => [result.image!, ...prev]);
      setIsUploadOpen(false);
    } else if (result.error) {
      // Error is already shown in the uploader component
      console.error('Upload failed:', result.error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }    try {
      await deleteImage(imageId);
      setImages(images.filter(img => img.id !== imageId));

      // If the deleted image was selected in lightbox, close it
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
        setIsLightboxOpen(false);
      }
    } catch (err) {
      log.error('Failed to delete image', {
        action: 'IdeaGallery.handleDeleteImage',
        error: err,
        imageId,
        ideaId
      });
    }
  };
  const handleTogglePrivacy = async (image: ImageMetadata) => {
    try {
      const updatedImage = await toggleImagePrivacy(image.id);
      setImages(images.map(img => img.id === updatedImage.id ? updatedImage : img));

      // If the toggled image is selected in lightbox, update it
      if (selectedImage?.id === image.id) {
        setSelectedImage(updatedImage);
      }
    } catch (err) {
      log.error('Failed to toggle image privacy', {
        action: 'IdeaGallery.handleTogglePrivacy',
        error: err,
        imageId: image.id,
        ideaId
      });
    }
  };
  const handleOpenLightbox = (image: ImageMetadata) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };  const handleCloseLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);
  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (!selectedImage) return;
    
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= images.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(images[newIndex]);
  }, [selectedImage, images]);
  // Add keyboard support for lightbox navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle keyboard navigation for both lightbox and swiper
      if (isLightboxOpen) {
        switch (event.key) {
          case 'Escape':
            handleCloseLightbox();
            break;
          case 'ArrowLeft':
            navigateLightbox('prev');
            break;
          case 'ArrowRight':
            navigateLightbox('next');
            break;
        }
      } else if (swiperRef.current && !loading && images.length > 0) {
        // Navigate swiper when not in lightbox
        switch (event.key) {
          case 'ArrowLeft':
            swiperRef.current.slidePrev();
            break;
          case 'ArrowRight':
            swiperRef.current.slideNext();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, navigateLightbox, handleCloseLightbox, images, loading]);

  // Only show non-private images for non-creators
  const visibleImages = isCreator 
    ? images 
    : images.filter(img => !img.is_private);

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-white">Gallery</h3>
        {isCreator && (
          <motion.button
            onClick={() => setIsUploadOpen(!isUploadOpen)}
            className={`
              px-4 py-2 rounded-lg flex items-center
              ${isUploadOpen 
                ? 'bg-purple-500/30 text-purple-300' 
                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isUploadOpen ? 'Cancel' : 'Add Image'}
          </motion.button>
        )}
      </div>

      {/* Upload area */}
      <AnimatePresence>
        {isCreator && isUploadOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <ImageUploader
              ideaId={ideaId}
              ideaName={ideaName}
              onUploadComplete={handleUploadComplete}
              className="max-w-sm mx-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading/Error states */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Image Grid */}
      {!loading && !error && visibleImages.length === 0 && (
        <div className="text-center py-8 border border-white/10 rounded-lg bg-white/5">
          <p className="text-gray-400">No images yet</p>
        </div>
      )}      {!loading && !error && visibleImages.length > 0 && (        <div className="swiper-gallery-container">          <Swiper
            modules={[Navigation, Pagination, EffectCoverflow]}
            spaceBetween={20}
            slidesPerView={'auto'}
            centeredSlides={visibleImages.length > 2}
            loop={visibleImages.length > 3}
            grabCursor={true}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 50, // Reduced depth
              modifier: 0.8, // Reduced modifier for less extreme effect
              slideShadows: false,
            }}
            watchSlidesProgress={true} // Improve tracking of slide positions
            preventClicks={false} // Still allow clicks on slides
            slideToClickedSlide={true} // Navigate to clicked slide
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="swiper-gallery"
          >
            {visibleImages.map((image) => (
              <SwiperSlide key={image.id} className="swiper-slide-custom">
                <motion.div
                  className="relative aspect-square group rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Background for hover controls */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity z-10 rounded-lg pointer-events-none" />
                  
                  {/* Image */}
                  <div
                    className="w-full h-full cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => handleOpenLightbox(image)}
                  >
                    <S3Image
                      src={image.image_url}
                      isPrivate={image.is_private}
                      className="w-full h-full rounded-lg object-cover"
                      alt={image.caption || "Image"}
                    />
                  </div>
                  
                  {/* Image controls for creator */}
                  {isCreator && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity z-20">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePrivacy(image);
                        }}
                        className={`
                          p-2 rounded-full backdrop-blur-sm
                          ${image.is_private 
                            ? 'bg-yellow-500/50 text-yellow-100' 
                            : 'bg-green-500/50 text-green-100'}
                        `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {image.is_private ? <Lock size={14} /> : <Unlock size={14} />}
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        className="p-2 rounded-full backdrop-blur-sm bg-red-500/50 text-red-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom navigation buttons */}
          <div className="swiper-button-prev custom-swiper-button-prev bg-blue-500/20 backdrop-blur-sm"></div>
          <div className="swiper-button-next custom-swiper-button-next bg-blue-500/20 backdrop-blur-sm"></div>
        </div>
      )}{/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={handleCloseLightbox}
            style={{
              backdropFilter: 'blur(5px)',
            }}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white z-[60] border border-white/10"
              onClick={handleCloseLightbox}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </motion.button>
            
            {/* Navigation buttons */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white z-[60] border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9, rotate: -5 }}
            >
              ←
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-black/50 text-white z-[60] border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              whileTap={{ scale: 0.9, rotate: 5 }}
            >
              →
            </motion.button>
            
            {/* Image container - centered with flexbox */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="relative z-[55] max-w-[95vw] max-h-[95vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >              
              <motion.div 
                className="relative group overflow-hidden rounded-lg shadow-2xl"
                whileHover={{ scale: 0.98 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <S3Image
                  src={selectedImage.image_url}
                  isPrivate={selectedImage.is_private}
                  className="max-w-full max-h-[80vh] object-contain"
                  objectFit="contain"
                  alt={selectedImage.caption}
                  onClick={handleCloseLightbox}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4"
              >
                <h3 className="text-white text-lg">{selectedImage.caption}</h3>
                <div className="mt-2 flex flex-col items-center">
                  {selectedImage.is_private && (
                    <p className="text-yellow-400 text-sm flex items-center justify-center">
                      <Lock size={14} className="mr-1" />
                      Private Image
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">Click image to close</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdeaGallery;
