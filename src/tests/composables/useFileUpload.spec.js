import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFileUpload } from '@/composables/useFileUpload';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn().mockResolvedValue(new File(['test'], 'test.png', { type: 'image/png' })),
}));

describe('useFileUpload', () => {
  let fileUpload;
  let originalFileReader;

  beforeEach(() => {
    fileUpload = useFileUpload();
    originalFileReader = global.FileReader;
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    vi.clearAllMocks();
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

  it('should return reactive refs for isUploading and progress', () => {
    expect(fileUpload.isUploading).toHaveProperty('value');
    expect(fileUpload.progress).toHaveProperty('value');
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

    it('should set up onloadstart handler', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      expect(mockFileReader.onloadstart).toBeDefined();
    });

    it('should set up onprogress handler', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      expect(mockFileReader.onprogress).toBeDefined();
    });

    it('should set up onload handler', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      expect(mockFileReader.onload).toBeDefined();
    });

    it('should call onComplete with file data when onload fires', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const onComplete = vi.fn();

      let capturedOnload;
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        set onload(fn) {
          capturedOnload = fn;
        },
        get onload() {
          return capturedOnload;
        },
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      // Simulate onload event
      capturedOnload({ target: { result: 'data:image/png;base64,abc123' } });

      expect(onComplete).toHaveBeenCalledWith('data:image/png;base64,abc123', 'test.png', mockFile);
    });

    it('should process jpeg files correctly', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const onComplete = vi.fn();

      let capturedOnload;
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadstart: null,
        onprogress: null,
        set onload(fn) {
          capturedOnload = fn;
        },
        get onload() {
          return capturedOnload;
        },
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleImageUpload([mockFile], onComplete);

      // Simulate successful load
      capturedOnload({ target: { result: 'data:image/jpeg;base64,abc' } });

      expect(onComplete).toHaveBeenCalledWith('data:image/jpeg;base64,abc', 'test.jpg', mockFile);
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

    it('should call onComplete with text content when onload fires', () => {
      const mockFile = new File(['.test { color: red; }'], 'style.css', { type: 'text/css' });
      const onComplete = vi.fn();

      let capturedOnload;
      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        onprogress: null,
        set onload(fn) {
          capturedOnload = fn;
        },
        get onload() {
          return capturedOnload;
        },
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      // Simulate onload event
      capturedOnload({ target: { result: '.test { color: red; }' } });

      expect(onComplete).toHaveBeenCalledWith('.test { color: red; }', mockFile);
    });

    it('should set up onloadstart handler for text upload', () => {
      const mockFile = new File(['test'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      expect(mockFileReader.onloadstart).toBeDefined();
    });

    it('should set up onprogress handler for text upload', () => {
      const mockFile = new File(['test'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        onprogress: null,
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      expect(mockFileReader.onprogress).toBeDefined();
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

    it('should handle gif mime type', () => {
      const gifBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP';
      expect(fileUpload.getFileType(gifBase64)).toBe('image/gif');
    });

    it('should handle webp mime type', () => {
      const webpBase64 = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4';
      expect(fileUpload.getFileType(webpBase64)).toBe('image/webp');
    });

    it('should handle text/css mime type', () => {
      const cssBase64 = 'data:text/css;base64,LnRlc3QgeyBjb2xvcjog';
      expect(fileUpload.getFileType(cssBase64)).toBe('text/css');
    });
  });

  describe('base64ToFile', () => {
    it('should return null for null input', async () => {
      const result = await fileUpload.base64ToFile(null, 'test.png');
      expect(result).toBeNull();
    });

    it('should return null for undefined input', async () => {
      const result = await fileUpload.base64ToFile(undefined, 'test.png');
      expect(result).toBeNull();
    });

    it('should return null for empty string input', async () => {
      const result = await fileUpload.base64ToFile('', 'test.png');
      expect(result).toBeNull();
    });

    it('should convert base64 to file', async () => {
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg';
      const result = await fileUpload.base64ToFile(base64, 'test.png');
      expect(result).toBeDefined();
    });

    it('should call dataUrlToFile with correct parameters', async () => {
      const { dataUrlToFile } = await import('@/utils/files');
      const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg';

      await fileUpload.base64ToFile(base64, 'test.png');

      expect(dataUrlToFile).toHaveBeenCalledWith(base64, 'test.png', 'image/png');
    });
  });

  describe('progress tracking', () => {
    it('should update progress on lengthComputable event during text upload', () => {
      const mockFile = new File(['test'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      let capturedOnprogress;
      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        set onprogress(fn) {
          capturedOnprogress = fn;
        },
        get onprogress() {
          return capturedOnprogress;
        },
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      // Simulate progress event
      capturedOnprogress({ lengthComputable: true, loaded: 50, total: 100 });

      expect(fileUpload.progress.value).toBe(50);
    });

    it('should not update progress when lengthComputable is false', () => {
      const mockFile = new File(['test'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      let capturedOnprogress;
      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        set onprogress(fn) {
          capturedOnprogress = fn;
        },
        get onprogress() {
          return capturedOnprogress;
        },
        onload: null,
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      // Initial progress should be 0
      const initialProgress = fileUpload.progress.value;

      // Simulate progress event with lengthComputable false
      capturedOnprogress({ lengthComputable: false, loaded: 50, total: 100 });

      expect(fileUpload.progress.value).toBe(initialProgress);
    });

    it('should reset progress after upload completes', () => {
      const mockFile = new File(['test'], 'test.css', { type: 'text/css' });
      const onComplete = vi.fn();

      let capturedOnload;
      const mockFileReader = {
        readAsText: vi.fn(),
        onloadstart: null,
        onprogress: null,
        set onload(fn) {
          capturedOnload = fn;
        },
        get onload() {
          return capturedOnload;
        },
      };
      global.FileReader = vi.fn(() => mockFileReader);

      fileUpload.handleTextUpload([mockFile], onComplete);

      // Simulate onload event
      capturedOnload({ target: { result: 'test css content' } });

      expect(fileUpload.progress.value).toBe(0);
      expect(fileUpload.isUploading.value).toBe(false);
    });
  });

  describe('multiple instances', () => {
    it('should create independent instances', () => {
      const upload1 = useFileUpload();
      const upload2 = useFileUpload();

      // Modify one instance
      upload1.isUploading.value = true;
      upload1.progress.value = 50;

      // The other should remain unchanged
      expect(upload2.isUploading.value).toBe(false);
      expect(upload2.progress.value).toBe(0);
    });
  });
});
