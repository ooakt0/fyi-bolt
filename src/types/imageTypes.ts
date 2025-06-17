export interface ImageMetadata {
  id: string;
  idea_id: string;
  image_url: string;
  file_name: string;
  content_type: string;
  size_in_bytes: number;
  is_private: boolean;
  caption: string;
  aspect_ratio: string; // 'square', '16:9', '4:3', 'portrait', 'landscape', 'default'
  storage_provider: string; // 'aws_s3' or other future providers
  created_at: string;
  updated_at: string;
}

export interface ImageUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface ImageUploadResult {
  success: boolean;
  image?: ImageMetadata;
  error?: string;
}

export interface ImageDisplayOptions {
  quality?: 'low' | 'medium' | 'high' | 'auto';
  priority?: boolean;
  placeholderColor?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  alt?: string;
  showLoadingEffect?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}
