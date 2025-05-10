/**
 * Image compression utility functions
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  type?: string;
}

/**
 * Compresses an image file with specified options
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    type = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    // Create a new image
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Fill with white background to handle transparency
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Draw the image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: type,
            lastModified: Date.now(),
          });

          // Clean up
          URL.revokeObjectURL(img.src);
          resolve(compressedFile);
        },
        type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
  });
}

/**
 * Compresses an image file to a specific maximum file size
 * @param file - The image file to compress
 * @param maxSizeInMB - Maximum file size in MB
 * @returns Promise<File> - The compressed image file
 */
export async function compressImageToSize(
  file: File,
  maxSizeInMB: number = 2
): Promise<File> {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  let quality = 0.8;
  let compressedFile = file;

  // If file is already smaller than max size, return as is
  if (file.size <= maxSizeInBytes) {
    return file;
  }

  // Binary search for the best quality
  let minQuality = 0.1;
  let maxQuality = 1;
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    compressedFile = await compressImage(file, { quality });
    
    if (compressedFile.size <= maxSizeInBytes) {
      // If we're within 5% of the target size, we're good
      if (compressedFile.size >= maxSizeInBytes * 0.95) {
        break;
      }
      // If we're too small, try higher quality
      minQuality = quality;
      quality = (quality + maxQuality) / 2;
    } else {
      // If we're too big, try lower quality
      maxQuality = quality;
      quality = (minQuality + quality) / 2;
    }
    
    attempts++;
  }

  return compressedFile;
}

/**
 * Compresses a profile image with optimized settings for profile pictures
 * @param file - The image file to compress
 * @returns Promise<File> - The compressed image file
 */
export async function compressProfileImage(file: File): Promise<File> {
  return compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    type: 'image/jpeg'
  });
}

/**
 * Compresses a document image with optimized settings for documents
 * @param file - The image file to compress
 * @returns Promise<File> - The compressed image file
 */
export async function compressDocumentImage(file: File): Promise<File> {
  return compressImage(file, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    type: 'image/jpeg'
  });
}

/**
 * Validates if a file is an image
 * @param file - The file to validate
 * @returns boolean - Whether the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Gets the file size in a human-readable format
 * @param bytes - The size in bytes
 * @returns string - The formatted size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 