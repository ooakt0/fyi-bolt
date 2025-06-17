import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// Validate required environment variables
const requiredEnvVars = [
  'VITE_AWS_ACCESS_KEY_ID',
  'VITE_AWS_SECRET_ACCESS_KEY',
  'VITE_AWS_REGION',
  'VITE_AWS_S3_BUCKET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Initialize S3 client
export const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

// Constants from environment
const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET;
const UPLOAD_URL_EXPIRY = parseInt(import.meta.env.VITE_UPLOAD_URL_EXPIRY || '3600');
const DOWNLOAD_URL_EXPIRY = parseInt(import.meta.env.VITE_DOWNLOAD_URL_EXPIRY || '300');
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'); // 10MB default

export interface UploadParams {
  filePath: string;
  contentType?: string;
}

export interface PresignedUrls {
  uploadUrl: string;
  fileUrl: string;
}

/**
 * Generate pre-signed URL for file upload
 */
export async function generateUploadUrl({ filePath, contentType }: UploadParams): Promise<PresignedUrls> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      ContentType: contentType,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
      },
      ACL: 'private',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: UPLOAD_URL_EXPIRY,
      signableHeaders: new Set(['content-type', 'content-length', 'host'])
    });
    
    const region = import.meta.env.VITE_AWS_REGION;
    const fileUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${filePath}`;

    console.log('Generated upload URL with params:', {
      bucket: BUCKET_NAME,
      region,
      filePath,
      contentType,
      uploadUrl
    });

    return { uploadUrl, fileUrl };
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate pre-signed URL for file download
 */
export async function generateDownloadUrl(filePath: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: DOWNLOAD_URL_EXPIRY 
    });
    
    console.log('Generated download URL for:', {
      bucket: BUCKET_NAME,
      filePath,
      expiresIn: DOWNLOAD_URL_EXPIRY
    });
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error(`Failed to generate download URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Upload a file using a pre-signed URL
 */
export async function uploadFile(url: string, file: File): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('S3 Upload Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: url.split('?')[0], // Log URL without query parameters for security
      });
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Validate file path to prevent directory traversal
 */
export function validateFilePath(filePath: string): boolean {
  // Prevent directory traversal
  if (filePath.includes('..')) {
    return false;
  }

  // Ensure path starts with idea-files/
  if (!filePath.startsWith('idea-files/')) {
    return false;
  }

  // Additional validation can be added here
  return true;
}
