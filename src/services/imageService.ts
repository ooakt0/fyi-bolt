import { supabase } from '../store/authStore/supabaseClient';
import { generateUploadUrl, validateFilePath, generateDownloadUrl } from '../utils/s3';
import { uploadFileToS3, getIdeaBasePath } from './fileManager';
import log from '../utils/logger';
import { ImageMetadata } from '../types/imageTypes';

/**
 * Upload an image to S3 and store metadata in Supabase
 */
export async function uploadImage({ 
  ideaId,
  ideaName,
  file,
  isPrivate = false,
  caption = '',
  aspectRatio = 'default'
}: {
  ideaId: string;
  ideaName: string;
  file: File;
  isPrivate?: boolean;
  caption?: string;
  aspectRatio?: string;
}): Promise<ImageMetadata> {
  try {
    log.info('Starting image upload', {
      action: 'uploadImage',
      ideaId,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      isPrivate,
    });    // Get the base path for this idea using the shared helper
    const basePath = getIdeaBasePath(ideaId, ideaName);
    
    // Create a path that includes both ID and name for uniqueness and readability
    const timestamp = Date.now();
    const filePath = `${basePath}/images/${timestamp}-${file.name.replace(/\s+/g, '-')}`;

    if (!validateFilePath(filePath)) {
      throw new Error('Invalid file path');
    }

    // Get pre-signed URL
    const { uploadUrl, fileUrl } = await generateUploadUrl({ 
      filePath,
      contentType: file.type
    });

    // Upload file to S3 using the same function as fileManager
    await uploadFileToS3(uploadUrl, file);

    // Store metadata in Supabase
    const metadata: Omit<ImageMetadata, 'id' | 'created_at' | 'updated_at'> = {
      idea_id: ideaId,
      image_url: fileUrl,
      file_name: file.name,
      content_type: file.type,
      size_in_bytes: file.size,
      is_private: isPrivate,
      caption: caption || file.name,
      aspect_ratio: aspectRatio,
      storage_provider: 'aws_s3',
    };

    const { data, error } = await supabase
      .from('idea_images')
      .insert(metadata)
      .select()
      .single();

    if (error) {
      log.error('Failed to save image metadata', {
        action: 'uploadImage',
        error,
        ideaId,
        fileName: file.name,
      });
      throw error;
    }

    log.info('Successfully uploaded image', {
      action: 'uploadImage',
      ideaId,
      imageId: data.id,
      fileName: file.name,
      fileUrl,
    });

    return data;
  } catch (error) {
    log.error('Image upload failed', {
      action: 'uploadImage',
      error,
      ideaId,
      fileName: file.name,
    });
    throw error;
  }
}

/**
 * Get all images for an idea
 */
export async function getIdeaImages(ideaId: string): Promise<ImageMetadata[]> {
  try {
    log.info('Fetching idea images', {
      action: 'getIdeaImages',
      ideaId,
    });

    const { data, error } = await supabase
      .from('idea_images')
      .select('*')
      .eq('idea_id', ideaId)
      .order('created_at', { ascending: false });

    if (error) {
      log.error('Failed to fetch idea images', {
        action: 'getIdeaImages',
        error,
        ideaId,
      });
      throw error;
    }

    log.info('Successfully fetched idea images', {
      action: 'getIdeaImages',
      ideaId,
      imageCount: data.length,
    });

    return data;
  } catch (error) {
    log.error('Error fetching idea images', {
      action: 'getIdeaImages',
      error,
      ideaId,
    });
    throw error;
  }
}

/**
 * Get a signed URL for a private image
 */
export async function getImageSignedUrl(imageUrl: string): Promise<string> {
  // Skip if it's already a signed URL (contains a query string with signature)
  if (imageUrl.includes('X-Amz-Signature=')) {
    return imageUrl;
  }

  try {
    log.info('Generating signed URL for image', {
      action: 'getImageSignedUrl',
      url: imageUrl.split('?')[0], // Log URL without query parameters
    });

    // Extract the S3 key from the URL
    const s3Key = getS3KeyFromUrl(imageUrl);
    
    // Generate a signed URL for the image
    const signedUrl = await generateDownloadUrl(s3Key);

    log.info('Successfully generated signed URL', {
      action: 'getImageSignedUrl',
      url: imageUrl.split('?')[0],
    });

    return signedUrl;
  } catch (error) {
    log.error('Failed to generate signed URL', {
      action: 'getImageSignedUrl',
      error,
      url: imageUrl.split('?')[0],
    });
    throw error;
  }
}

