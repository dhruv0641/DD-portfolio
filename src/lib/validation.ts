import { headers } from 'next/headers';

/**
 * Escapes common HTML character tokens to prevent Stored & Reflected XSS injections.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Decodes sanitized HTML tokens back to raw strings for text editing views.
 */
export function decodeSanitizedString(val: string): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');
}

/**
 * Validates general email patterns.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Ensures a slug contains only lowercase alphanumeric characters and hyphens.
 */
export function validateSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 100;
}

/**
 * Inspects a uploaded file properties to verify size, extension, and MIME type correctness.
 */
export function validateFileUpload(
  fileName: string, 
  base64Data: string, 
  allowedMimes: string[], 
  maxSize: number // in bytes
): { success: boolean; error?: string } {
  if (!fileName || !base64Data) {
    return { success: false, error: 'File parameters are empty.' };
  }

  // 1. Validate File Extension
  const ext = fileName.split('.').pop()?.toLowerCase();
  const dangerousExtensions = ['html', 'htm', 'js', 'exe', 'sh', 'bat', 'cmd', 'ps1', 'php', 'aspx', 'jsp'];
  if (!ext || dangerousExtensions.includes(ext)) {
    return { success: false, error: 'Dangerous file type or extension blocked.' };
  }

  // 2. Validate Size
  // Base64 string length to bytes approximation: (length * 3) / 4
  const sizeInBytes = (base64Data.length * 3) / 4;
  if (sizeInBytes > maxSize) {
    return { success: false, error: `File exceeds maximum allowed size of ${(maxSize / (1024 * 1024)).toFixed(1)}MB.` };
  }

  // 3. Simple magic numbers header check for file type verification (Defense-in-depth)
  const binaryHeader = base64Data.substring(0, 16);
  // PNG: iVBORw0KGgo (base64 of 89 50 4E 47)
  // JPEG: /9j/ (base64 of FF D8 FF)
  // PDF: JVBERi0 (base64 of 25 50 44 46)
  const isImage = binaryHeader.startsWith('iVBORw0KGgo') || binaryHeader.startsWith('/9j/') || binaryHeader.startsWith('R0lGOD') || binaryHeader.startsWith('UklGR');
  const isPdf = binaryHeader.startsWith('JVBERi0');

  if (allowedMimes.includes('application/pdf') && !isPdf && !isImage) {
    return { success: false, error: 'Uploaded file signature does not match PDF structure.' };
  }
  if (!allowedMimes.includes('application/pdf') && !isImage) {
    return { success: false, error: 'Uploaded file signature does not match supported image structure.' };
  }

  return { success: true };
}

/**
 * Generates a completely randomized, safe filename avoiding directory traversals.
 */
export function generateSafeFileName(originalName: string): string {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'bin';
  const cleanExt = ext.replace(/[^a-z0-9]/g, '');
  const uniqueId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  return `${uniqueId}.${cleanExt}`;
}

/**
 * Resolves Client IP address from request headers.
 */
export async function getClientIp(): Promise<string> {
  try {
    const reqHeaders = await headers();
    const xForwardedFor = reqHeaders.get('x-forwarded-for');
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }
    return reqHeaders.get('x-real-ip') || '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
}
