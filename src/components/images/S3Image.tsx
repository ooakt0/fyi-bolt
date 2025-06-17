import React, { useState, useEffect } from 'react';
import { getImageSignedUrl } from '../../services/imageService';
import { ImageDisplayOptions } from '../../types/imageTypes';
import log from '../../utils/logger';

interface S3ImageProps extends ImageDisplayOptions {
  src: string;
  isPrivate?: boolean;
  fallbackSrc?: string;
  onClick?: () => void;
}

const S3Image: React.FC<S3ImageProps> = ({
  src,
  isPrivate = false,
  fallbackSrc = '/images/image-placeholder.jpg',
  quality = 'auto',
  priority = false,
  placeholderColor = '#1f2937',
  className = '',
  objectFit = 'cover',
  alt = 'Image',
  showLoadingEffect = true,
  onLoad,
  onError,
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setLoading(true);
    setError(false);

    // If the image is private, we need to fetch a signed URL
    const fetchSignedUrlIfNeeded = async () => {
      if (isPrivate) {
        try {
          const signedUrl = await getImageSignedUrl(src);
          setImageSrc(signedUrl);
        } catch (err) {
          log.error('Failed to fetch signed URL for image', {
            action: 'S3Image.fetchSignedUrlIfNeeded',
            error: err,
            src: src.split('?')[0], // Log URL without query parameters
          });
          setError(true);
        }
      }
    };

    fetchSignedUrlIfNeeded();
  }, [src, isPrivate]);

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };
  const handleError = () => {
    setLoading(false);
    setError(true);
    if (onError) onError();
    
    // Try to get the image with a signed URL regardless of isPrivate setting
    // This handles cases where permissions might have changed
    if (!src.includes('?')) {
      try {
        getImageSignedUrl(src)
          .then(signedUrl => {            log.info('Retrying with signed URL', {
              action: 'S3Image.retryWithSignedUrl',
              url: src.split('?')[0]
            });
            setImageSrc(signedUrl);
            setError(false); // Reset error to try again
          })
          .catch(err => {
            log.error('Failed to get signed URL for retry', {
              action: 'S3Image.retryWithSignedUrl',
              error: err,
              src: src.split('?')[0]
            });
          });
      } catch (err) {
        // Final error, couldn't even get a signed URL
        log.warn('Failed to load image after retry attempt', {
          action: 'S3Image.handleError',
          src: src.split('?')[0], // Log URL without query parameters
        });
      }
    } else {
      // Already using a signed URL or has query params, just log the error
      log.warn('Failed to load image', {
        action: 'S3Image.handleError',
        src: src.split('?')[0], // Log URL without query parameters
      });
    }
  };

  // Create the object-fit class based on the prop
  const objectFitClass = `object-${objectFit}`;

  // Create the loading skeleton style
  const skeletonStyle = {
    backgroundColor: placeholderColor,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as React.CSSProperties;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {loading && showLoadingEffect && (
        <div 
          style={skeletonStyle}
          className="animate-pulse"
        />
      )}      {/* The image */}
      <img
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${objectFitClass} ${loading ? 'opacity-0' : 'opacity-100'} ${onClick ? 'cursor-pointer' : ''}`}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
      />
    </div>
  );
};

export default S3Image;
