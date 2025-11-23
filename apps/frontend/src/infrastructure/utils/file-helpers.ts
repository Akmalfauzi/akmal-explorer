/**
 * Image Optimization Utilities
 * 
 * Utilities for optimizing image loading and display performance
 */

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map(width => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Get optimal image size based on device pixel ratio
 */
export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number {
  const baseSize = containerWidth * devicePixelRatio;
  
  // Round up to nearest common size
  const commonSizes = [320, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  return commonSizes.find(size => size >= baseSize) || 3840;
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage));
}

/**
 * Get file icon based on file extension
 */
export function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const iconMap: Record<string, string> = {
    // Documents
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📝',
    'md': '📝',
    
    // Images
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'gif': '🖼️',
    'svg': '🎨',
    'webp': '🖼️',
    
    // Videos
    'mp4': '🎬',
    'mov': '🎬',
    'avi': '🎬',
    'mkv': '🎬',
    
    // Audio
    'mp3': '🎵',
    'wav': '🎵',
    'flac': '🎵',
    
    // Archives
    'zip': '📦',
    'rar': '📦',
    'tar': '📦',
    'gz': '📦',
    
    // Code
    'js': '📜',
    'ts': '📜',
    'jsx': '📜',
    'tsx': '📜',
    'vue': '💚',
    'css': '🎨',
    'html': '🌐',
    'json': '📋',
    'xml': '📋',
    
    // Other
    'folder': '📁',
  };
  
  return iconMap[ext] || '📄';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get MIME type from file extension
 */
export function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const mimeMap: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'md': 'text/markdown',
    
    // Videos
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    
    // Archives
    'zip': 'application/zip',
    'tar': 'application/x-tar',
    
    // Code
    'js': 'text/javascript',
    'ts': 'text/typescript',
    'json': 'application/json',
    'xml': 'application/xml',
    'html': 'text/html',
    'css': 'text/css',
  };
  
  return mimeMap[ext] || 'application/octet-stream';
}

/**
 * Check if file is an image
 */
export function isImage(filename: string): boolean {
  const mimeType = getMimeType(filename);
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideo(filename: string): boolean {
  const mimeType = getMimeType(filename);
  return mimeType.startsWith('video/');
}

/**
 * Get thumbnail URL for file
 */
export function getThumbnailUrl(
  fileUrl: string,
  width: number = 200,
  height: number = 200
): string {
  return `${fileUrl}?w=${width}&h=${height}&fit=cover`;
}
