import { ref } from 'vue';
import { dataUrlToFile } from '@/utils/files';

/**
 * Composable for handling file uploads with progress tracking
 * @returns {Object} Upload state and handler functions
 */
export function useFileUpload() {
  const isUploading = ref(false);
  const progress = ref(0);

  function startProgress() {
    isUploading.value = true;
    progress.value = 0;
  }

  function updateProgress(event) {
    if (event.lengthComputable) {
      progress.value = Math.round((event.loaded / event.total) * 100);
    }
  }

  function stopProgress() {
    isUploading.value = false;
    progress.value = 0;
  }

  function getFileType(b64File) {
    return b64File.split(';')[0].split(':')[1];
  }

  /**
   * Handle image file upload (reads as base64 data URL)
   * @param {File[]} files - Array of files
   * @param {Function} onComplete - Callback with (base64Result, fileName, file)
   */
  function handleImageUpload(files, onComplete) {
    if (files.length < 1) {
      onComplete(null, null, null);
      return;
    }

    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onloadstart = startProgress;
    fileReader.onprogress = updateProgress;
    fileReader.onload = (event) => {
      onComplete(event.target.result, file.name, file);
      stopProgress();
    };

    const blob = new Blob([file], { type: file.type });
    fileReader.readAsDataURL(blob);
  }

  /**
   * Handle text file upload (reads as text)
   * @param {File[]} files - Array of files
   * @param {Function} onComplete - Callback with (textContent, file)
   */
  function handleTextUpload(files, onComplete) {
    if (files.length < 1) {
      onComplete(null, null);
      return;
    }

    const file = files[0];
    const fileReader = new FileReader();

    fileReader.onloadstart = startProgress;
    fileReader.onprogress = updateProgress;
    fileReader.onload = (event) => {
      onComplete(event.target.result, file);
      stopProgress();
    };

    fileReader.readAsText(file);
  }

  /**
   * Convert base64 data URL to File object
   * @param {string} dataUrl - Base64 data URL
   * @param {string} fileName - File name
   * @returns {Promise<File|null>}
   */
  async function base64ToFile(dataUrl, fileName) {
    if (!dataUrl) return null;
    const fileType = getFileType(dataUrl);
    return dataUrlToFile(dataUrl, fileName, fileType);
  }

  return {
    isUploading,
    progress,
    handleImageUpload,
    handleTextUpload,
    base64ToFile,
    getFileType,
  };
}
