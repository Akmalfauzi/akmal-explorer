import type { IFile } from '@repo/shared';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IFileRepository {
  findByFolderId(folderId: string, page: number, limit: number): Promise<PaginatedResult<IFile>>;
  searchByName(query: string, page: number, limit: number): Promise<PaginatedResult<IFile>>;
}