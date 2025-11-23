import { describe, test, expect, beforeEach, mock } from 'bun:test';
import { GetTreeUseCase } from '../../src/application/use-cases/folder/get-tree.use-case';
import type { IFolderRepository, PaginatedResult } from '../../src/domain/repositories/folder.repository.interface';
import type { IFolder } from '@repo/shared';

const mockFolderRepository: IFolderRepository = {
  findRoots: mock(() => Promise.resolve({
    data: [
      {
        id: '1',
        name: 'Root Folder',
        parentId: null,
        path: '/',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      }
    ],
    total: 1,
    page: 1,
    limit: 50
  } as PaginatedResult<IFolder>)),
  findById: mock(() => Promise.resolve(undefined)),
  findByParentId: mock(() => Promise.resolve({
    data: [],
    total: 0,
    page: 1,
    limit: 50
  } as PaginatedResult<IFolder>)),
  searchByName: mock(() => Promise.resolve({
    data: [],
    total: 0,
    page: 1,
    limit: 50
  } as PaginatedResult<IFolder>))
};

describe('GetTreeUseCase', () => {
  let useCase: GetTreeUseCase;

  beforeEach(() => {
    useCase = new GetTreeUseCase(mockFolderRepository);
    mock.restore();
  });

  test('should return root folders with pagination', async () => {
    const mockData = {
      data: [
        {
          id: '1',
          name: 'Documents',
          parentId: null,
          path: '/',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01')
        },
        {
          id: '2',
          name: 'Pictures',
          parentId: null,
          path: '/',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01')
        }
      ],
      total: 2,
      page: 1,
      limit: 50
    };

    mockFolderRepository.findRoots = mock(() => Promise.resolve(mockData));

    const result = await useCase.execute(1, 50);

    expect(result.data).toHaveLength(2);
    expect(result.meta.total).toBe(2);
    expect(result.meta.page).toBe(1);
    expect(mockFolderRepository.findRoots).toHaveBeenCalledWith(1, 50);
  });

  test('should handle empty result', async () => {
    const emptyData = {
      data: [],
      total: 0,
      page: 1,
      limit: 50
    };

    mockFolderRepository.findRoots = mock(() => Promise.resolve(emptyData));

    const result = await useCase.execute(1, 50);

    expect(result.data).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  test('should handle pagination correctly', async () => {
    const page2Data = {
      data: [
        {
          id: '51',
          name: 'Folder 51',
          parentId: null,
          path: '/',
          createdAt: new Date('2025-01-01'),
          updatedAt: new Date('2025-01-01')
        }
      ],
      total: 100,
      page: 2,
      limit: 50
    };

    mockFolderRepository.findRoots = mock(() => Promise.resolve(page2Data));

    const result = await useCase.execute(2, 50);

    expect(result.meta.page).toBe(2);
    expect(mockFolderRepository.findRoots).toHaveBeenCalledWith(2, 50);
  });
});
