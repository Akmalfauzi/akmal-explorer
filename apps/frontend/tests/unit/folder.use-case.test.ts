import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { FolderUseCase } from '../../src/application/usecases/folder.use-case';

describe('FolderUseCase', () => {
  let useCase: FolderUseCase;
  let mockService: any;

  beforeEach(() => {
    mockService = {
      getRootFolders: mock(() => Promise.resolve({ data: [], total: 0, page: 1, limit: 50 })),
      getFolderChildren: mock(() => Promise.resolve({ data: [], total: 0, page: 1, limit: 100 })),
      searchFolders: mock(() => Promise.resolve({
        query: '',
        type: 'file',
        result: { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } }
      }))
    };
    useCase = new FolderUseCase(mockService);
  });

  test('loadRootFolders should return data', async () => {
    const mockData = {
      data: [{ id: '1', name: 'Test', parentId: null, path: '/', createdAt: new Date(), updatedAt: new Date() }],
      total: 1,
      page: 1,
      limit: 50
    };
    mockService.getRootFolders = mock(() => Promise.resolve(mockData));

    const result = await useCase.loadRootFolders(1, 50);

    expect(result.data).toHaveLength(1);
    expect(mockService.getRootFolders).toHaveBeenCalledWith(1, 50);
  });

  test('loadFolderChildren should return children', async () => {
    const mockData = {
      data: [{ id: '2', name: 'Child', parentId: '1', path: '/child', createdAt: new Date(), updatedAt: new Date() }],
      total: 1,
      page: 1,
      limit: 100
    };
    mockService.getFolderChildren = mock(() => Promise.resolve(mockData));

    const result = await useCase.loadFolderChildren('1', 1, 100);

    expect(result.data).toHaveLength(1);
    expect(mockService.getFolderChildren).toHaveBeenCalledWith('1', 1, 100);
  });

  test('searchFiles should call searchFolders', async () => {
    const result = await useCase.searchFiles('test', 1, 'file');

    expect(mockService.searchFolders).toHaveBeenCalledWith('test', 1, 20, 'file');
  });

  test('searchFiles should throw error for empty query', async () => {
    await expect(useCase.searchFiles('', 1)).rejects.toThrow('Search query is required');
  });
});
