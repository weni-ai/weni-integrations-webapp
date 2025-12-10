import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFileUpload } from '@/composables/useFileUpload';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(new File(['test'], 'test.png', { type: 'image/png' })),
}));

describe('useFileUpload', () => {
  let fileUpload;

  beforeEach(() => {
    fileUpload = useFileUpload();
  });

  it('should initialize with default values', () => {
    expect(fileUpload.isUploading.value).toBe(false);
    expect(fileUpload.progress.value).toBe(0);
  });

  it('should export all expected functions', () => {
    expect(typeof fileUpload.handleImageUpload).toBe('function');
    expect(typeof fileUpload.handleTextUpload).toBe('function');
    expect(typeof fileUpload.base64ToFile).toBe('function');
    expect(typeof fileUpload.getFileType).toBe('function');
  });

  describe('handleImageUpload', () => {
    it('should call onComplete with null values when files array is empty', () => {
      const onComplete = vi.fn();
      fileUpload.handleImageUpload([], onComplete);
      expect(onComplete).toHaveBeenCalledWith(null, null, null);
    });

    it('should read file as data URL when files are provided', () => {
      const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      expect(mockFileReader.readAsDataURL).toHaveBeenCalled();
    });
  });

  describe('handleTextUpload', () => {
    it('should call onComplete with null values when files array is empty', () => {
      const onComplete = vi.fn();
      fileUpload.handleTextUpload([], onComplete);
      expect(onComplete).toHaveBeenCalledWith(null, null);
    });

    it('should read file as text when files are provided', () => {
      const mockFile = new File(['test content'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      expect(mockFileReader.readAsText).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('getFileType', () => {
    it('should extract file type from base64 string', () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg';
      expect(fileUpload.getFileType(base64)).toBe('image/png');
    });

    it('should handle different mime types', () => {
      const jpegBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg';
      expect(fileUpload.getFileType(jpegBase64)).toBe('image/jpeg');
    });
  });

  describe('base64ToFile', () => {
    it('should return null for null input', async () => {
      const result = await fileUpload.base64ToFile(null, 'test.png');
      expect(result).toBeNull();
    });

    it('should convert base64 to file', async () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg';
      const result = await fileUpload.base64ToFile(base64, 'test.png');
      expect(result).toBeDefined();
    });
  });
});
