// import { v4 as uuidv4 } from 'uuid';
// import IdeaDetails from '../pages/IdeaDetails';
import { supabase } from '../store/authStore/supabaseClient';
import { FileType, IdeaFile } from '../types/fileTypes';
import { generateUploadUrl, generateDownloadUrl } from '../utils/s3';
import log from '../utils/logger';

export interface FileMetadata {
  id: string;
  idea_id: string;
  file_url: string;
  file_type: FileType;
  storage_provider: string;
  file_name: string;
  uploaded_at: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

// Function to get a pre-signed URL for file upload
export const getFileUploadUrl = async (
  ideaId: string,
  ideaName: string,
  fileType: FileType,
  originalFileName: string
): Promise<{ uploadUrl: string; fileUrl: string; fileName: string }> => {  const timestamp = Date.now(); // Use a shorter timestamp format
  const fileNameWithoutExt = originalFileName.split('.').slice(0, -1).join('.');
  const fileExtension = originalFileName.split('.').pop() || '';
  const fileName = `${fileNameWithoutExt}_${timestamp}.${fileExtension}`;
  
  // Get the base path for this idea
  const basePath = getIdeaBasePath(ideaId, ideaName);
  
  // Create the full file path
  const filePath = `${basePath}/${fileType}/${fileName}`;
  log.info('Generating pre-signed upload URL', {
    action: 'getFileUploadUrl',
    ideaId,
    fileName,
    fileType
  });

  try {
    const { uploadUrl, fileUrl } = await generateUploadUrl({ 
      filePath,
      contentType: getContentType(fileExtension)
    });

    log.info('Generated pre-signed upload URL', {
      action: 'getFileUploadUrl',
      ideaId,
      fileName,
      fileUrl
    });

    return { uploadUrl, fileUrl, fileName };
  } catch (error) {
    log.error('Failed to generate upload URL', {
      action: 'getFileUploadUrl',
      ideaId,
      fileName,
      error
    });
    throw error;
  }
};

// Function to upload file using pre-signed URL
export const uploadFileToS3 = async (url: string, file: File): Promise<void> => {
  log.info('Starting file upload to S3', {
    action: 'uploadFileToS3',
    url,
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type
  });

  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error('Failed to upload file to S3', {
        action: 'uploadFileToS3',
        status: response.status,
        fileName: file.name,
        error: errorText
      });
      throw new Error(`Failed to upload file: ${response.status} ${response.statusText} ${errorText}`);
    }

    log.info('Successfully uploaded file to S3', {
      action: 'uploadFileToS3',
      fileName: file.name,
      fileSize: file.size
    });
  } catch (error) {
    log.error('Error uploading file to S3', {
      action: 'uploadFileToS3',
      fileName: file.name,
      error
    });
    if (error instanceof Error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
    throw new Error('File upload failed: Unknown error');
  }
};

// Function to get signed URL for file access
export const getSignedFileUrl = async (fileUrl: string): Promise<string> => {
  log.info('Getting signed URL for file access', {
    action: 'getSignedFileUrl',
    fileUrl
  });

  try {
    const urlParts = fileUrl.split('.amazonaws.com/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid S3 URL format');
    }
    const filePath = urlParts[1];
    const signedUrl = await generateDownloadUrl(filePath);

    log.info('Generated signed URL for file access', {
      action: 'getSignedFileUrl',
      filePath
    });

    return signedUrl;
  } catch (error) {
    log.error('Failed to generate signed URL', {
      action: 'getSignedFileUrl',
      fileUrl,
      error
    });
    throw error;
  }
};

