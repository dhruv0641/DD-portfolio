'use server';

import { storageService } from '@/services/storageService';
import { verifyAuthSession } from '@/lib/auth';
import { activityService } from '@/services/activityService';
import { rateLimit } from '@/lib/rateLimiter';
import { validateFileUpload, generateSafeFileName, getClientIp } from '@/lib/validation';

const ALLOWED_BUCKETS = [
  'projects',
  'blog-images',
  'certificates',
  'resume',
  'profile-images',
  'site-assets',
  'logos',
  'icons'
];

export async function getBucketFiles(bucketName: string, folderPath = '') {
  const session = await verifyAuthSession();
  if (!session) {
    throw new Error('Unauthorized.');
  }

  if (!ALLOWED_BUCKETS.includes(bucketName)) {
    throw new Error('Invalid bucket target.');
  }

  // Sanitize folder path to prevent directory traversal
  const cleanFolder = folderPath.replace(/\.\./g, '');
  return storageService.listFiles(bucketName, cleanFolder);
}

export async function uploadMediaFile(bucketName: string, path: string, base64Data: string, mimeType: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!ALLOWED_BUCKETS.includes(bucketName)) {
    return { success: false, error: 'Invalid bucket target.' };
  }

  try {
    // 1. Rate Limiting Check: 10 uploads per 10 minutes (approx 1.0 refill rate)
    const rateCheck = await rateLimit('media_upload', 10, 1);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error || 'Too many uploads.' };
    }

    const ipAddress = await getClientIp();

    // 2. Validate File Structure (Max 5MB for images/resumes)
    const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Extrapolate filename from original path
    const originalFileName = path.split('/').pop() || 'upload.png';
    const validation = validateFileUpload(originalFileName, base64Data, allowedMimes, maxSize);
    if (!validation.success) {
      return { success: false, error: validation.error || 'File validation failed.' };
    }

    // 3. Generate a safe randomized file name
    const safeName = generateSafeFileName(originalFileName);
    
    // Resolve folder path prefix
    const folderParts = path.split('/');
    folderParts.pop(); // Remove filename
    const cleanFolder = folderParts.join('/').replace(/\.\./g, '');
    const finalPath = cleanFolder ? `${cleanFolder}/${safeName}` : safeName;

    // Convert base64 back to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    const result = await storageService.uploadFile(bucketName, finalPath, buffer);
    if (!result.success) {
      return { success: false, error: 'Upload failed.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'UPLOAD',
      entity: 'MEDIA',
      details: `Uploaded file to bucket "${bucketName}" as ${finalPath}`,
      ip_address: ipAddress,
    });

    return { success: true, url: result.url };
  } catch (err: any) {
    console.error('Upload action error:', err);
    return { success: false, error: 'File upload pipeline error occurred.' };
  }
}

export async function deleteMediaFile(bucketName: string, path: string) {
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!ALLOWED_BUCKETS.includes(bucketName)) {
    return { success: false, error: 'Invalid bucket target.' };
  }

  try {
    const ipAddress = await getClientIp();
    // Sanitize path to prevent directory traversal
    const cleanPath = path.replace(/\.\./g, '');
    
    const result = await storageService.deleteFile(bucketName, cleanPath);
    if (!result.success) {
      return { success: false, error: 'Deletion failed.' };
    }

    await activityService.logEvent({
      user_name: session.username,
      action: 'DELETE',
      entity: 'MEDIA',
      details: `Deleted file from bucket "${bucketName}" at path ${cleanPath}`,
      ip_address: ipAddress,
    });

    return { success: true };
  } catch (err: any) {
    console.error('Delete action error:', err);
    return { success: false, error: 'File deletion pipeline error occurred.' };
  }
}