/**
 * Delete an image from S3 and remove metadata from Supabase
 */
export async function deleteImage(imageId: string): Promise<void> {
  try {
    log.info('Deleting image', {
      action: 'deleteImage',
      imageId,
    });

    // Get the image metadata first
    const { data: image, error: fetchError } = await supabase
      .from('idea_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      log.error('Failed to fetch image metadata for deletion', {
        action: 'deleteImage',
        error: fetchError,
        imageId,
      });
      throw fetchError;
    }

    // Delete from Supabase first
    const { error } = await supabase
      .from('idea_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      log.error('Failed to delete image metadata', {
        action: 'deleteImage',
        error,
        imageId,
      });
      throw error;
    }

    // Note: We're not deleting the actual file from S3 here
    // This could be handled by S3 lifecycle policies or a separate cleanup process
    // as S3 deletion requires additional AWS permissions

    log.info('Successfully deleted image', {
      action: 'deleteImage',
      imageId,
      imageUrl: image.image_url,
    });
  } catch (error) {
    log.error('Error deleting image', {
      action: 'deleteImage',
      error,
      imageId,
    });
    throw error;
  }
}

/**
 * Update image metadata
 */
export async function updateImageMetadata(
  imageId: string,
  updates: Partial<Omit<ImageMetadata, 'id' | 'idea_id' | 'created_at' | 'updated_at'>>
): Promise<ImageMetadata> {
  try {
    log.info('Updating image metadata', {
      action: 'updateImageMetadata',
      imageId,
      updates,
    });

    const { data, error } = await supabase
      .from('idea_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      log.error('Failed to update image metadata', {
        action: 'updateImageMetadata',
        error,
        imageId,
      });
      throw error;
    }

    log.info('Successfully updated image metadata', {
      action: 'updateImageMetadata',
      imageId,
    });

    return data;
  } catch (error) {
    log.error('Error updating image metadata', {
      action: 'updateImageMetadata',
      error,
      imageId,
    });
    throw error;
  }
}

/**
 * Toggle image privacy
 */
export async function toggleImagePrivacy(imageId: string): Promise<ImageMetadata> {
  try {
    log.info('Toggling image privacy', {
      action: 'toggleImagePrivacy',
      imageId,
    });

    // Get current image data
    const { data: currentImage, error: fetchError } = await supabase
      .from('idea_images')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      log.error('Failed to fetch image for privacy toggle', {
        action: 'toggleImagePrivacy',
        error: fetchError,
        imageId,
      });
      throw fetchError;
    }

    // Update to opposite privacy setting
    const { data, error } = await supabase
      .from('idea_images')
      .update({ is_private: !currentImage.is_private })
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      log.error('Failed to toggle image privacy', {
        action: 'toggleImagePrivacy',
        error,
        imageId,
      });
      throw error;
    }

    log.info('Successfully toggled image privacy', {
      action: 'toggleImagePrivacy',
      imageId,
      newPrivacySetting: !currentImage.is_private,
    });

    return data;
  } catch (error) {
    log.error('Error toggling image privacy', {
      action: 'toggleImagePrivacy',
      error,
      imageId,
    });
    throw error;
  }
}

/**
 * Helper: Extract S3 key from a full S3 URL
 * Handles both new path format (idea-files/ID-NAME/images/...)
 * and legacy format (any other path)
 */
function getS3KeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove the leading slash
    let key = urlObj.pathname.substring(1);
    
    // Check if the path follows the expected pattern, if not, try to fix it
    if (!key.startsWith('idea-files/')) {
      // For legacy paths that might have a different structure
      // Just pass through whatever we have - S3 will return a 404 if it doesn't exist
      log.warn(`Found legacy image path pattern: ${key}`, {
        action: 'getS3KeyFromUrl',
        url: url.split('?')[0] // Log URL without query parameters
      });
    } else {
      log.info(`Extracting S3 key: ${key}`, {
        action: 'getS3KeyFromUrl',
        url: url.split('?')[0] // Log URL without query parameters
      });
    }
    
    return key;
  } catch (error) {
    log.error('Invalid S3 URL format', {
      action: 'getS3KeyFromUrl',
      url: url.split('?')[0], // Log URL without query parameters
      error,
    });
    throw new Error(`Invalid S3 URL format: ${url}`);
  }
}

// Migration function can be added later if needed