// Database operations for file metadata
export const saveFileMetadata = async (ideaId: string, fileUrl: string, fileType: FileType, fileName: string): Promise<FileMetadata> => {
  log.info('Saving file metadata', {
    action: 'saveFileMetadata',
    ideaId,
    fileName,
    fileType
  });

  try {
    const { data: file, error } = await supabase
      .from('idea_files')
      .insert([{
        idea_id: ideaId,
        file_url: fileUrl,
        file_type: fileType,
        storage_provider: 'aws',
        file_name: fileName,
        is_private: false,
        uploaded_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      log.error('Failed to save file metadata', {
        action: 'saveFileMetadata',
        ideaId,
        fileName,
        error
      });
      throw new Error(`Failed to save file metadata: ${error.message}`);
    }

    log.info('Successfully saved file metadata', {
      action: 'saveFileMetadata',
      ideaId,
      fileId: file.id,
      fileName
    });

    return file;
  } catch (error) {
    log.error('Error saving file metadata', {
      action: 'saveFileMetadata',
      ideaId,
      fileName,
      error
    });
    throw error;
  }
};

// Function to fetch files for an idea
export const fetchIdeaFiles = async (ideaId: string): Promise<FileMetadata[]> => {
  log.info('Fetching files for idea', {
    action: 'fetchIdeaFiles',
    ideaId
  });

  try {
    const { data: files, error } = await supabase
      .from('idea_files')
      .select('*')
      .eq('idea_id', ideaId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      log.error('Failed to fetch files', {
        action: 'fetchIdeaFiles',
        ideaId,
        error
      });
      throw new Error(`Failed to fetch files: ${error.message}`);
    }

    if (!files) {
      log.warn('No files found for idea', {
        action: 'fetchIdeaFiles',
        ideaId
      });
      return [];
    }

    log.info('Successfully fetched files', {
      action: 'fetchIdeaFiles',
      ideaId,
      fileCount: files.length
    });

    return files;
  } catch (error) {
    log.error('Error fetching files', {
      action: 'fetchIdeaFiles',
      ideaId,
      error
    });
    throw error;
  }
};

// Function to toggle file privacy
export const toggleFilePrivacy = async (fileId: string, is_private: boolean): Promise<void> => {
  const { error } = await supabase
    .from('idea_files')
    .update({ is_private })
    .eq('id', fileId);

  if (error) {
    console.error('Error updating file privacy:', error);
    throw new Error(`Failed to update file privacy: ${error.message}`);
  }
};

// Helper function to determine content type from file extension
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
}

// New centralized function to upload file with metadata
export async function uploadFileWithMetadata(ideaId: string, ideaName: string, file: File, fileType: FileType): Promise<FileMetadata> {
  const fileName = `${Date.now()}-${file.name}`;
  const basePath = getIdeaBasePath(ideaId, ideaName);
  const filePath = `${basePath}/${fileType}/${fileName}`;
  const { uploadUrl } = await generateUploadUrl({ 
    filePath,
    contentType: file.type 
  });
    try {
    await uploadFileToS3(uploadUrl, file);
    
    const { data: fileMetadata, error } = await supabase
      .from('idea_files')
      .insert({
        idea_id: ideaId,
        file_name: fileName,
        file_path: filePath,
        file_type: fileType,
        content_type: file.type,
        size_bytes: file.size,
        is_public: false
      })
      .select()
      .single();

    if (error) throw error;
    return fileMetadata as FileMetadata;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function getFileUrl(filePath: string, isPublic: boolean): Promise<string> {
  if (isPublic) {
    return `${process.env.S3_PUBLIC_URL}/${filePath}`;
  } else {
    return generateDownloadUrl(filePath); // Private URL using pre-signed URL
  }
}

// Helper function to generate the base path for an idea's files and images
export function getIdeaBasePath(ideaId: string, ideaName: string): string {
  const safeIdeaName = sanitizeFilename(ideaName);
  return `idea-files/${ideaId}-${safeIdeaName}`;
}

// Helper function to sanitize filenames for use in URLs and paths
export function sanitizeFilename(name: string): string {
  // Replace spaces with hyphens
  let sanitized = name.replace(/\s+/g, '-');
  
  // Remove any special characters that might cause issues in URLs or paths
  sanitized = sanitized.replace(/[^a-zA-Z0-9-_]/g, '');
  
  // Limit the length to prevent overly long paths
  sanitized = sanitized.slice(0, 50);
  
  // Ensure it's not empty
  if (!sanitized) {
    return 'untitled';
  }
  
  return sanitized.toLowerCase();
}
