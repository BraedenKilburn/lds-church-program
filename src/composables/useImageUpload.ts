import { ref } from 'vue';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_STORED_DATA_URL_BYTES = 2.5 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1200;
const JPEG_QUALITY = 0.85;

export function useImageUpload() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function getDataUrlByteLength(dataUrl: string): number {
    return Math.ceil(dataUrl.length * 0.75);
  }

  function hasTransparentPixels(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): boolean {
    const pixels = ctx.getImageData(0, 0, width, height).data;
    for (let index = 3; index < pixels.length; index += 4) {
      if ((pixels[index] ?? 255) < 255) {
        return true;
      }
    }

    return false;
  }

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      if (file.size > MAX_UPLOAD_BYTES) {
        reject(new Error('Image must be smaller than 5MB'));
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to create canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const preserveTransparency = hasTransparentPixels(ctx, canvas.width, canvas.height);
        const dataUrl = preserveTransparency
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', JPEG_QUALITY);

        URL.revokeObjectURL(objectUrl);

        if (getDataUrlByteLength(dataUrl) > MAX_STORED_DATA_URL_BYTES) {
          reject(new Error('Compressed image is too large. Try a smaller image.'));
          return;
        }

        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image'));
      };

      img.src = objectUrl;
    });
  }

  async function handleFileSelect(
    event: Event,
    onSuccess: (base64: string) => void,
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    isLoading.value = true;
    error.value = null;

    try {
      const base64 = await convertToBase64(file);
      onSuccess(base64);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Upload failed';
    } finally {
      isLoading.value = false;
      input.value = '';
    }
  }

  return {
    isLoading,
    error,
    handleFileSelect,
    convertToBase64,
  };
}
