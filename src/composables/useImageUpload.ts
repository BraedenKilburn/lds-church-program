import { ref } from 'vue';

export function useImageUpload() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('Image must be smaller than 5MB'));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handleFileSelect(
    event: Event,
    onSuccess: (base64: string) => void
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
