/** Raw upload size cap, before client-side downscaling. */
export const MAX_IMAGE_FILE_SIZE = 8 * 1024 * 1024;

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.85;

/**
 * Reads a local image file and returns a self-contained data URL, downscaled
 * so branding photos don't bloat the schema/localStorage. SVGs are passed
 * through untouched (rasterizing a vector logo would only make it worse).
 */
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (file.type === 'image/svg+xml') {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode the selected image.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale) || 1;
        const height = Math.round(img.height * scale) || 1;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const usePng = file.type === 'image/png';
        resolve(usePng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function isDataUrlImage(value: string): boolean {
  return value.startsWith('data:image/');
}

export function estimateDataUrlSize(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.round((base64.length * 3) / 4);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
