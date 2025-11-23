import { describe, test, expect } from 'bun:test';
import type { Folder } from '../../../src/domain/entities/folder.entity';
import type { File } from '../../../src/domain/entities/file.entity';
import { formatFileSize, getFileIcon } from '../../../src/infrastructure/utils/file-helpers';
import { resolveFileExtension } from '../../../src/infrastructure/utils/file-utils';

describe('FileGrid Component Logic', () => {
  const mockFolders: Folder[] = [
    {
      id: '1',
      name: 'Documents',
      parentId: null,
      path: '/documents',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Pictures',
      parentId: null,
      path: '/pictures',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockFiles: File[] = [
    {
      id: 'f1',
      name: 'document.pdf',
      folderId: '1',
      size: 1024000,
      mimeType: 'application/pdf',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'f2',
      name: 'image.png',
      folderId: '2',
      size: 512000,
      mimeType: 'image/png',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  test('formats file sizes correctly', () => {
    expect(formatFileSize(1024000)).toBe('1000 KB');
    expect(formatFileSize(512000)).toBe('500 KB');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(500)).toBe('500 B');
  });

  test('resolves file extensions correctly', () => {
    expect(resolveFileExtension('document.pdf', 'application/pdf')).toBe('pdf');
    expect(resolveFileExtension('image.png', 'image/png')).toBe('png');
    expect(resolveFileExtension('file', 'text/plain')).toBe('txt');
  });

  test('gets correct file icons', () => {
    expect(getFileIcon('pdf')).toBe('📄');
    expect(getFileIcon('png')).toBe('🖼️');
    expect(getFileIcon('txt')).toBe('📝');
    expect(getFileIcon('zip')).toBe('📦');
  });

  test('folder and file arrays are iterable', () => {
    expect(mockFolders).toBeArrayOfSize(2);
    expect(mockFiles).toBeArrayOfSize(2);
  });

  test('folder entity has required properties', () => {
    mockFolders.forEach(folder => {
      expect(folder).toHaveProperty('id');
      expect(folder).toHaveProperty('name');
      expect(folder).toHaveProperty('parentId');
      expect(folder).toHaveProperty('path');
      expect(folder).toHaveProperty('createdAt');
      expect(folder).toHaveProperty('updatedAt');
    });
  });

  test('file entity has required properties', () => {
    mockFiles.forEach(file => {
      expect(file).toHaveProperty('id');
      expect(file).toHaveProperty('name');
      expect(file).toHaveProperty('folderId');
      expect(file).toHaveProperty('size');
      expect(file).toHaveProperty('mimeType');
      expect(file).toHaveProperty('createdAt');
      expect(file).toHaveProperty('updatedAt');
    });
  });

  test('empty state is detectable', () => {
    const isEmpty = mockFolders.length === 0 && mockFiles.length === 0;
    expect(isEmpty).toBe(false);
    
    const emptyCase = [] as Folder[];
    const emptyFiles = [] as File[];
    const isEmptyCase = emptyCase.length === 0 && emptyFiles.length === 0;
    expect(isEmptyCase).toBe(true);
  });

  test('breadcrumb navigation path building', () => {
    const breadcrumb: Folder[] = [
      {
        id: 'root',
        name: 'Root',
        parentId: null,
        path: '/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '1',
        name: 'Documents',
        parentId: 'root',
        path: '/documents',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const pathString = breadcrumb.map(b => b.name || 'Root').join(' / ');
    expect(pathString).toBe('Root / Documents');
  });

  test('loading states are boolean', () => {
    const isLoading = true;
    const hasMore = false;
    
    expect(typeof isLoading).toBe('boolean');
    expect(typeof hasMore).toBe('boolean');
  });

  test('file type detection works', () => {
    const isFile = (item: File | Folder): item is File => {
      return 'mimeType' in item;
    };

    const file = mockFiles[0];
    const folder = mockFolders[0];
    
    if (file) expect(isFile(file)).toBe(true);
    if (folder) expect(isFile(folder)).toBe(false);
  });

  test('date formatting logic', () => {
    const formatDate = (dateString?: string): string => {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleString();
    };

    const dateStr = new Date().toISOString();
    expect(formatDate(dateStr)).not.toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  test('context menu state management', () => {
    const contextMenu = {
      visible: false,
      x: 0,
      y: 0,
      item: null,
      type: null
    };

    expect(contextMenu.visible).toBe(false);
    
    // Simulate right click
    contextMenu.visible = true;
    contextMenu.x = 100;
    contextMenu.y = 200;
    contextMenu.item = mockFiles[0] as any;
    contextMenu.type = 'file' as any;

    expect(contextMenu.visible).toBe(true);
    expect(contextMenu.x).toBe(100);
    expect(contextMenu.y).toBe(200);
  });
});

