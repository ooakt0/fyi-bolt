import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../../services/imageService';
import { ImageUploadResult } from '../../types/imageTypes';
import log from '../../utils/logger';

interface ImageUploaderProps {
  ideaId: string;
  ideaName: string;
  onUploadComplete?: (result: ImageUploadResult) => void;
  aspectRatio?: string;
  isPrivate?: boolean;
  caption?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  ideaId,
  ideaName,
  onUploadComplete,
  aspectRatio = 'default',
  isPrivate = false,
  caption = '',
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  // Simulated progress bar
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (isUploading) {
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          // Slow down as we get closer to 90%
          const increment = prev < 30 ? 10 : prev < 60 ? 5 : prev < 90 ? 2 : 0;
          return Math.min(prev + increment, 90);
        });
      }, 300);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isUploading]);

  const resetState = () => {
    setIsDragging(false);
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setPreviewUrl(null);
  };
  
  const validateFile = (file: File): string | null => {
    if (!file) return 'No file selected';
    
    if (!acceptedFormats.includes(file.type)) {
      return `Unsupported file format. Please upload: ${acceptedFormats.join(', ')}`;
    }
    
    if (file.size > maxSizeBytes) {
      return `File is too large. Maximum size is ${maxSizeMB}MB`;
    }
    
    return null;
  };
  
  const processFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadComplete) {
        onUploadComplete({ success: false, error: validationError });
      }
      return;
    }
    
    // Create preview
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    
    try {
      setIsUploading(true);
      setError(null);
      
      const uploadedImage = await uploadImage({
        ideaId,
        ideaName,
        file,
        isPrivate,
        caption: caption || file.name,
        aspectRatio
      });
      
      // Complete the progress bar
      setUploadProgress(100);
      
      // Delay to show the completed progress
      setTimeout(() => {
        setIsUploading(false);
        if (onUploadComplete) {
          onUploadComplete({ success: true, image: uploadedImage });
        }
        resetState();
      }, 500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      log.error('Image upload error', {
        action: 'ImageUploader.processFile',
        error: err,
        ideaId,
        fileName: file.name,
      });
      
      setError(errorMessage);
      setIsUploading(false);
      if (onUploadComplete) {
        onUploadComplete({ success: false, error: errorMessage });
      }
    } finally {
      // Cleanup the object URL to avoid memory leaks
      setTimeout(() => {
        URL.revokeObjectURL(objUrl);
      }, 1000);
    }
  };
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [ideaId, ideaName, isPrivate, caption, aspectRatio]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleCancelUpload = () => {
    resetState();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      {/* Drag and drop area or preview */}
      <div
        className={`
          border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : isUploading 
              ? 'border-blue-400/40 bg-blue-500/5' 
              : error 
                ? 'border-red-500/40 bg-red-500/5' 
                : 'border-white/20 hover:border-blue-400/40 hover:bg-white/5'
          }
          ${previewUrl ? 'p-0' : 'p-10'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isUploading && !previewUrl ? handleButtonClick : undefined}
        style={{ cursor: isUploading ? 'default' : 'pointer' }}
      >
        {previewUrl ? (
          <div className="relative w-full h-full aspect-square">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            {!isUploading && (
              <motion.button
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                onClick={handleCancelUpload}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              className={`
                w-16 h-16 mb-4 flex items-center justify-center rounded-full
                ${isDragging 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : error 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-white/10 text-gray-400'
                }
              `}
              animate={isDragging ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
            >
              {error ? (
                <X size={24} className="text-red-400" />
              ) : (
                <Upload size={24} />
              )}
            </motion.div>
            
            {error ? (
              <div>
                <p className="text-red-400 font-medium mb-1">Upload Error</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            ) : isDragging ? (
              <p className="text-blue-400 font-medium">Drop image to upload</p>
            ) : (
              <>
                <p className="text-white font-medium mb-1">
                  Drop image here or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supports: {acceptedFormats.map(f => f.replace('image/', '')).join(', ')}
                  &nbsp;(Max: {maxSizeMB}MB)
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Upload progress overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-[80%] mb-4">
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ type: 'tween', ease: 'easeOut' }}
                />
              </div>
            </div>
            <p className="text-white">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
