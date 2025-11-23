import type { IFolder } from '@repo/shared';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IFolderRepository {
  findRoots(page: number, limit: number): Promise<PaginatedResult<IFolder>>;
  findByParentId(parentId: string, page: number, limit: number): Promise<PaginatedResult<IFolder>>;
  findById(id: string): Promise<IFolder | undefined>;
  searchByName(query: string, page: number, limit: number): Promise<PaginatedResult<IFolder>>;
}