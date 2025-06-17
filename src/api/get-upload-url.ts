import { generateUploadUrl, validateFilePath } from '../utils/s3';

export default async function handler(req: Request) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { filePath, contentType } = await req.json();

    // Validate file path
    if (!filePath || !validateFilePath(filePath)) {
      return new Response(JSON.stringify({ error: 'Invalid file path' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate pre-signed URL
    const urls = await generateUploadUrl({ filePath, contentType });

    return new Response(JSON.stringify(urls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
