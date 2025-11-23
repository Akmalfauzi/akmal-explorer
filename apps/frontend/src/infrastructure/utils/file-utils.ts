// Ekstrak ekstensi file dari nama file
// Contoh: "document.pdf" -> "pdf", "image.jpeg" -> "jpeg"
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) return '';
  const ext = parts[parts.length - 1];
  return ext ? ext.toLowerCase() : '';
}

// Mapping dari MIME type ke ekstensi file yang umum
const mimeTypeToExtension: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/msword': 'doc',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.ms-powerpoint': 'ppt',
  'text/plain': 'txt',
  'text/html': 'html',
  'text/css': 'css',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'application/json': 'json',
  'application/xml': 'xml',
  'text/xml': 'xml',
  'video/mp4': 'mp4',
  'video/mpeg': 'mpeg',
  'video/webm': 'webm',
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/webm': 'webm',
  'application/zip': 'zip',
  'application/x-rar-compressed': 'rar',
  'application/x-7z-compressed': '7z',
};

// Mendapatkan ekstensi dari MIME type
// Contoh: "application/pdf" -> "pdf", "image/jpeg" -> "jpg"
export function getExtensionFromMimeType(mimeType: string): string {
  return mimeTypeToExtension[mimeType.toLowerCase()] || '';
}

// Mendapatkan ekstensi file dari nama file atau MIME type
// Prioritas: 1. Dari nama file, 2. Dari MIME type
export function resolveFileExtension(filename: string, mimeType: string): string {
  const extFromName = getFileExtension(filename);
  if (extFromName) return extFromName;
  
  return getExtensionFromMimeType(mimeType);
}
